"use client";

import React, { forwardRef } from "react";
import { Input } from "./ui/input";
import {
  NumericFormat,
  NumericFormatProps,
  PatternFormat,
  PatternFormatProps,
} from "react-number-format";

export const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  Partial<PatternFormatProps>
>((props, ref) => {
  return (
    <PatternFormat
      {...props}
      format="(##) # ####-####"
      customInput={Input}
      getInputRef={ref}
      placeholder="(99) 9 9999-9999"
    />
  );
});
PhoneNumberInput.displayName = "PhoneNumberInput";

export const DateOfBirthInput = forwardRef<
  HTMLInputElement,
  Partial<PatternFormatProps>
>((props, ref) => {
  return (
    <PatternFormat
      {...props}
      format="##/##/####"
      //   allowEmptyFormatting
      customInput={Input}
      getInputRef={ref}
      placeholder="01/01/1997"
    />
  );
});

DateOfBirthInput.displayName = "DateOfBirthInput";
