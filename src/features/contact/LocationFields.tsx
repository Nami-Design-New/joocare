import { Select } from "./Select";

export function LocationFields() {
  const countryOptions = [
    { value: "country", label: "country" },
    { value: "egypt", label: "Egypt" },
    { value: "sa", label: "Saudi Arabia" },
  ];

  const cityOptions = [{ value: "city", label: "City" }];

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Select label="Current Location" options={countryOptions} />
      </div>

      <div>
        <Select label="City" options={cityOptions} />
      </div>
    </div>
  );
}
