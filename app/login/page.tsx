"use client";
import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || errorData.message);
      throw new Error(errorData.message || "Login failed. Please try again.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AuthForm
      setError={setError}
      error={error}
      onSubmit={login}
      buttonText="Login"
      title="Login"
      href="/register"
      hrefText="Dont have an account?"
    />
  );
};

export default LoginPage;
