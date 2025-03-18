"use client";

import { useState, useEffect } from "react";
import { User, columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import api from "@/lib/axios"
import { UserForm } from "./_components/from-user";
import { Button } from "@/components/ui/button";

const DashboardUserPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/users");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <div>
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p>Selamat datang di halaman dashboard user!</p>
      </div>
      <div className="flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => {
            setSelectedUser(undefined);
            setOpenEditDialog(true);
          }}
        >
          Create User
        </Button>
      </div>
      <div className="container mx-auto py-5">
        <DataTable columns={columns} data={data} />
      </div>
      {openEditDialog && (
        <UserForm
          user={selectedUser}
          onSuccess={fetchData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
        />
      )}
    </main>
  );
};

export default DashboardUserPage;
