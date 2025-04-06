"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ModeToggle } from "@/components/toogle-theme";
import cookie from "js-cookie";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", data);

      const token = response.data.data.token;
      localStorage.setItem("token", token);
      cookie.set("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
        path: "/",
      });

      toast.success("Login berhasil!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 dark:bg-slate-900 p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg bg-slate-50 dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-3">Email</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label className="mb-3">Password</Label>
              <Input
                type="password"
                {...register("password", { required: true })}
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              className="cursor-pointer w-full mt-3"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
