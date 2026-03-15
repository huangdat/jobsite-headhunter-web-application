import type { Job } from "../types";

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior UX Designer",
    company: "TechCorp Solutions",
    salary: "$4,500 - $6,000 / month",
    location: "HCM",
    match: "95% MATCH",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnoHub Global",
    salary: "$3,200 - $5,500 / month",
    location: "Da Nang",
    match: "88% MATCH",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudNine Systems",
    salary: "$5,000 - $7,500 / month",
    location: "Remote",
    match: "82% MATCH",
  },
  {
    id: "4",
    title: "Motion Designer",
    company: "CreativeLab Studio",
    salary: "$2,800 - $4,200 / month",
    location: "Hanoi",
    match: "79% MATCH",
  },
];

export function RecommendedJobs() {
  return (
    <section id="recommended" className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Recommended for you</h2>
          <p className="text-gray-500 text-sm">
            Based on your profile and skills
          </p>
        </div>
        <span className="text-gray-400 text-sm">chevron_right</span>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-end">
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                {job.match}
              </span>
            </div>

            <h3 className="font-semibold mt-4">{job.title}</h3>
            <p className="text-gray-500 text-sm">{job.company}</p>

            <div className="flex justify-between mt-6 text-sm">
              <span>{job.salary}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
