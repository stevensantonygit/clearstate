import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dashboard - PropertySG",
  description: "Manage your properties and listings on PropertySG",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {children}
      </div>
      <Toaster />
    </AuthProvider>
  );
}