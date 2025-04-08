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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import { UserForm } from "./from-user";
import { getImageUrl } from "@/lib/image-url";
import api from "@/lib/axios";
import Image from "next/image";

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  picture: string;
};

function IdCell({ value }: { value: string }) {
  const shortId =
    value.length > 10
      ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
      : value;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{shortId}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-mono">{value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DateCell({ value }: { value: string }) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    setFormattedDate(formatLocalDateTime(value));
  }, [value]);

  return formattedDate ?? "Loading...";
}

function PictureCell({
  user,
  imageUrl,
}: {
  user: User;
  imageUrl: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const fullImageUrl = getImageUrl(imageUrl);

  if (!fullImageUrl) {
    return <>No Image</>;
  }

  return (
    <>
      <Image
        src={fullImageUrl}
        alt={`${user.name}'s profile`}
        className="h-10 w-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(true)}
        width={200}
        height={200}
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
            <Image
              src={fullImageUrl}
              alt={`${user.name}'s profile (large)`}
              className="max-h-[70vh] max-w-full rounded-md object-contain"
              width={500}
              height={500}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ActionsCell({ user }: { user: User }) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDelete = async () => {
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
          <DropdownMenuItem
            onClick={() => setOpenEditDialog(true)}
            className="cursor-pointer"
          >
            <Pencil className="cursor-pointer mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="cursor-pointer"
          >
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

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => <IdCell value={getValue<string>()} />,
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
    cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
  },
  {
    accessorKey: "picture",
    header: "Picture",
    cell: ({ row, getValue }) => (
      <PictureCell user={row.original} imageUrl={getValue<string | null>()} />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];
