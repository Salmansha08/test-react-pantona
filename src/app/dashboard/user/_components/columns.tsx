"use client";

import { formatLocalDateTime } from "@/lib/date-time";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import { UserForm } from "./from-user";
import api from "@/lib/axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  picture: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => {
      const id = getValue<string>();
      const shortId =
        id.length > 10
          ? `${id.substring(0, 6)}...${id.substring(id.length - 4)}`
          : id;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{shortId}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-mono">{id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const [formattedDate, setFormattedDate] = useState<string | null>(null);

      useEffect(() => {
        const rawDate = getValue<string>();
        setFormattedDate(formatLocalDateTime(rawDate));
      }, []);

      return formattedDate ?? "Loading...";
    },
  },
  {
    accessorKey: "picture",
    header: "Picture",
    cell: ({ getValue }) => {
      const imageUrl = getValue<string | null>();
      const [isOpen, setIsOpen] = useState(false);

      if (!imageUrl) {
        return "No Profile Picture";
      }

      const baseUrlParts = baseUrl ? baseUrl.split("/api") : [];
      const baseUrlDomain = baseUrlParts.length > 0 ? baseUrlParts[0] : "";

      const fullImageUrl = `${baseUrlDomain}${imageUrl}`;

      return (
        <>
          <img
            src={fullImageUrl}
            alt="User Profile"
            className="h-10 w-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(true)}
          />

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md md:max-w-xl">
              <DialogHeader>
                <DialogTitle>User Profile Image</DialogTitle>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              <div className="flex items-center justify-center p-6">
                <img
                  src={fullImageUrl}
                  alt="User Profile (Large)"
                  className="max-h-[70vh] max-w-full rounded-md object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const [openEditDialog, setOpenEditDialog] = useState(false);

      const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${user.name}?`))
          return;

        try {
          await api.delete(`/users/${user.id}`);
          alert("User deleted successfully!");
          window.location.reload();
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
                <Pencil className="cursor-pointer mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="cursor-pointer mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {openEditDialog && (
            <UserForm
              user={user}
              open={openEditDialog}
              setOpen={setOpenEditDialog}
            />
          )}
        </>
      );
    },
  },
];
