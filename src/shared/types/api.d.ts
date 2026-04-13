export interface IApiResponse<T> {
  code: number;
  message: string;
  payload: T | null;
}
