import { Button } from "@/shared/components/ui/button";

interface Props {
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => void;
  prev: () => void;
}

export default function WizardNavigation({
  isFirstStep,
  isLastStep,
  next,
  prev,
}: Props) {

  return (
    <div className="flex justify-center items-center mt-5 w-full gap-2">
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline"
          size="pill"
          onClick={prev}
          className="w-1/3 lg:w-56"

        >
          Prev
        </Button>
      )}

      {!isLastStep && (
        <Button
          type="button"
          variant="secondary"
          size="pill"
          onClick={next}
          className="w-1/3 lg:w-56"
        >
          Next
        </Button>
      )}

      {isLastStep && (
        <Button
          variant="secondary"
          size="pill"
          type="submit"
          className="w-1/3 lg:w-56"
        >
          Submit
        </Button>
      )}
    </div>
  );
}