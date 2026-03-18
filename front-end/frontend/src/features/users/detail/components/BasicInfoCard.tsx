import React from 'react';
import { Users } from 'lucide-react';

interface BasicInfoCardProps {
  user: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    biography?: string;
  };
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ user }) => {
  const displayCompany = user.company ? user.company : '—';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-green-500" />
        Basic Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={user.fullName}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={user.phone}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company / Organization
          </label>
          <input
            type="text"
            value={displayCompany}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed"
          />
        </div>

        {user.biography && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              value={user.biography}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed h-24 resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoCard;