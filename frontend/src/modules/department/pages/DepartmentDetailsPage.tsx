import { useParams, Link } from 'react-router-dom';
import { useDepartment, useDepartmentEmployees, useDepartmentChildren } from '@/hooks/useDepartments';
import { ArrowLeft, Building2, Users, Network, Mail, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export function DepartmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: deptResponse, isLoading: isLoadingDept } = useDepartment(id!);
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useDepartmentEmployees(id!);
  const { data: childrenResponse, isLoading: isLoadingChildren } = useDepartmentChildren(id!);

  const dept = deptResponse?.data;
  const employees = employeesResponse?.data || [];
  const children = childrenResponse?.data || [];

  if (isLoadingDept) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading department details...
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="p-8 text-center text-gray-500">
        Department not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/departments" 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{dept.name}</h1>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              {dept.code}
            </span>
            {dept.status === 'ACTIVE' ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                Active
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                Inactive
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Created on {format(new Date(dept.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary" />
              Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-gray-900">{dept.description || 'No description provided.'}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Parent Department</p>
                <p className="text-sm text-gray-900">
                  {dept.parent_department_id ? 'Yes (Linked)' : 'None (Top Level)'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Head of Department</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {dept.department_head_id ? 'HD' : 'NA'}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {dept.department_head_id ? 'Assigned' : 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-primary" />
              Sub-Departments ({children.length})
            </h3>
            
            {isLoadingChildren ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : children.length === 0 ? (
              <p className="text-sm text-gray-500">No child departments.</p>
            ) : (
              <ul className="space-y-3">
                {children.map(child => (
                  <li key={child.id}>
                    <Link 
                      to={`/departments/${child.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">{child.name}</p>
                        <p className="text-xs text-gray-500">{child.code}</p>
                      </div>
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {child.employee_count} members
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Employees */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Department Employees
                <span className="ml-3 bg-primary/10 text-primary py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {dept.employee_count}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 p-0">
              {isLoadingEmployees ? (
                <div className="p-8 text-center text-gray-500">Loading employees...</div>
              ) : employees.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <Users className="w-12 h-12 text-gray-300 mb-3" />
                  <h4 className="text-sm font-medium text-gray-900">No employees assigned</h4>
                  <p className="text-sm text-gray-500 mt-1">Assign employees from the user management module.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {emp.full_name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{emp.full_name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {emp.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <ShieldCheck className="w-4 h-4 mr-1.5 text-gray-400" />
                              {emp.designation || 'Staff'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              emp.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
