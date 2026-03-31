import ContactLayout from "@/features/contact/ContactLayout";

export default function ContactPage() {
  const isLoggedIn = true; // غيرها حسب auth

  return <ContactLayout isLoggedIn={isLoggedIn} />;
}
