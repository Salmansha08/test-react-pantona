"use client"

import { formatLocalDateTime } from "@/lib/date-time"
import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { UserForm } from "./from-user"
import api from "@/lib/axios"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type User = {
  id: string
  name: string
  email: string
  created_at: string
  picture: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
      const [formattedDate, setFormattedDate] = useState<string | null>(null)

      useEffect(() => {
        const rawDate = getValue<string>()
        setFormattedDate(formatLocalDateTime(rawDate))
      }, [])

      return formattedDate ?? "Loading..."
    },
  },
  {
    accessorKey: "picture",
    header: "Picture",
    cell: ({ getValue }) => {
      const imageUrl = getValue<string | null>()

      if (!imageUrl) {
        return "No Profile Picture"
      }

      return (
        <img
          src={`${baseUrl}${imageUrl}`}
          alt="User Profile"
          className="h-10 w-10 rounded-lg object-cover"
        />
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const [openEditDialog, setOpenEditDialog] = useState(false);

      const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;

        try {
          await api.delete(`/api/users/${user.id}`);
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
            <UserForm user={user} open={openEditDialog} setOpen={setOpenEditDialog} />
          )}
        </>
      )
    },
  },
]
