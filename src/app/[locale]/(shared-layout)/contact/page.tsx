import ContactLayout from "@/features/contact/ContactLayout";
import { getNextAuthToken } from "@/shared/util/auth.util";

export default async function ContactPage() {
  const authSession = await getNextAuthToken();
  const isLoggedIn = true; // غيرها حسب auth

  void isLoggedIn;

  return (
    <ContactLayout
      authRole={authSession?.authRole}
      initialValues={{
        name: authSession?.user?.name ?? "",
        email: authSession?.user?.email ?? "",
      }}
    />
  );
}
