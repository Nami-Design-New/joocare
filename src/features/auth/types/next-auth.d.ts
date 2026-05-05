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
import { AuthSessionUser } from "@/shared/types";

type AuthRole = "candidate" | "employer";

declare module "next-auth" {
  interface Session {
    user: AuthSessionUser;
    accessToken: string;
    authRole?: AuthRole;
    authMessage?: string;
  }

  interface User {
    user?: AuthSessionUser;
    accessToken?: string;
    authRole?: AuthRole;
    authMessage?: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthSessionUser;
    accessToken?: string;
    id?: string;
    authRole?: AuthRole;
    authMessage?: string;
  }
}
