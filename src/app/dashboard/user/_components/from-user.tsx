"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
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
    watch,
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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.password) {
      formData.append("password", data.password);
    }

    if (pictureFile) {
      formData.append("picture", pictureFile);
    } else if (!pictureFile && typeof user?.picture === "string") {
      formData.append("picture", user.picture);
    }

    try {
      if (user) {
        await api.put(`/users/${user.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setPictureFile(null);
      setPreview(null);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        picture: user.picture ? `${baseUrl}/${user.picture}` : null,
      });

      if (user.picture) {
        setPreview(`${baseUrl}${user.picture}`);
      } else {
        setPreview(null);
      }
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
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
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
