import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { getAuthApiUrl, getCompanyApiUrl, getUserApiUrl } from "./shared/lib/api-endpoints";
import { AuthSessionUser } from "./shared/types";
import { apiFetch, ApiFetchResponse } from "./shared/lib/fetch-manager";

type AuthRole = "candidate" | "employer";
type SocialProvider = "google" | "linkedin";

function extractToken(payload: ApiFetchResponse | null) {
  const data = payload?.data as Record<string, unknown> | undefined;

  return (
    (typeof payload?.token === "string" && payload.token) ||
    (typeof payload?.access_token === "string" && payload.access_token) ||
    (typeof data?.token === "string" && data.token) ||
    (typeof data?.access_token === "string" && data.access_token) ||
    null
  );
}

function extractUser(payload: ApiFetchResponse | null) {
  const data = payload?.data as Record<string, unknown> | undefined;
  const candidates = [
    data?.user,
    data?.profile,
    data?.company,
    data?.employer,
    data,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && "id" in candidate) {
      return candidate as AuthSessionUser;
    }
  }

  return null;
}

async function fetchProfile(baseUrl: string, token: string, locale: string) {
  const { ok, data: profileData } = await apiFetch(
    `${baseUrl}/auth/profile`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    return null;
  }

  return extractUser(profileData);
}

async function authorizeWithEndpoint({
  credentials,
  baseUrl,
  role,
}: {
  credentials?: Record<string, string>;
  baseUrl?: string;
  role: AuthRole;
}) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required.");
  }

  if (!baseUrl) {
    throw new Error("Authentication endpoint is not configured.");
  }

  const formData = new FormData();
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);

  const { data, ok, message } = await apiFetch(`${baseUrl}/auth/login`, {
    method: "POST",
    locale: credentials.locale ?? "en",
    body: formData,
  });
  const errorMessage = message || "Invalid email or password.";
  const accessToken = extractToken(data);
  const loginUser = extractUser(data);

  if (!ok || !accessToken) {
    throw new Error(errorMessage);
  }

  const user =
    loginUser ??
    (await fetchProfile(baseUrl, accessToken, credentials.locale ?? "en"));

  if (!user?.id) {
    throw new Error("Login succeeded but profile data could not be loaded.");
  }

  return {
    id: String(user.id),
    user,
    accessToken,
    authRole: role,
    authMessage: data?.message ?? "Login successful.",
  };
}

function parseSocialProvider(providerId: string): {
  role: AuthRole;
  provider: SocialProvider;
} | null {
  const mapping: Record<string, { role: AuthRole; provider: SocialProvider }> = {
    "google-candidate": { role: "candidate", provider: "google" },
    "google-employer": { role: "employer", provider: "google" },
    "linkedin-candidate": { role: "candidate", provider: "linkedin" },
    "linkedin-employer": { role: "employer", provider: "linkedin" },
  };

  return mapping[providerId] ?? null;
}

async function authorizeWithSocialEndpoint({
  role,
  provider,
  providerId,
  name,
  email,
  image,
}: {
  role: AuthRole;
  provider: SocialProvider;
  providerId: string;
  name: string;
  email: string;
  image?: string | null;
}) {
  const baseUrl = getAuthApiUrl(role);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("provider", provider);
  formData.append("provider_id", providerId);
  formData.append("image", image ?? "");
  formData.append("phone", "");
  formData.append("phone_code", "");

  const { data, ok, message } = await apiFetch(`${baseUrl}/auth/social-login`, {
    method: "POST",
    body: formData,
  });

  const accessToken = extractToken(data);
  const loginUser = extractUser(data);

  if (!ok || !accessToken || !loginUser?.id) {
    throw new Error(message || "Social login failed.");
  }

  return {
    id: String(loginUser.id),
    user: loginUser,
    accessToken,
    authRole: role,
    authMessage: message ?? "Login successful.",
  };
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/en/auth/candidate/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
        GoogleProvider({
          id: "google-candidate",
          name: "Google Candidate",
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GoogleProvider({
          id: "google-employer",
          name: "Google Employer",
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
      : []),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
        LinkedInProvider({
          id: "linkedin-candidate",
          name: "LinkedIn Candidate",
          clientId: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        }),
        LinkedInProvider({
          id: "linkedin-employer",
          name: "LinkedIn Employer",
          clientId: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        }),
      ]
      : []),
    Credentials({
      id: "candidate-credentials",
      name: "Candidate Credentials",
      credentials: {
        email: {},
        password: {},
        locale: {},
        accessToken: {},
        user: {},
      },
      async authorize(credentials) {
        // token from register
        if (credentials?.accessToken) {
          return {
            id: "temp-id",
            user: JSON.parse(credentials.user || "{}"),
            accessToken: credentials.accessToken,
            authRole: "candidate",
            authMessage: "Registered successfully",
          };
        }
        return authorizeWithEndpoint({
          credentials,
          baseUrl: getUserApiUrl(),
          role: "candidate",
        });
      },
    }),
    Credentials({
      id: "employer-credentials",
      name: "Employer Credentials",
      credentials: {
        email: {},
        password: {},
        locale: {},
        accessToken: {},
        user: {},
      },
      async authorize(credentials) {
        // token from register
        if (credentials?.accessToken) {
          return {
            id: "temp-id",
            user: JSON.parse(credentials.user || "{}"),
            accessToken: credentials.accessToken,
            authRole: "employer",
            authMessage: "Registered successfully",
          };
        }
        return authorizeWithEndpoint({
          credentials,
          baseUrl: getCompanyApiUrl(),
          role: "employer",
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider) {
        const socialProvider = parseSocialProvider(account.provider);

        if (socialProvider && user?.email) {
          const socialSession = await authorizeWithSocialEndpoint({
            role: socialProvider.role,
            provider: socialProvider.provider,
            providerId: account.providerAccountId,
            name: user.name ?? user.email,
            email: user.email,
            image: user.image,
          });

          token.user = socialSession.user;
          token.accessToken = socialSession.accessToken;
          token.id = socialSession.id;
          token.authRole = socialSession.authRole;
          token.authMessage = socialSession.authMessage;

          return token;
        }
      }

      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.authRole = user.authRole;
        token.authMessage = user.authMessage;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user ?? session.user;
      session.accessToken = token.accessToken ?? "";
      session.authRole = token.authRole;
      session.authMessage = token.authMessage;

      if (session.user && token.id) {
        session.user.id = Number(token.id);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
