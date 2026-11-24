export type CompanyAction = 'post-job' | 'create-assessment-category';

export type CompanyRoleAccess = {
  /** Page a user lands on when they open a page their role cannot see. */
  home: string;
  routes: readonly string[] | 'all';
  actions: readonly CompanyAction[] | 'all';
};
