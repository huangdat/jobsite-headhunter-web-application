/**
 * ForumAdminSidebar Component
 * Navigation sidebar for forum admin section
 */

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BiListUl, BiNews, BiMessageDetail } from "react-icons/bi";
import { getSemanticClass } from "@/lib/design-tokens";

interface ForumAdminSidebarProps {
  onItemClick?: () => void;
}

export function ForumAdminSidebar({ onItemClick }: ForumAdminSidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    {
      section: "Forum Management",
      items: [
        {
          to: "/admin/forum/categories",
          label: t("forum.sidebar.categories") || "Categories",
          icon: BiListUl,
          description: "Manage discussion areas",
        },
        {
          to: "/admin/forum/posts",
          label: t("forum.sidebar.posts") || "Posts",
          icon: BiNews,
          description: "Create and publish articles",
        },
        {
          to: "/admin/forum/comments",
          label: t("forum.sidebar.comments") || "Comments",
          icon: BiMessageDetail,
          description: "Moderate discussions",
          disabled: true, // Future feature
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white text-black min-h-screen p-6 flex flex-col">
      {/* Forum Header */}
      <div className="mb-8 pb-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BiNews
            className={`w-5 h-5 ${getSemanticClass("success", "icon")}`}
          />
          {t("forum.sidebar.management") || "Forum Management"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t("forum.sidebar.description") || "Manage discussion content"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            {/* Section title */}
            <h3 className="px-4 py-2 text-xs font-semibold uppercase text-slate-400 tracking-wider">
              {section.section}
            </h3>

            {/* Section items */}
            <div className="space-y-2">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-start gap-3 px-4 py-3 rounded-lg text-sm font-medium 
                    transition-all duration-200 border border-transparent group
                    ${
                      isActive
                        ? `${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)} shadow-sm ${getSemanticClass("success", "border", true)} ring-1 ring-emerald-500/10`
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`
                  }
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault();
                    else onItemClick?.();
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${
                          isActive
                            ? getSemanticClass("success", "icon")
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div>{item.label}</div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
        <p>
          💡{" "}
          {t("forum.sidebar.tip") ||
            "Tip: Use keyboard shortcuts for faster navigation"}
        </p>
      </div>
    </aside>
  );
}

export default ForumAdminSidebar;
