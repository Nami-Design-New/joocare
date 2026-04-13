import { Suspense } from "react";
import PostJobForm from "@/features/jobs/components/PostJobForm";
import Header from "@/shared/components/header/Header";

export default function page() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <section className="h-min-dvh mx-auto max-w-7xl py-12">
            <div className="flex h-full items-center justify-center rounded-2xl bg-white p-6">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </section>
        }
      >
        <PostJobForm />
      </Suspense>
    </>
  );
}
