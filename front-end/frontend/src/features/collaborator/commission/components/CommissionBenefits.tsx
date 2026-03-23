/**
 * CommissionBenefits Component
 * PROF-04: Collaborator Commission
 * Displays referral benefits and exclusive features
 */

import { useTranslation } from "react-i18next";

/**
 * CommissionBenefits Component
 * Displays information about referral program benefits
 */
export function CommissionBenefits() {
  const { t } = useTranslation("commission");

  const benefits = [
    {
      id: "quick_payout",
      icon: "flash_on",
      title: t("benefits.quickPayout.title"),
      description: t("benefits.quickPayout.description"),
    },
    {
      id: "high_rate",
      icon: "trending_up",
      title: t("benefits.highRate.title"),
      description: t("benefits.highRate.description"),
    },
    {
      id: "support",
      icon: "support_agent",
      title: t("benefits.support.title"),
      description: t("benefits.support.description"),
    },
    {
      id: "transparent",
      icon: "visibility",
      title: t("benefits.transparent.title"),
      description: t("benefits.transparent.description"),
    },
    {
      id: "no_limit",
      icon: "all_inclusive",
      title: t("benefits.noLimit.title"),
      description: t("benefits.noLimit.description"),
    },
    {
      id: "tools",
      icon: "build",
      title: t("benefits.tools.title"),
      description: t("benefits.tools.description"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("section.benefits")}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t("section.benefitsDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 p-3 bg-emerald-50 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600">
                  {benefit.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{benefit.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {t("section.howItWorks")}
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full flex-shrink-0">
              <span className="text-sm font-bold text-emerald-600">1</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{t("howItWorks.step1.title")}</h4>
              <p className="text-sm text-slate-600 mt-1">{t("howItWorks.step1.description")}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full flex-shrink-0">
              <span className="text-sm font-bold text-emerald-600">2</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{t("howItWorks.step2.title")}</h4>
              <p className="text-sm text-slate-600 mt-1">{t("howItWorks.step2.description")}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full flex-shrink-0">
              <span className="text-sm font-bold text-emerald-600">3</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{t("howItWorks.step3.title")}</h4>
              <p className="text-sm text-slate-600 mt-1">{t("howItWorks.step3.description")}</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full flex-shrink-0">
              <span className="text-sm font-bold text-emerald-600">4</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{t("howItWorks.step4.title")}</h4>
              <p className="text-sm text-slate-600 mt-1">{t("howItWorks.step4.description")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {t("section.faq")}
        </h3>

        <div className="space-y-3">
          {/* FAQ Item 1 */}
          <details className="group border border-slate-200 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
              <span className="font-medium text-slate-900">{t("faq.item1.question")}</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
              {t("faq.item1.answer")}
            </div>
          </details>

          {/* FAQ Item 2 */}
          <details className="group border border-slate-200 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
              <span className="font-medium text-slate-900">{t("faq.item2.question")}</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
              {t("faq.item2.answer")}
            </div>
          </details>

          {/* FAQ Item 3 */}
          <details className="group border border-slate-200 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
              <span className="font-medium text-slate-900">{t("faq.item3.question")}</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
              {t("faq.item3.answer")}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
