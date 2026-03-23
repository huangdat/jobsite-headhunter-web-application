/**
 * Company Best Practices Component
 * Displays best practices for using the platform
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export interface BestPractice {
  id: string;
  title: string; // i18n key
  description: string; // i18n key
  icon?: React.ReactNode;
  tips?: string[]; // i18n keys
}

export interface CompanyBestPracticesProps {
  practices?: BestPractice[];
  isLoading?: boolean;
  className?: string;
}

/**
 * Default best practices
 */
const DEFAULT_PRACTICES: BestPractice[] = [
  {
    id: 'practice_1',
    title: 'business.bestpractice.profile_accuracy',
    description: 'business.bestpractice.profile_accuracy_desc',
    tips: [
      'business.bestpractice.tip_accurate_info',
      'business.bestpractice.tip_update_regular',
      'business.bestpractice.tip_professional_photos',
    ],
  },
  {
    id: 'practice_2',
    title: 'business.bestpractice.timely_response',
    description: 'business.bestpractice.timely_response_desc',
    tips: [
      'business.bestpractice.tip_respond_quickly',
      'business.bestpractice.tip_communicate_clearly',
      'business.bestpractice.tip_professional_tone',
    ],
  },
  {
    id: 'practice_3',
    title: 'business.bestpractice.document_ready',
    description: 'business.bestpractice.document_ready_desc',
    tips: [
      'business.bestpractice.tip_documents_uptodate',
      'business.bestpractice.tip_high_quality',
      'business.bestpractice.tip_organized',
    ],
  },
];

/**
 * Company Best Practices Component
 * Shows recommended practices for better profile and recruiter engagement
 */
export const CompanyBestPractices: React.FC<CompanyBestPracticesProps> = ({
  practices = DEFAULT_PRACTICES,
  isLoading = false,
  className = '',
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
          <TrendingUp className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('business.bestpractice.title', 'Best Practices')}
          </h3>
          <p className="text-xs text-gray-600">
            {t('business.bestpractice.subtitle', 'Proven strategies for success')}
          </p>
        </div>
      </div>

      {/* Practices List */}
      <div className="space-y-4">
        {practices.map((practice) => (
          <div key={practice.id} className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
            {/* Practice Title */}
            <h4 className="mb-2 font-semibold text-gray-900">{t(practice.title, practice.title)}</h4>

            {/* Practice Description */}
            <p className="mb-3 text-sm text-gray-700">{t(practice.description, practice.description)}</p>

            {/* Tips */}
            {practice.tips && practice.tips.length > 0 && (
              <ul className="space-y-2">
                {practice.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{t(tip, tip)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="text-xs font-semibold text-green-900">
            {t('business.bestpractice.follow_tips', 'Follow these practices')}
          </p>
          <p className="mt-1 text-xs text-green-800">
            {t('business.bestpractice.follow_tips_desc', 'to establish trust with recruiters and maximize opportunities')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyBestPractices;
