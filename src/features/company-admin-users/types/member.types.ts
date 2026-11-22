export type ApiCompanyAdmin = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  role: string;
  role_value: string;
  display_role: string | null;
  company_id: number;
  created_at: string;
  updated_at: string;
};

export type ApiCompanyAdminsPage = {
  data: ApiCompanyAdmin[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type CompanyMember = {
  id: number;
  name: string;
  email: string;
  phone: string;
  phoneNumber: string;
  date: string;
  role: string;
  roleValue: string;
  displayedRoleName: string;
};

export type CompanyMembersPage = {
  members: CompanyMember[];
  total: number;
  perPage: number;
  lastPage: number;
};

export type CompanyMembersFilters = {
  page: number;
  search: string;
  role: string;
};

export type CompanyAdminPayload = {
  name: string;
  email: string;
  phone: string;
  phone_code: string;
  role: string;
  display_role: string;
};
