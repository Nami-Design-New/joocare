import { ChevronRight} from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Breadcrumb() {
  return (
    <div
        className="px-6 py-6 h-[100px] text-white"
        style={{
          background: "linear-gradient(270deg, #3EB33F 0%, #09760A 100.62%)",
        }}
      >
       <div className="mx-auto max-w-6xl   flex items-center justify-between ">
         <h6 className=" text-lg font-semibold">Contact us</h6>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-white/90">
            <li>
              <Link href="/" className="text-white/90 hover:underline">
                Home
              </Link>
            </li>
            <li className="text-white/70">
              <ChevronRight width={20} hanging={20} />
            </li>
            <li aria-current="page" className="font-semibold text-white">
              Contact us
            </li>
          </ol>
        </nav>
       </div>
      </div>
  )
}
