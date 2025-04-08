"use client";

import { useState, useEffect } from "react";
import { User, columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import api from "@/lib/axios";
import { UserForm } from "./_components/from-user";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";

const DashboardUserPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
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
        {loading ? (
          <TableSkeleton columns={6} rows={5} />
        ) : (
          <DataTable columns={columns} data={data} />
        )}
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
