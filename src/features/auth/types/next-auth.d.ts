// import { IUser } from "@/shared/types";

// declare module "next-auth" {
//   interface Session {
//     user: IUser;
//     accessToken: string;
//   }

//   interface User {
//     user: IUser;
//     token: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     user: IUser;
//     accessToken: string;
//   }
// }
// next-auth.d.ts
import { IUser } from "@/shared/types";

declare module "next-auth" {
  interface Session {
    user: IUser;
    accessToken: string;
  }

  interface User {
    user: IUser;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: IUser;
    accessToken?: string;
    id?: string;
  }
}
