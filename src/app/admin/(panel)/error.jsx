"use client";

export default function AdminError({ error, reset }) {
  const db = /mongo|ECONNREFUSED|Topology|MONGODB_URI|querySrv/i.test(error?.message || "");
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl text-ink">Something went wrong</h1>
      <p className="mt-3 text-muted">
        {db
          ? "The admin panel can’t reach the database. Check MONGODB_URI in your environment settings and that your MongoDB Atlas network access allows this server."
          : "The page couldn’t load. Try again, and if it keeps happening check the server logs."}
      </p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
