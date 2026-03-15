export function SearchBar() {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4 
                    flex flex-col md:flex-row 
                    items-stretch md:items-center 
                    gap-3 
                    max-w-4xl mx-auto mt-10"
    >
      <input
        className="flex-1 px-4 py-3 outline-none text-sm border rounded-lg md:border-none"
        placeholder="Keywords, job title, company..."
      />

      <input
        className="flex-1 px-4 py-3 outline-none text-sm border rounded-lg md:border-none"
        placeholder="Location or 'Remote'..."
      />

      <button
        className="bg-green-500 hover:bg-green-600 text-white 
                         px-8 py-3 rounded-xl font-semibold 
                         w-full md:w-auto"
      >
        SEARCH
      </button>
    </div>
  );
}
