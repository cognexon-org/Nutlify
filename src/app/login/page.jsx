import SimpleHeader from "@/components/SimpleHeader";
import LoginPanel from "./LoginPanel";

export const metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  // Only allow redirects back into this site.
  const safeNext = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  return (
    <>
      <SimpleHeader />
      <main className="container-x grid min-h-[70svh] place-items-center py-16">
        <LoginPanel next={safeNext} />
      </main>
    </>
  );
}
