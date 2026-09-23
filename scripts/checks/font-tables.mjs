import { brotliDecompressSync, inflateSync } from "node:zlib";

/* WOFF2 jadval nomlari indeks boʻyicha (spetsifikatsiya tartibi). */
const KNOWN_TAGS =
  "cmap|head|hhea|hmtx|maxp|name|OS/2|post|cvt |fpgm|glyf|loca|prep|CFF |VORG|EBDT|EBLC|gasp|hdmx|kern|LTSH|PCLT|VDMX|vhea|vmtx|BASE|GDEF|GPOS|GSUB|EBSC|JSTF|MATH|CBDT|CBLC|COLR|CPAL|SVG |sbix|acnt|avar|bdat|bloc|bsln|cvar|fdsc|feat|fmtx|fvar|gvar|hsty|just|lcar|mort|morx|opbd|prop|trak|Zapf|Silf|Glat|Gloc|Feat|Sill".split(
    "|",
  );

function readBase128(buf, pos) {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const byte = buf[pos++];
    value = value * 128 + (byte & 0x7f);
    if (!(byte & 0x80)) return [value, pos];
  }
  throw new Error("UIntBase128 buzilgan");
}

function parseWoff2(buf) {
  const numTables = buf.readUInt16BE(12);
  const totalCompressed = buf.readUInt32BE(20);
  let pos = 48;
  const entries = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[pos++];
    let tag;
    if ((flags & 0x3f) === 63) {
      tag = buf.toString("latin1", pos, pos + 4);
      pos += 4;
    } else tag = KNOWN_TAGS[flags & 0x3f];
    let origLength;
    [origLength, pos] = readBase128(buf, pos);
    const version = (flags >> 6) & 3;
    const transformed = tag === "glyf" || tag === "loca" ? version === 0 : version !== 0;
    let length = origLength;
    if (transformed) [length, pos] = readBase128(buf, pos);
    entries.push({ tag, length, transformed });
  }
  const data = brotliDecompressSync(buf.subarray(pos, pos + totalCompressed));
  const tables = new Map();
  let offset = 0;
  for (const entry of entries) {
    if (!entry.transformed) tables.set(entry.tag, data.subarray(offset, offset + entry.length));
    offset += entry.length;
  }
  return tables;
}

function parseWoff(buf) {
  const numTables = buf.readUInt16BE(12);
  const tables = new Map();
  for (let i = 0; i < numTables; i++) {
    const at = 44 + i * 20;
    const tag = buf.toString("latin1", at, at + 4);
    const offset = buf.readUInt32BE(at + 4);
    const compLength = buf.readUInt32BE(at + 8);
    const origLength = buf.readUInt32BE(at + 12);
    const raw = buf.subarray(offset, offset + compLength);
    tables.set(tag, compLength < origLength ? inflateSync(raw) : raw);
  }
  return tables;
}

function parseSfnt(buf) {
  const numTables = buf.readUInt16BE(4);
  const tables = new Map();
  for (let i = 0; i < numTables; i++) {
    const at = 12 + i * 16;
    const tag = buf.toString("latin1", at, at + 4);
    const offset = buf.readUInt32BE(at + 8);
    const length = buf.readUInt32BE(at + 12);
    tables.set(tag, buf.subarray(offset, offset + length));
  }
  return tables;
}

export function parseFontTables(buf) {
  const signature = buf.toString("latin1", 0, 4);
  if (signature === "wOF2") return parseWoff2(buf);
  if (signature === "wOFF") return parseWoff(buf);
  return parseSfnt(buf);
}

function readFormat4(cmap, at, out) {
  const segCount = cmap.readUInt16BE(at + 6) / 2;
  const endAt = at + 14;
  const startAt = endAt + segCount * 2 + 2;
  const deltaAt = startAt + segCount * 2;
  const rangeAt = deltaAt + segCount * 2;
  for (let s = 0; s < segCount; s++) {
    const end = cmap.readUInt16BE(endAt + s * 2);
    const start = cmap.readUInt16BE(startAt + s * 2);
    const delta = cmap.readInt16BE(deltaAt + s * 2);
    const rangeOffset = cmap.readUInt16BE(rangeAt + s * 2);
    for (let code = start; code <= end && code !== 0xffff; code++) {
      let glyph;
      if (rangeOffset === 0) glyph = (code + delta) & 0xffff;
      else {
        const address = rangeAt + s * 2 + rangeOffset + (code - start) * 2;
        if (address + 2 > cmap.length) continue;
        glyph = cmap.readUInt16BE(address);
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
      }
      if (glyph !== 0) out.add(code);
    }
  }
}

function readFormat12(cmap, at, out) {
  const groups = cmap.readUInt32BE(at + 12);
  for (let g = 0; g < groups; g++) {
    const base = at + 16 + g * 12;
    const start = cmap.readUInt32BE(base);
    const end = Math.min(cmap.readUInt32BE(base + 4), 0x10ffff);
    if (cmap.readUInt32BE(base + 8) === 0 && start === 0) continue;
    for (let code = start; code <= end; code++) out.add(code);
  }
}

/** Unicode cmap kichik jadvallari (4 va 12) boʻyicha qamrab olingan kod nuqtalari. */
export function readCodepoints(cmap) {
  const out = new Set();
  if (!cmap) return out;
  const count = cmap.readUInt16BE(2);
  for (let i = 0; i < count; i++) {
    const platform = cmap.readUInt16BE(4 + i * 8);
    const offset = cmap.readUInt32BE(8 + i * 8);
    if (platform !== 0 && platform !== 3) continue;
    const format = cmap.readUInt16BE(offset);
    if (format === 4) readFormat4(cmap, offset, out);
    else if (format === 12) readFormat12(cmap, offset, out);
  }
  return out;
}

export function readFamily(name) {
  if (!name) return "";
  const count = name.readUInt16BE(2);
  const stringsAt = name.readUInt16BE(4);
  const found = {};
  for (let i = 0; i < count; i++) {
    const at = 6 + i * 12;
    const platform = name.readUInt16BE(at);
    const nameId = name.readUInt16BE(at + 6);
    if (nameId !== 1 && nameId !== 16) continue;
    const length = name.readUInt16BE(at + 8);
    const offset = stringsAt + name.readUInt16BE(at + 10);
    const raw = name.subarray(offset, offset + length);
    const text =
      platform === 3 || platform === 0 ? raw.swap16().toString("utf16le") : raw.toString("latin1");
    found[`${nameId}:${platform}`] = text;
  }
  return found["16:3"] ?? found["16:1"] ?? found["1:3"] ?? found["1:1"] ?? found["1:0"] ?? "";
}
