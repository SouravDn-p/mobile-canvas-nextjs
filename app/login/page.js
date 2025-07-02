"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Button from "../components/ui/button";
import Image from "next/image";
import Card from "../components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { Package, Eye, EyeOff, Mail, Lock, Github, Shield } from "lucide-react";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";
import CardContent from "../components/ui/cardContent";
import Label from "../components/ui/Label";
import Input from "../components/ui/input";
import Separator from "../components/ui/Separator";
import CardFooter from "../components/ui/card/CardFooter";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Call API via RTK Query
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      // Redirect to home or dashboard
      router.push("/dashboard");
    } catch (err) {
      alert(err?.data?.error || "Login failed");
    }
    setIsLoading(false);
  };

  if (session) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center ">
          <Card
            variant="glass"
            className=" rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
          >
            <Image
              src={session?.user?.image || "/default-avatar.png"}
              alt="Profile"
              width={96}
              height={96}
              className="mx-auto rounded-full shadow mb-4"
            />
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome, {session?.user?.name}!
              </h1>

              <p className="text-gray-400">{session?.user?.email}</p>
            </div>
            <Link href="/">
              <Button variant="default" className="w-full cursor-pointer ">
                Go to Home Page
              </Button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,255,136,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,128,0.1),transparent_50%)]"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <h2
            className={` text-4xl tracking-tight transition-all duration-300  font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent
                      }`}
          >
            Mobile Canvas
          </h2>
          <p className="mt-3 text-gray-400">
            Create your account and start managing inventory
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 ">
        <Card variant="glass" className="hover:shadow-blue-500/10">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Sign In
            </CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Sign In Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="google"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "http://localhost:3000/",
                  })
                }
                className="w-full cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="github"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "http://localhost:3000/",
                  })
                }
                className="w-full cursor-pointer"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>

            <Separator />

            {/* Email Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    {...register("email")}
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                    className="pl-11 pr-11"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
