import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getNextAuthToken() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return null;
    }

    return {
      accessToken: session.accessToken,
      authRole: session.authRole,
      user: session.user,
    };
  } catch (error) {
    void error;

    return null;
  }
}
