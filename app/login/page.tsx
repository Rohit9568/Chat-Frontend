"use client";
import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import ThemeToggle from "@/components/Header/ThemeToggle";
import Link from "next/link";
import { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", api: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = { email: "", password: "", api: "" };

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/local", {
        identifier: email,
        password,
      });

      const { jwt, user } = response.data;
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error?.response?.data?.error?.message || "Invalid credentials.";

        setErrors({ email: "", password: "", api: errorMessage });
      } else {
        setErrors({ email: "", password: "", api: "Something went wrong." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed top-6 right-6">
        <ThemeToggle />
      </div>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 border rounded-xl shadow-lg bg-white dark:bg-gray-900"
      >
        <h1 className="text-2xl mb-6 font-semibold text-center">Login</h1>

        <div className="mb-4">
          <Label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-2 focus:ring-primary focus:outline-none"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-2 focus:ring-primary focus:outline-none"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {errors.api && (
          <div className="mb-4 p-2 bg-red-200 text-red-700 rounded-md">
            <p className="text-sm">{errors.api}</p>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            "Login"
          )}
        </Button>

        <p className="text-sm mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
