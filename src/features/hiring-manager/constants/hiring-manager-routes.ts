export const HIRING_MANAGER_ROUTES = {
  createPassword: '/auth/employer/create-password',
  login: '/auth/employer/login',
  project: (projectId: string) =>
    `/hiring-manager/${encodeURIComponent(projectId)}`,
} as const;

export const HIRING_MANAGER_INVITE_TOKEN_PARAM = 'token';
