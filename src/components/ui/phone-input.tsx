"use client";

import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex flex-row-reverse", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={SACountryDisplay}
          inputComponent={InputComponent}
          smartCaret={false}
          international
          defaultCountry="SA"
          country="SA"
          countries={["SA"]}
          countryCallingCodeEditable={false}
          value={value || undefined}
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn("rounded-s-lg rounded-l-none border-r-lg", className)}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

// Fixed SA country display (no dropdown since SA-only)
const SACountryDisplay = () => {
  return (
    <div className="flex items-center gap-1.5 rounded-e-lg border border-l-0 border-input bg-muted/50 px-3 h-full">
      <FlagComponent country="SA" countryName="Saudi Arabia" />
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
