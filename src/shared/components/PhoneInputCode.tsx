import * as React from "react";
import { CheckIcon, ChevronDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

type PhoneInputCodeProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref" | "error"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    error?: boolean
  };

const PhoneInputCode: React.ForwardRefExoticComponent<PhoneInputCodeProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputCodeProps>(
    ({ className, onChange, value, error, countrySelectProps, defaultCountry, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex gap-3 items-center justify-center", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          countrySelectProps={{
            ...countrySelectProps,
            fallbackCountry: defaultCountry,
          }}
          inputComponent={InputComponent}
          smartCaret={false}
          useNationalFormatForDefaultCountryValue
          value={value || undefined}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          numberInputProps={{ error }}
          defaultCountry={defaultCountry}
          {...props}
        />
      );
    },
  );
PhoneInputCode.displayName = "PhoneInputCode";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { error?: boolean }
>(({ className, error, ...props }, ref) => <Input
  aria-invalid={!!error}
  className={cn(
    className,
    error && "border-red-500 focus-visible:ring-red-500"
  )}
  {...props}
  ref={ref}
/>

);
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value?: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
  fallbackCountry?: RPNInput.Country;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
  fallbackCountry,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const activeCountry = selectedCountry || fallbackCountry;

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setSearchValue("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex justify-between items-center w-28.5 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input rounded-full border h-13 bg-muted px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm p-4",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ",
            "disabled:bg-disabled",

          )} disabled={disabled}
        >
          <FlagComponent
            country={activeCountry as RPNInput.Country}
            countryName={activeCountry as string}
          />
          <PhoneCode
            country={activeCountry as RPNInput.Country}
            countryName={activeCountry as string}

          />

          <ChevronDown
            className={cn(
              "-mr-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]",
                  );
                  if (viewportElement) {
                    viewportElement.scrollTop = 0;
                  }
                }
              }, 0);
            }}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={activeCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry?: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-3" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="country-flag-size">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
const PhoneCode = ({ country }: RPNInput.FlagProps) => {
  const code = country ? RPNInput.getCountryCallingCode(country) : "";

  return (
    <span className="">
      {code && <span>{`+${code}`}</span>}
    </span>
  );
};

export { PhoneInputCode };
