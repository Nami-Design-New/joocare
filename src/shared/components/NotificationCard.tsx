import Image from "next/image";

export default function NotificationCard() {
  return (
    <section className="border-b-border flex gap-2 border-b border-dashed p-4 border-dahed-spa">
      <Image
        src="/assets/comp-logo.svg"
        width={52}
        height={46}
        alt="company Logo"
      />
      <div>
        <h6 className="text-foreground text-md font-normal">
          Your account is now accessible again, Ahmad.
        </h6>
        <p className="text-muted-foreground mt-1 text-sm">now</p>
      </div>
    </section>
  );
}
