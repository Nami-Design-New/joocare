// TEMPORARY verification route — delete after checking the design.
import ProfileInsightsPage from '@/features/candidate-profile-insights/components/ProfileInsightsPage';

export default function Page() {
  return (
    <section className="bg-body-bg layout-shell py-8">
      <div className="layout-content grid grid-cols-12 gap-4">
        <div className="col-span-3" />
        <div className="col-span-9">
          <ProfileInsightsPage search="" page={1} />
        </div>
      </div>
    </section>
  );
}
