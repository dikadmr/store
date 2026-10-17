"use client";

import { useCallback, useEffect, useState } from "react";
import { userColumns } from "./columns";
import { DataTable } from "./data-table";
import { userServices } from "@/services/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await userServices.getAllUsers();
      setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const { data } = await userServices.getAllUsers();
        if (!controller.signal.aborted) {
          setUsers(data.data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch users:", err);
        }
      }
    }

    void loadUsers();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="px-5 py-10 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Kelola semua user</p>
        </div>

        <div className="text-sm text-muted-foreground">
          Total: {users.length} users
        </div>
      </div>

      <DataTable columns={userColumns} data={users} onRefresh={fetchUsers} />
    </div>
  );
}
