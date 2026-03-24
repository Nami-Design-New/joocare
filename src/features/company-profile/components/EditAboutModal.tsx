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
    defaultVal: string
}
export function EditAboutModal({ open, onOpenChange, defaultVal }: EditAboutModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="max-w-175 flex flex-col  gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">Edit About</DialogTitle>
                    </DialogHeader>

                    <Textarea className="p-4 rounded-2xl bg-muted " defaultValue={defaultVal}
                    />

                    <DialogFooter className="flex justify-center! ">
                        <Button className="w-1/3" size={"pill"} type="submit">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}