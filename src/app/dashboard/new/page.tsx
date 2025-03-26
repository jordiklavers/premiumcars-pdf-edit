"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PDFForm } from "@/components/PDFForm";

export default function NewPDF() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return <PDFForm mode="create" />;
}
