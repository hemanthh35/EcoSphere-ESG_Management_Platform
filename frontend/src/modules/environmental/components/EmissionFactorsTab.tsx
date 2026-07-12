import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useEmissionFactors, useDeleteEmissionFactor } from '../hooks/useEnvironmental';
import { EmissionFactor } from '../types/environmental';
import { EmissionFactorForm } from './EmissionFactorForm';
import { StatusBadge } from '@/components/ui/Badge';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<EmissionFactor>();

export function EmissionFactorsTab() {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({ skip: 0, limit: 20, search: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EmissionFactor | undefined>(undefined);

  const { data, isLoading, isError } = useEmissionFactors(params);
  const deleteMutation = useDeleteEmissionFactor();

  const factors = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, skip: 0 }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const columns = [
    columnHelper.accessor('factor_code', {
      header: 'Code',
      cell: (info) => <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{info.getValue()}</span>,
    }),
    columnHelper.accessor('factor_name', {
      header: 'Name',
      cell: (info) => <span className="font-medium text-slate-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => <span className="text-slate-600 text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('co2e_factor', {
      header: 'CO2e Factor',
      cell: (info) => (
        <span className="font-semibold text-slate-700">
          {info.getValue()} <span className="text-slate-400 text-xs font-normal ml-1">kg CO₂e/{info.row.original.unit}</span>
        </span>
      ),
    }),
    columnHelper.accessor('effective_from', {
      header: 'Effective Date',
      cell: (info) => <span className="text-slate-500 text-sm">{format(new Date(info.getValue()), 'MMM d, yyyy')}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditTarget(row.original);
              setFormOpen(true);
            }}
            className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleDelete(row.original.id, row.original.factor_name)}
            className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: factors,
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
              placeholder="Search factors..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
          >
            Search
          </button>
        </form>

        <button
          onClick={() => {
            setEditTarget(undefined);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md bg-green-600 hover:bg-green-700 transition-colors"
        >
          <Plus size={15} />
          Add Factor
        </button>
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
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-red-500 text-sm">
                  Failed to load emission factors.
                </td>
              </tr>
            ) : factors.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No emission factors found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
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
          Total factors: {total}
        </div>
      </div>

      {formOpen && (
        <EmissionFactorForm
          factor={editTarget}
          onClose={() => {
            setFormOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}
    </div>
  );
}
