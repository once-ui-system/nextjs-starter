"use client";

import React, { useState, useRef } from "react";
import { Flex, Input } from ".";
import styles from "./InputOTP.module.scss";

interface InputOTPProps {
  length?: number;
  onComplete?: (code: string) => void;
  onError?: (message: string) => void;
}

const InputOTP: React.FC<InputOTPProps> = ({ 
  length = 6, 
  onComplete,
  onError 
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (value === "" || /^[0-9]$/.test(value)) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      if (value && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (newValues.every((val) => val !== "") && onComplete) {
        onComplete(newValues.join(""));
      }
    } else {
      onError?.("Please enter numbers only.");
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      if (values[index]) {
        setValues((prevValues) => {
          const newValues = [...prevValues];
          newValues[index] = "";
          return newValues;
        });
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <Flex gap="8" justifyContent="center" className={styles.container}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          id={`otp-${index}`}
          label=" "
          labelAsPlaceholder
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={styles.inputs}
        />
      ))}
    </Flex>
  );
};

export { InputOTP };
export type { InputOTPProps };