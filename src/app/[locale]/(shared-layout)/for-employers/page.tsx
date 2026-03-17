import Banner from "@/features/forEmployers/Banner";
import EmployersHero from "@/features/forEmployers/EmployersHero";
import FAQ from "@/features/forEmployers/FAQ";
import Hire from "@/features/forEmployers/Hire";
import Why from "@/features/forEmployers/Why";
import Breadcrumb from "@/shared/components/Breadcrumb";

export default function ForEmployers() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "For Employers" }]}
      />
      <section>
        <EmployersHero />
        <Banner />
        <Why />
        <Hire />
        <FAQ />
      </section>
    </>
  );
}
