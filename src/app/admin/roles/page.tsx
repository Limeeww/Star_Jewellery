"use client";

import { useEffect, useState } from "react";
import { useUserRole } from "../../../hooks/useUserRole";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";

type UserItem = {
  uid: string;
  email: string | null;
  role: "admin" | "user" | null;
};

export default function AdminRolesPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const role = useUserRole();
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users);
    setLoading(false);
  };

  const user = auth.currentUser;

  useEffect(() => {
    if (role && role !== "admin") {
      router.push("/");
    }
  }, [role, router]);

  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    }
  }, [role]);

  const changeRole = async (uid: string, newRole: "admin" | "user") => {
    try {
      setUpdatingUid(uid);
      const idToken = await user?.getIdToken();

      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, role: newRole }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Ошибка изменения роли");

      await fetchUsers(); // обновим список после изменения
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      console.error("Set role error:", error);
    } finally {
      setUpdatingUid(null);
    }
  };

  if (loading || role !== "admin") return <Loading />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🔐 Управление ролями</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.uid} className="border p-4 rounded shadow-sm">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Роль:</strong>{" "}
              <span
                className={`font-semibold ${
                  user.role === "admin" ? "text-green-600" : "text-gray-700"
                }`}
              >
                {user.role || "не указано"}
              </span>
            </p>

            <div className="mt-2 flex gap-2">
              {user.role !== "admin" && (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={updatingUid === user.uid}
                  onClick={() => changeRole(user.uid, "admin")}
                >
                  Сделать админом
                </button>
              )}
              {user.role !== "user" && (
                <button
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  disabled={updatingUid === user.uid}
                  onClick={() => changeRole(user.uid, "user")}
                >
                  Сделать пользователем
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
