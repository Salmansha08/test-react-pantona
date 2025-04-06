"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User } from "./columns";
import api from "@/lib/axios";
import { getImageUrl } from "@/lib/image-url";
import Image from "next/image";

const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z
    .union([
      z.string().min(6, "Password minimal 6 karakter"),
      z.string().length(0),
    ])
    .optional(),
  picture: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Gambar harus kurang dari 2MB",
      }),
      z.string().optional(),
      z.null(),
    ])
    .optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const UserForm = ({ user, onSuccess, open, setOpen }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      picture: user?.picture || null,
    },
  });

  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPictureFile(file);
      setPreview(URL.createObjectURL(file));
      setValue("picture", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);

      if (data.password && data.password.length > 0) {
        formData.append("password", data.password);
      }

      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      if (user) {
        formData.append("_method", "PUT");
      }

      const response = await api.post(
        user ? `/users/${user.id}` : "/users",
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.info(
        user ? "Update response:" : "Create response:",
        response.data
      );
      toast.success(
        user ? "User updated successfully!" : "User created successfully!"
      );

      setPictureFile(null);
      setPreview(null);
      setOpen(false);

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error saving user:", error);
      console.error("Error details:", error.response?.data, error.request);
      toast.error(
        `Error saving user: ${
          error.response?.data?.message ||
          (error instanceof Error ? error.message : String(error))
        }`
      );
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        picture: user.picture || null,
      });

      if (user.picture) {
        const imagePreviewUrl = getImageUrl(user.picture);
        setPreview(imagePreviewUrl);
      } else {
        setPreview(null);
      }
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        picture: null,
      });
      setPictureFile(null);
      setPreview(null);
    }
  }, [user, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Nama */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password (hanya saat create user) */}
          {!user && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3">
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Profile Picture */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Profile Picture
            </Label>

            <div className="col-span-3 flex items-center gap-4">
              {/* Input File */}
              <div className="flex-grow">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-gray-500 text-xs">Optional - Maksimal 2MB</p>
                {errors.picture && (
                  <p className="text-red-500 text-sm">
                    {errors.picture.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tampilkan Preview Gambar */}
          <div className="flex justify-center w-full">
            {preview && (
              <div className="w-[200px] h-[200px] border rounded-md overflow-hidden shadow-md">
                <Image
                  src={preview}
                  alt={`${user?.name || "New user"} profile`}
                  className="w-full h-full object-cover"
                  width={200}
                  height={200}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              className="cursor-pointer"
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
