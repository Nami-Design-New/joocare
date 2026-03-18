import ContactLayout from "@/features/contact/ContactLayout";

export default function ContactPage() {
  const isLoggedIn = false; // غيرها حسب auth

  return <ContactLayout isLoggedIn={isLoggedIn} />;
}
