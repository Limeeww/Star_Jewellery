"use client";

import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="">
      <div className="flex">
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
