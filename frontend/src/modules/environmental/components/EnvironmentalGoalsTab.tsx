import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Search, Target } from 'lucide-react';
import { useEnvironmentalGoals } from '../hooks/useEnvironmental';
import type { EnvironmentalGoal } from '../types/environmental';
import { StatusBadge } from '@/components/ui/Badge';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<EnvironmentalGoal>();

export function EnvironmentalGoalsTab() {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({ skip: 0, limit: 50, search: '' });

  const { data, isLoading, isError } = useEnvironmentalGoals(params);

  const goals = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, skip: 0 }));
  };

  const columns = [
    columnHelper.accessor('goal_name', {
      header: 'Goal Name',
      cell: (info) => (
        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-brand-600" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('target_co2', {
      header: 'Target Value',
      cell: (info) => (
        <span className="font-medium text-slate-700">
          {info.getValue().toLocaleString()} kg CO₂
        </span>
      ),
    }),
    columnHelper.accessor('current_co2', {
      header: 'Current Reduction',
      cell: (info) => (
        <span className="font-medium text-green-600">
          {info.getValue().toLocaleString()} kg CO₂
        </span>
      ),
    }),
    columnHelper.accessor('progress_percentage', {
      header: 'Progress',
      cell: (info) => {
        const pct = Math.min(Math.round(info.getValue()), 100);
        return (
          <div className="w-full max-w-[150px]">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-bold text-slate-600">{pct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('deadline', {
      header: 'Target Deadline',
      cell: (info) => (
        <span className="text-slate-500">
          {format(new Date(info.getValue()), 'MMM d, yyyy')}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data: goals,
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
              placeholder="Search goals..."
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
                  Loading goals...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-red-500 text-sm">
                  Failed to load environmental goals.
                </td>
              </tr>
            ) : goals.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No active goals found.
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
          Total Goals active: {total}
        </div>
      </div>
    </div>
  );
}
