import Image from "next/image";

export default function JobLocationAndSalaryCard() {
  return (
    <div className="card border-border shadow-card flex min-h-36 items-center justify-between rounded-2xl border-2 p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image
          src={"/assets/icons/dollar.svg"}
          width={38}
          height={38}
          alt="currancy icon"
        />
        <h4 className="text-foreground text-lg font-semibold">Salary (USD)</h4>
        <p className="text-primary text-md font-semibold">100,000 - 120,000</p>
        <span className="text-muted-foreground text-sm">Yearly salary</span>
      </div>
      <div className="bg-muted h-full w-0.5"></div>
      <div className="flex flex-col items-center justify-center gap-1">
        <Image
          src={"/assets/icons/map-pin.svg"}
          width={38}
          height={38}
          alt="currancy icon"
        />
        <h4 className="text-foreground text-lg font-semibold">Job Location</h4>
        <p className="text-muted-foreground text-md text-center font-semibold">
          Dhaka, <br /> Bangladesh
        </p>
      </div>
    </div>
  );
}
