import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SkillOption {
  id: number;
  name: string;
  category?: string;
}

interface SkillMultiSelectProps {
  skills: SkillOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

export function SkillMultiSelect({
  skills,
  selectedIds,
  onChange,
  disabled = false,
}: SkillMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, SkillOption[]> = {};
    skills.forEach((skill) => {
      const key = skill.category ?? "GENERAL";
      // eslint-disable-next-line security/detect-object-injection
      if (!grouped[key]) {
        // eslint-disable-next-line security/detect-object-injection
        grouped[key] = [];
      }
      // eslint-disable-next-line security/detect-object-injection
      grouped[key].push(skill);
    });
    return grouped;
  }, [skills]);

  const handleToggle = (skillId: number) => {
    if (selectedIds.includes(skillId)) {
      onChange(selectedIds.filter((id) => id !== skillId));
    } else {
      onChange([...selectedIds, skillId]);
    }
  };

  const selectedSkillNames = skills
    .filter((skill) => selectedIds.includes(skill.id))
    .map((skill) => skill.name)
    .join(", ");

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full text-left justify-between"
      >
        {selectedSkillNames ? (
          <span className="text-slate-700 dark:text-slate-300">
            {selectedSkillNames}
          </span>
        ) : (
          <span className="text-slate-400">Select skills...</span>
        )}
      </Button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-input rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {Object.entries(skillsByCategory).map(([category, list]) => (
            <div key={category}>
              <div className="sticky top-0 bg-slate-50 dark:bg-slate-700 px-3 py-2 font-semibold text-sm text-slate-700 dark:text-slate-300">
                {category}
              </div>
              {list.map((skill) => (
                <label
                  key={skill.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer",
                    selectedIds.includes(skill.id) &&
                      "bg-brand-primary/10 dark:bg-slate-600"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(skill.id)}
                    onChange={() => handleToggle(skill.id)}
                    className="rounded border-input cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {skill.name}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
