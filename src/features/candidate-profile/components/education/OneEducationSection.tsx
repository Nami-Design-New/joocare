import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

const OneEducationSection = () => {
    return (
        <div className="flex justify-between items-start gap-2">
            <div className="flex justify-start items-start gap-2">
                <div className="bg-accent rounded-full p-2">
                    <Image src={'/assets/building-office-2.svg'} alt="building image" width={24} height={24} />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Tanta University</h3>
                    <p className="text-sm font-normal text-muted-foreground">Bachelor&apos;s degree, Medicine and Surgery</p>
                    <span className="text-sm font-normal text-muted-foreground">2017 - 2021</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Edit width={20} height={20} className="cursor-pointer text-muted-foreground" />
                <Trash2 width={20} height={20} className="cursor-pointer text-red-400" />
            </div>
        </div>
    )
}

export default OneEducationSection
