import { StarIcon } from 'lucide-react'

const OneSkillSection = ({ label }: { label: string }) => {
    return (
        <div className="flex items-center gap-2 bg-accent rounded-full p-2">
            <StarIcon size={16} className="text-primary  fill-current" />
            <span className="text-primary text-xs font-semibold md:text-sm">{label}</span>
        </div>
    )
}

export default OneSkillSection
