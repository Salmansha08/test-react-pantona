"use client";

import { useEffect, useState } from "react";
import api, { User } from "@/lib/axios";
import { UserInfo } from "@/components/user-info";
import { getImageUrl } from "@/lib/image-url";
import { Skeleton } from "./ui/skeleton";

export function UserProfileSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/auth/me");
        if (response.status === 200 && response.data?.data) {
          setUser(response.data.data);
        }
        setImageUrl(getImageUrl(response.data.data.picture));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-4 border-b border-slate-300 dark:border-slate-700">
      <div className="flex items-center gap-3">
        {loading ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : user ? (
          <UserInfo user={user} showEmail={true} imageUrl={imageUrl} />
        ) : (
          <p>User not found</p>
        )}
      </div>
    </div>
  );
}
