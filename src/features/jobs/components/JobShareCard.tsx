import Image from "next/image";

export default function JobShareCard() {
  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        Share this job:
      </h2>
      <div className="flex gap-2">
        <div className="text-primary bg-accent flex items-center gap-2 rounded-[4px] px-4 py-2">
          <Image
            src="/assets/icons/pin-link-icon.svg"
            alt="link icon"
            width={24}
            height={24}
          />
          <span className="text-lg">Copy Link</span>
        </div>
        <div className="flex gap-2">
          <div className="bg-accent flex items-center justify-center rounded-[4px] p-2.5">
            <Image
              src="/assets/icons/linkedin-filled.svg"
              width={20}
              height={20}
              alt="Linked in icon"
            />
          </div>
          <div className="bg-accent flex items-center justify-center rounded-[4px] p-2.5">
            <Image
              src="/assets/icons/facebook-filled.svg"
              width={20}
              height={20}
              alt="Facebook icon"
            />
          </div>
          <div className="bg-accent flex items-center justify-center rounded-[4px] p-2.5">
            <Image
              src="/assets/icons/x-filled.svg"
              width={20}
              height={20}
              alt="Linked in icon"
            />
          </div>

          <div className="bg-accent flex items-center justify-center rounded-[4px] p-2.5">
            <Image
              src="/assets/icons/envelope.svg"
              width={20}
              height={20}
              alt="envelope icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
