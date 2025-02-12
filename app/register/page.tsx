"use client";
import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/Header/ThemeToggle";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    api: "",
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      api: "",
    };

    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/local/register", {
        email,
        username,
        password,
      });
      const { jwt, user } = response.data;
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error?.message || "Invalid credentials.";
        setErrors({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          api: errorMessage,
        });
      } else {
        setErrors({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          api: "Something went wrong.",
        });
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
        onSubmit={handleRegister}
        className="w-full max-w-md p-6 border rounded-xl shadow-lg bg-white dark:bg-gray-900"
      >
        <h1 className="text-2xl mb-6 font-semibold text-center">Register</h1>

        <div className="mb-4">
          <Label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="focus:ring-2 focus:ring-primary focus:outline-none"
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

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

        <div className="mb-4">
          <Label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="focus:ring-2 focus:ring-primary focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            "Register"
          )}
        </Button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
