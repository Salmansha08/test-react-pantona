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

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      toast.error("Registrasi gagal. Coba lagi.");
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
          <CardTitle className="text-center text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-3">Name</Label>
              <Input
                type="text"
                {...register("name", { required: true })}
                placeholder="Enter your name"
              />
            </div>
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
            <div>
              <Label className="mb-3">Confirm Password</Label>
              <Input
                type="password"
                {...register("password_confirmation", { required: true })}
                placeholder="Confirm your password"
              />
            </div>
            <Button
              type="submit"
              className="cursor-pointer w-full mt-3"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
