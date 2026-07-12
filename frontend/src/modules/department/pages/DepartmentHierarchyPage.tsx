import { DepartmentTree } from '@/components/departments/DepartmentTree';
import { useDepartmentTree, useDepartmentStatistics } from '@/hooks/useDepartments';
import { Building2, Users, Network, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DepartmentHierarchyPage() {
  const { data: treeResponse, isLoading: isLoadingTree } = useDepartmentTree();
  const { data: statsResponse, isLoading: isLoadingStats } = useDepartmentStatistics();

  const treeData = treeResponse?.data || [];
  const stats = statsResponse?.data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizational Hierarchy</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your enterprise department structure</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/departments"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Building2 className="w-4 h-4 mr-2" />
            List View
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <Building2 className="w-4 h-4 mr-2 text-primary" />
            Total Departments
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {isLoadingStats ? '-' : stats?.total_departments || 0}
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
            Active
          </div>
          <span className="text-3xl font-bold text-green-600">
            {isLoadingStats ? '-' : stats?.active_departments || 0}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <Network className="w-4 h-4 mr-2 text-orange-500" />
            Inactive
          </div>
          <span className="text-3xl font-bold text-orange-600">
            {isLoadingStats ? '-' : stats?.inactive_departments || 0}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Total Employees
          </div>
          <span className="text-3xl font-bold text-blue-600">
            {isLoadingStats ? '-' : stats?.total_employees || 0}
          </span>
        </div>
      </div>

      {/* Tree View */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Structure</h2>
        <DepartmentTree data={treeData} isLoading={isLoadingTree} />
      </div>
    </div>
  );
}
