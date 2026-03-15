export function FeaturedJobs() {
  return (
    <section id="featured-jobs" className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-2xl font-bold mb-10">Featured Jobs</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold">Backend Architect</h3>
            <p className="text-gray-500 text-sm">Nexus Data Solutions</p>

            <div className="flex gap-2 mt-3 text-xs">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                FULL-TIME
              </span>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                REMOTE
              </span>
            </div>

            <div className="flex justify-between mt-6 text-sm">
              <span>Ho Chi Minh</span>
              <span className="font-semibold">$3,500 - $5,000</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition cursor-pointer">
          VIEW MORE JOBS →
        </button>
      </div>
    </section>
  );
}
