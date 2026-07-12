import { useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import { 
  useEmployee, 
  useCreateEmployee, 
  useUpdateEmployee,
  useEmployeeManagers
} from '@/hooks/useEmployees';
import { useDepartmentDropdown } from '@/hooks/useDepartments';
import { RoleEnum, StatusEnum, GenderEnum } from '@/types/employee';

const schema = z.object({
  employee_code: z.string().max(20).optional().or(z.literal('')),
  first_name: z.string().max(100).optional().or(z.literal('')),
  last_name: z.string().max(100).optional().or(z.literal('')),
  full_name: z.string().min(2, "Full name is required").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal('')),
  department_id: z.string().optional().or(z.literal('')),
  designation: z.string().optional().or(z.literal('')),
  manager_id: z.string().optional().or(z.literal('')),
  role: z.nativeEnum(RoleEnum),
  gender: z.nativeEnum(GenderEnum).optional(),
  joining_date: z.string().optional().or(z.literal('')),
  status: z.nativeEnum(StatusEnum),
  password: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EmployeeFormProps {
  employeeId: string | null;
  onClose: () => void;
}

export default function EmployeeForm({ employeeId, onClose }: EmployeeFormProps) {
  const isEditing = !!employeeId;
  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(employeeId || '');
  const { data: deptResponse } = useDepartmentDropdown();
  const { data: managers } = useEmployeeManagers();
  
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: RoleEnum.EMPLOYEE,
      status: StatusEnum.ACTIVE,
    }
  });

  useEffect(() => {
    if (isEditing && employee) {
      reset({
        employee_code: employee.employee_code || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        designation: employee.designation || '',
        manager_id: employee.manager_id || '',
        role: employee.role,
        gender: employee.gender,
        joining_date: employee.joining_date || '',
        status: employee.status,
      });
    }
  }, [isEditing, employee, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        department_id: data.department_id || undefined,
        manager_id: data.manager_id || undefined,
        gender: data.gender || undefined,
        joining_date: data.joining_date || undefined,
      };

      if (isEditing) {
        // Exclude password from update if it was left blank/present
        const { password, ...updatePayload } = payload;
        await updateMutation.mutateAsync({ id: employeeId, data: updatePayload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error: any) {
      alert(error?.message || "Failed to save employee");
    }
  };

  if (isEditing && isLoadingEmployee) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
        <div className="w-full max-w-xl bg-white h-full shadow-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Employee' : 'Create New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input
                  {...register('first_name')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input
                  {...register('last_name')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name *</label>
              <input
                {...register('full_name')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              {errors.full_name && <p className="text-sm text-rose-500">{errors.full_name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email *</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Employee Code</label>
                <input
                  {...register('employee_code')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Designation</label>
                <input
                  {...register('designation')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password (for App Login)</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Optional: Enter to register them in Auth"
                />
                <p className="text-xs text-slate-500">If provided, an account will be created.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <select
                  {...register('department_id')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select Department...</option>
                  {deptResponse?.data?.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Manager</label>
                <select
                  {...register('manager_id')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select Manager...</option>
                  {managers?.filter(m => m.id !== employeeId).map((manager) => (
                    <option key={manager.id} value={manager.id}>{manager.full_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {Object.values(RoleEnum).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {Object.values(StatusEnum).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select Gender...</option>
                  {Object.values(GenderEnum).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Joining Date</label>
                <input
                  type="date"
                  {...register('joining_date')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="employee-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}
