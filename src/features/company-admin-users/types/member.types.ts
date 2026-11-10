export type CompanyMember = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  role: string;
  displayedRoleName: string;
};

export type CompanyMemberFormValues = Omit<CompanyMember, 'id' | 'date'>;
