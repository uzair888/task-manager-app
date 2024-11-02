"use client";
import { InputType } from "@/types/index";
import React from "react";

const Input = ({
  lable,
  type,
  placeholder,
  onChange,
  required,
  readOnly,
  defaultValue,
}: InputType) => {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {lable}
      </label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        readOnly={readOnly}
      />
    </div>
  );
};

export default Input;
