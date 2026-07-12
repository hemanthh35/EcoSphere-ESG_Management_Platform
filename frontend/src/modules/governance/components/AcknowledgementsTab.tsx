import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Search, CheckCircle2, Clock } from 'lucide-react';
import { useAcknowledgements } from '../hooks/useGovernance';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<any>();

export function AcknowledgementsTab() {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({ skip: 0, limit: 50, search: '' });

  const { data, isLoading, isError } = useAcknowledgements(params);

  const acks = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, skip: 0 }));
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'Ack ID',
      cell: (info) => <span className="font-mono text-xs text-slate-400">{info.getValue().substring(0, 8)}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Signature Status',
      cell: (info) => {
        const val = info.getValue();
        const isAck = val === 'ACKNOWLEDGED' || val === 'Acknowledged';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isAck ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {isAck ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {val}
          </span>
        );
      },
    }),
    columnHelper.accessor('acknowledged_at', {
      header: 'Signed On',
      cell: (info) => {
        const val = info.getValue();
        return (
          <span className="text-slate-600 font-medium">
            {val ? format(new Date(val), 'MMM d, yyyy h:mm a') : 'Pending Signature'}
          </span>
        );
      },
    }),
    columnHelper.accessor('remarks', {
      header: 'Verification Remarks',
      cell: (info) => (
        <span className="text-slate-500 text-xs italic">
          {info.getValue() || '—'}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: acks,
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
              placeholder="Search signatures..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                  Loading acknowledgements...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-red-500 text-sm">
                  Failed to load acknowledgements.
                </td>
              </tr>
            ) : acks.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No policy acknowledgements recorded yet.
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
          Total Signature Acknowledgements: {total}
        </div>
      </div>
    </div>
  );
}
