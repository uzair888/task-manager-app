// AuthForm.tsx
"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  buttonText: string;
  title: string;
  setError: (message: string) => void;
  error: string;
  href: string;
  hrefText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  buttonText,
  title,
  error,
  setError,
  href,
  hrefText,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(email, password);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm flex flex-col justify-center items-center mx-auto h-[100vh]">
      <div className="w-full">
        <div className="text-4xl font-bold text-center mb-8">{title}</div>
        <form onSubmit={handleSubmit}>
          <Input
            onChange={setEmail}
            lable="Your Email"
            type="email"
            placeholder="test@example.com"
            required
          />
          <Input
            onChange={setPassword}
            lable="Your Password"
            type="password"
            placeholder="******"
            required
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-500"
            text={loading ? `${buttonText}...` : buttonText}
            disabled={loading}
          />
          <Link className="float-right text-blue-500 underline text-[14px] mt-4" href={href}>{hrefText}</Link>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
