export function TopCompanies() {
  const companies = [
    "Company Alpha",
    "Beta Systems",
    "Gamma Tech",
    "Delta Design",
    "Epsilon Media",
    "Zeta Labs",
    "Omega Solutions",
    "Nova Digital",
  ];

  return (
    <section id="top-companies" className="bg-muted py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-12">Top Companies</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {companies.map((c, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="w-24 h-24 bg-linear-to-br from-lime-400 to-lime-600 rounded-full mb-4" />

              <p className="font-medium">{c}</p>

              <p className="text-xs text-muted-foreground">12 Open Jobs</p>

              <p className="text-lime-900 text-xs mt-2 transition group-hover:translate-x-1">
                View Company →
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
