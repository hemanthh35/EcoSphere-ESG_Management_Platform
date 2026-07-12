import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Edit2, Trash2, Plus, Search, ChevronLeft, ChevronRight, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDepartments, useDeleteDepartment } from '@/hooks/useDepartments';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { StatusBadge } from '@/components/ui/Badge';
import type { DepartmentListItem, DepartmentQueryParams } from '@/types/department';
import type { Department } from '@/types/department';

const columnHelper = createColumnHelper<DepartmentListItem>();

export function DepartmentsPage() {
  const [params, setParams] = useState<DepartmentQueryParams>({ skip: 0, limit: 20 });
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | undefined>(undefined);

  const { data, isLoading, isError } = useDepartments(params);
  const deleteMutation = useDeleteDepartment();

  const departments = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const page = data?.data?.page ?? 1;
  const totalPages = data?.data?.total_pages ?? 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, skip: 0 }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete department.');
    }
  };

  const handleOpenCreate = () => {
    setEditTarget(undefined);
    setFormOpen(true);
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Department',
      cell: (info) => (
        <div>
          <div className="font-medium text-slate-700">{info.getValue()}</div>
        </div>
      ),
    }),
    columnHelper.accessor('code', {
      header: 'Code',
      cell: (info) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('employee_count', {
      header: 'Employees',
      cell: (info) => <span className="text-slate-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('department_head_name', {
      header: 'Head',
      cell: (info) => (
        <span className="text-slate-600 font-medium">
          {info.getValue() || <span className="text-slate-400 italic">Unassigned</span>}
        </span>
      ),
    }),
    columnHelper.accessor('parent_department_name', {
      header: 'Parent Dept',
      cell: (info) => (
        <span className="text-slate-600">
          {info.getValue() || <span className="text-slate-400">—</span>}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            aria-label={`Edit ${row.original.name}`}
            onClick={() => {
              setEditTarget(row.original as unknown as Department);
              setFormOpen(true);
            }}
            className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
          >
            <Edit2 size={14} />
          </button>
          <button
            aria-label={`Delete ${row.original.name}`}
            onClick={() => handleDelete(row.original.id, row.original.name)}
            className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-ring"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: departments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="space-y-5">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
            { label: 'Total Departments', value: total },
            { label: 'Active', value: departments.filter((d) => d.status === 'ACTIVE').length },
            { label: 'Inactive', value: departments.filter((d) => d.status === 'INACTIVE').length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-lg p-4"
              style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
            >
              <div className="text-2xl font-bold text-slate-700">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="dept-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors focus-ring"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2">
            <Link
              to="/departments/hierarchy"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors focus-ring"
            >
              <Network size={15} className="text-primary" />
              Hierarchy View
            </Link>
            <button
              id="create-department-btn"
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors focus-ring"
              style={{ backgroundColor: '#10b981' }}
              onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#059669')}
              onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#10b981')}
            >
              <Plus size={15} />
              New Department
            </button>
          </div>
        </div>

      {/* Data Table */}
      <div
        className="bg-white border border-slate-200 rounded-lg overflow-hidden"
        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
      >
        <table className="w-full border-collapse" aria-label="Departments table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Loading departments...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-red-500 text-sm">
                  Failed to load departments. Please check the API connection.
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400 text-sm">
                  No departments found. Create your first department to get started.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages} &mdash; {total} total departments
            </span>
            <div className="flex gap-1">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setParams((p) => ({ ...p, skip: (page - 2) * 20 }))}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 disabled:opacity-40 transition-colors focus-ring"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setParams((p) => ({ ...p, skip: page * 20 }))}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 disabled:opacity-40 transition-colors focus-ring"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {formOpen && (
        <DepartmentForm
          department={editTarget}
          onClose={() => {
            setFormOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}
    </div>
  );
}
