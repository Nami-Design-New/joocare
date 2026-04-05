import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/en/auth/candidate/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_USER_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await response.json();
          // API returns { code, message, data: { user, token } }
          if (!response.ok || data.code !== 200 || !data.data) {
            return null;
          }
          const { user, token } = data.data;
          // Must return an object with at least { id, accessToken, user }
          return {
            id: String(user.id),
            user,
            accessToken: token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      // On first login
      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      session.user = token.user ?? null;
      session.accessToken = token.accessToken ?? "";
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
