import { IUser } from "@/shared/types";

export interface ILoginResponse {
  user: IUser;
  token: string;
}
