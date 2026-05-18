"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const name = String(formData.get("name") || email.split("@")[0]);

    startTransition(async () => {
      const result =
        mode === "sign-up"
          ? await authClient.signUp.email({ email, password, name })
          : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Authentication failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <main className="relative isolate grid min-h-svh place-items-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(214,255,58,0.08), transparent 60%)",
        }}
      />

      <div className="w-full max-w-md rounded-lg border bg-[var(--surface)]/80 p-8 backdrop-blur-xl">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl italic lowercase tracking-tight">carderna</span>
          <span
            className="h-1.5 w-1.5 translate-y-[-2px] rounded-full"
            style={{ background: "var(--accent-color)", boxShadow: "0 0 10px var(--accent-color)" }}
          />
        </Link>
        <h1 className="font-display mt-6 text-4xl italic lowercase tracking-tight">
          {mode === "sign-up" ? "create account" : "sign in"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "sign-up"
            ? "Spin up a studio to manage teams, templates, and public cards."
            : "Back to the studio."}
        </p>

        <form action={submit} className="mt-8 grid gap-4">
          <div className="grid grid-cols-2 gap-1 rounded-md border p-1 text-sm">
            <button
              type="button"
              className={`rounded px-3 py-2 transition-colors ${
                mode === "sign-in" ? "bg-[var(--accent-color)] text-[var(--ink)]" : "text-muted-foreground"
              }`}
              onClick={() => setMode("sign-in")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`rounded px-3 py-2 transition-colors ${
                mode === "sign-up" ? "bg-[var(--accent-color)] text-[var(--ink)]" : "text-muted-foreground"
              }`}
              onClick={() => setMode("sign-up")}
            >
              Sign up
            </button>
          </div>

          {mode === "sign-up" ? (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Alex Founder" />
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="owner@company.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>

          {error ? (
            <p className="rounded-md border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
              {error}
            </p>
          ) : null}

          <Button disabled={isPending}>
            {isPending ? (
              "Working..."
            ) : (
              <>
                <LogIn className="size-4" />
                {mode === "sign-up" ? "Create account" : "Sign in"}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
