"use client";
import { ButtonTypes } from "@/types/index";
import React from "react";

const Button = ({ text, onClick, disabled, className, type }: ButtonTypes) => {
  return (
    <button
      type={type}
      className={`${className} font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center `}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
