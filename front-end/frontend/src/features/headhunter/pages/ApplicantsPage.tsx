import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ApplicantsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="p-8">Loading applicants...</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4">Applicants</h2>
      <p className="text-sm text-slate-600 mb-6">
        This page will list applicants for your jobs.
      </p>
      <div className="rounded-lg bg-white p-6 shadow">No applicants yet.</div>
      <div className="mt-6">
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    </div>
  );
}

export default ApplicantsPage;
