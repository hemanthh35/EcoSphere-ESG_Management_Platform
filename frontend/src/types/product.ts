export const SustainabilityRating = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
} as const;

export type SustainabilityRating = typeof SustainabilityRating[keyof typeof SustainabilityRating];

export const ProductStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export interface ProductESGProfile {
  id: string;
  product_code: string;
  product_name: string;
  department_id: string;
  department_name?: string;
  category_id?: string | null;
  category_name?: string | null;
  description?: string | null;
  carbon_factor?: number | null;
  carbon_unit?: string | null;
  sustainability_rating?: SustainabilityRating | null;
  esg_score?: number | null;
  recyclable?: boolean;
  recycled_content_percentage?: number | null;
  renewable_material?: boolean;
  hazardous_material?: boolean;
  certification?: string | null;
  supplier_name?: string | null;
  status: ProductStatus;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export type ProductESGProfileCreate = Omit<
  ProductESGProfile,
  'id' | 'department_name' | 'category_name' | 'is_deleted' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'
>;

export type ProductESGProfileUpdate = Partial<ProductESGProfileCreate>;

export interface PaginatedProductESGResponse {
  items: ProductESGProfile[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductESGDropdownResponse {
  id: string;
  product_code: string;
  product_name: string;
  esg_score: number | null;
}

export interface ProductESGStatisticsResponse {
  total_products: number;
  active_products: number;
  avg_esg_score: number | null;
  avg_carbon_factor: number | null;
}

export interface ProductQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  department_id?: string;
  status?: string;
  sustainability_rating?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}
