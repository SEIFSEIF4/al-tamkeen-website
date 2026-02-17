"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";

// SHA-256 hash of the admin password — the actual password is NOT in the code
const ADMIN_PASSWORD_HASH =
  "b493da8d531295a4580f2e4a4e625a3e83d3981dff4bce87fa3fc8bd8b7b08e4";

// Hash a string using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("admin_auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError("");

    const hashed = await hashPassword(password);

    if (hashed === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("كلمة المرور غير صحيحة");
    }
    setIsChecking(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir="rtl"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 mt-2 text-center">
            يرجى إدخال كلمة المرور للوصول إلى هذه الصفحة
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-left ltr"
              disabled={isChecking}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4B3D90] hover:bg-[#3D3270]"
            disabled={isChecking}
          >
            {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "دخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
