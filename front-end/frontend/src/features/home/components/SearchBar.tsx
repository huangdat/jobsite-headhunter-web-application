import { useHomeTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/utils/semantic-colors";

export function SearchBar() {
  const { t } = useHomeTranslation();
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
        placeholder={t("searchKeywords")}
      />

      <input
        className="flex-1 px-4 py-3 outline-none text-sm border rounded-lg md:border-none"
        placeholder={t("searchLocation")}
      />

      <button
        className={`${getSemanticClass("success", "bg", true)} hover:${getSemanticClass("success", "bg", true)} text-white 
                         px-8 py-3 rounded-xl font-semibold 
                         w-full md:w-auto`}
      >
        {t("searchBar.search")}
      </button>
    </div>
  );
}
