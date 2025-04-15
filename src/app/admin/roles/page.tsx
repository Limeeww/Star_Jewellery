"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserRole } from "../../../hooks/useUserRole";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import { UserItem } from "../../types/userTypes";
import AccountLayout from "../../Account/components/AccountLayout";
import Navbar from "../../components/Navbar/Navbar";
import ActionButton from "@/app/components/FormComponents/ActionButton";

export default function AdminRolesPage() {
  const pathname = usePathname();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const { user, role, loading } = useUserRole(); // получаем всё из хука
  const router = useRouter();

  const isLoggedIn = !loading && !!user;

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Ошибка загрузки пользователей:", err);
    }
  };

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchUsers();
    }
  }, [loading, role, user, router]);

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
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      console.error("Set role error:", error);
    } finally {
      setUpdatingUid(null);
    }
  };

  if (loading || role !== "admin") return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <AccountLayout pathname={pathname}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING ROLES
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <li
              key={user.uid}
              className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 space-y-2 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span>{" "}
                  <span
                    className={`${
                      user.role === "admin"
                        ? "text-green-600 font-semibold"
                        : "text-gray-600 font-semibold"
                    } font-medium`}
                  >
                    {user.role || "not assigned"}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 flex-wrap mt-auto">
                {user.role !== "admin" && (
                  <ActionButton
                    text="Make Admin"
                    disabled={updatingUid === user.uid}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-sm"
                    onClick={() => changeRole(user.uid, "admin")}
                  />
                )}
                {user.role !== "user" && (
                  <ActionButton
                    text="Make User"
                    disabled={updatingUid === user.uid}
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 text-sm"
                    onClick={() => changeRole(user.uid, "user")}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </AccountLayout>
    </>
  );
}
