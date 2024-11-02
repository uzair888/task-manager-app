"use client";
import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const register = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error);
      throw new Error(
        errorData.message || "Registeration failed. Please try again."
      );
    } else {
      alert("Signup Successfull");
      router.push("/login");
    }
  };

  return (
    <AuthForm
      error={error}
      setError={setError}
      onSubmit={register}
      buttonText="Register"
      title="Register"
      href="/login"
      hrefText="Already have an account?"
    />
  );
};

export default RegisterPage;
