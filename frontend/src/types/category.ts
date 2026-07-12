export const CategoryType = {
  CSR_ACTIVITY: 'CSR_ACTIVITY',
  CHALLENGE: 'CHALLENGE',
} as const;

export type CategoryType = typeof CategoryType[keyof typeof CategoryType];

export const CategoryStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type CategoryStatus = typeof CategoryStatus[keyof typeof CategoryStatus];

export interface Category {
  id: string;
  category_name: string;
  category_code: string;
  category_type: CategoryType;
  description?: string;
  color?: string;
  icon?: string;
  display_order: number;
  status: CategoryStatus;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryListItem {
  id: string;
  category_name: string;
  category_code: string;
  category_type: CategoryType;
  color?: string;
  icon?: string;
  display_order: number;
  status: CategoryStatus;
  created_at: string;
}

export interface CategoryCreate {
  category_name: string;
  category_code: string;
  category_type: CategoryType;
  description?: string;
  color?: string;
  icon?: string;
  display_order?: number;
  status?: CategoryStatus;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {}

export interface CategoryDropdownResponse {
  id: string;
  category_name: string;
  category_code: string;
  category_type: CategoryType;
}

export interface CategoryStatisticsResponse {
  total_categories: number;
  csr_categories: number;
  challenge_categories: number;
  active_categories: number;
}
