export type PaginatedResponse<T> = {
  code?: number;
  message?: string;

  data: T[];

  current_page?: number;
  last_page?: number;
  total?: number;
};

export type Notification = {
  id: number;
  object_id: number | null;
  from_user_id: number | null;
  to_user_id: number | null;
  from_user_table: string | null;
  to_user_table: string | null;
  action: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type NotificationsResponse = Notification[] &
  Omit<PaginatedResponse<Notification>, "data"> & {
    data: Notification[];
  };

export type NotificationMutationResponse = {
  code?: number;
  message?: string;
};
