import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Search, Leaf } from 'lucide-react';
import { useCarbonTransactions } from '../hooks/useEnvironmental';
import type { CarbonTransaction } from '../types/environmental';
import { StatusBadge } from '@/components/ui/Badge';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<CarbonTransaction>();

export function CarbonTransactionsTab() {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({ skip: 0, limit: 50, search: '' });

  const { data, isLoading, isError } = useCarbonTransactions(params);

  const transactions = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, skip: 0 }));
  };

  const columns = [
    columnHelper.accessor('transaction_number', {
      header: 'Tx Number',
      cell: (info) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('transaction_date', {
      header: 'Date',
      cell: (info) => (
        <span className="text-slate-600 font-medium">
          {format(new Date(info.getValue()), 'MMM d, yyyy')}
        </span>
      ),
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => (
        <span className="text-slate-600">
          {info.getValue().toLocaleString()} <span className="text-slate-400 text-xs">{info.row.original.unit}</span>
        </span>
      ),
    }),
    columnHelper.accessor('calculated_emission', {
      header: 'Carbon Footprint',
      cell: (info) => (
        <span className="font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-xs inline-flex items-center gap-1">
          <Leaf className="w-3 h-3" />
          {info.getValue().toLocaleString()} kg CO₂e
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('notes', {
      header: 'Operational Notes',
      cell: (info) => (
        <span className="text-slate-400 text-xs truncate max-w-[200px] block" title={info.getValue()}>
          {info.getValue() || '—'}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  Loading telemetry...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-red-500 text-sm">
                  Failed to load carbon transactions.
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No transactions found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-slate-700 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
          Total Transactions logged: {total}
        </div>
      </div>
    </div>
  );
}
