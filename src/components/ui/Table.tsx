import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TableColumn<K extends string> {
  readonly key: K;
  readonly label: ReactNode;
  /** Raqamli ustun: oʻngga tekislanadi, tabular-nums. */
  readonly numeric?: boolean;
}

export interface TableRow<K extends string> {
  readonly key: string;
  readonly cells: Partial<Record<K, ReactNode>>;
}

export interface TableProps<K extends string> {
  readonly caption: ReactNode;
  readonly columns: readonly TableColumn<K>[];
  readonly rows: readonly TableRow<K>[];
  /** Sarlavha faqat ekran oʻquvchisi uchun boʻlsa. */
  readonly captionHidden?: boolean;
  readonly className?: string;
}

export function Table<K extends string>({
  caption,
  columns,
  rows,
  captionHidden = false,
  className,
}: TableProps<K>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="t-body w-full border-collapse text-ink">
        <caption className={cn("t-small pb-3 text-left text-ink-3", captionHidden && "sr-only")}>
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "t-label border-b border-line-strong px-3 py-3 align-bottom text-ink-2",
                  column.numeric ? "text-right" : "text-left",
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "border-b border-line px-3 py-3 align-top",
                    column.numeric ? "tnum text-right" : "text-left",
                  )}
                >
                  {row.cells[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
