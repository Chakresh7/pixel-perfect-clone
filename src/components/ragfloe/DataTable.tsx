import React from 'react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows, onRowClick, className }) => (
  <div className={cn('bg-dark-surface border border-dark-border rounded-lg overflow-hidden', className)}>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#0D0D14] border-b border-dark-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-2.5 text-left font-mono text-[10px] uppercase text-gray-500 tracking-wide"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row, i)}
              className={cn(
                'border-b border-[#18181F] last:border-0 transition-colors duration-100',
                onRowClick && 'cursor-pointer hover:bg-dark-surface-raised'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 font-mono text-xs text-[#E2E8F0]">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export { DataTable };
