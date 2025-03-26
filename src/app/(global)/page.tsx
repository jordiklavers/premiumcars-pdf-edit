"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // This will be replaced by the redirect
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[8px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">PDF Editor</h1>
        <div className="flex gap-2">
          <Link
            href="/signin"
            className={buttonVariants({ variant: "default" })}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
