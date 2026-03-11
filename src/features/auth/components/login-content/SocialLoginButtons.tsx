import GoogleButton from "../ui/GoogleButton";
import LinkedInButton from "../ui/LinkedInButton";

const SocialLoginButtons = () => {
  return (
    <section aria-labelledby="social-login-heading" className="flex gap-4">
      <LinkedInButton />
      <GoogleButton />
    </section>
  );
};

export default SocialLoginButtons;
