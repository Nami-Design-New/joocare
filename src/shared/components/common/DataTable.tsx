import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  renderCell: (item: T, index: number) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
  dir?: "ltr" | "rtl";
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
  headerRowClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
};

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  dir,
  ariaLabel,
  className,
  containerClassName,
  headerRowClassName,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", containerClassName)}>
      <Table className={className} dir={dir} aria-label={ariaLabel}>
        <TableHeader>
          <TableRow className={headerRowClassName}>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "px-4 py-5 text-center text-[18px] leading-normal font-semibold",
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={getRowKey(item)}
              className={cn(
                typeof rowClassName === "function"
                  ? rowClassName(item, index)
                  : rowClassName,
              )}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    "px-4 py-3 text-center text-[16px] leading-normal font-normal text-foreground",
                    column.cellClassName,
                  )}
                >
                  {column.renderCell(item, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
