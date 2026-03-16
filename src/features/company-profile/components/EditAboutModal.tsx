import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";

interface EditAboutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function EditAboutModal({ open, onOpenChange }: EditAboutModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="max-w-175 flex flex-col  gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">Edit About</DialogTitle>
                    </DialogHeader>

                    <Textarea className="p-4 rounded-2xl bg-muted " defaultValue={`Saudi German Hospitals is the leading healthcare provider and the number one healthcare brand in the MENA region. Saudi German Hospital – Egypt is part of the renowned SGH Group, founded in 1988 by the El Batterji family. Today, the group operates 14 hospitals across 4 countries: Egypt, Saudi Arabia, the UAE, and Yemen. As a tertiary care hospital, SGH–Egypt aspires to be a premier healthcare destination and an employer of choice, attracting top medical talent from across the region, the hospital is committed to establishing itself as one of Egypt’s leading tertiary care institutions SGH–Egypt will provide a comprehensive range of medical services, covering all specialties, sub-specialties, and critical care units, all delivered in line with the highest international healthcare standards.`}
                    />

                    <DialogFooter className="flex justify-center! ">
                        <Button className="w-1/3" size={"pill"} type="submit">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}