import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Users } from 'lucide-react';
import type { DepartmentTreeResponse } from '@/types/department';
import { Link } from 'react-router-dom';

interface DepartmentTreeNodeProps {
  node: DepartmentTreeResponse;
  level?: number;
}

const DepartmentTreeNode: React.FC<DepartmentTreeNodeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-2 px-3 hover:bg-gray-50 rounded-md group transition-colors ${
          level === 0 ? 'bg-gray-50/50 mb-2' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {/* Toggle Button */}
        <div 
          className="w-6 h-6 flex items-center justify-center mr-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 hover:text-primary transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 hover:text-primary transition-colors" />
            )
          ) : (
            <div className="w-4 h-4" /> // Spacer for alignment
          )}
        </div>

        {/* Node Content */}
        <div className="flex items-center flex-1 min-w-0">
          <Building2 className={`w-5 h-5 mr-3 flex-shrink-0 ${level === 0 ? 'text-primary' : 'text-gray-400'}`} />
          <div className="flex-1 truncate flex items-center gap-3">
            <span className={`font-medium truncate ${level === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
              {node.name}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {node.code}
            </span>
            {node.status === 'INACTIVE' && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Node Actions / Info */}
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center text-sm text-gray-500" title="Total Employees">
            <Users className="w-4 h-4 mr-1.5" />
            {node.employee_count}
          </div>
          <Link
            to={`/departments/${node.id}`}
            className="text-sm text-primary hover:text-primary/80 font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-1 relative">
          {/* Vertical alignment line for children */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"
            style={{ left: `${level * 1.5 + 1.5}rem` }}
          />
          {node.children.map((child) => (
            <DepartmentTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface DepartmentTreeProps {
  data: DepartmentTreeResponse[];
  isLoading?: boolean;
}

export const DepartmentTree: React.FC<DepartmentTreeProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading organizational structure...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Departments Found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Start building your organizational structure by creating your first department.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {data.map((node) => (
        <DepartmentTreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};
