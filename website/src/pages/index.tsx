"use client";
import { useEffect, useState } from "react";
import Workspace from "./workspace";
import PublicLayout from "@/layout/PublicLayout";
import { hasToken } from "@/utils";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasToken()); // Runs only on the client
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isAuthenticated ? <Workspace /> : <PublicLayout />}
    </main>
  );
}
