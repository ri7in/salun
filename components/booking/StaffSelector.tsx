'use client';

import { Staff } from '@/types';

interface StaffSelectorProps {
  staff: Staff[];
  selectedStaffId: string;
  onSelect: (staffId: string) => void;
}

export default function StaffSelector({ staff, selectedStaffId, onSelect }: StaffSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Select Your Stylist</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {staff.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.id)}
            className={`p-4 rounded-lg border-2 text-left transition ${
              selectedStaffId === member.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-400'
            }`}
          >
            <div className="flex items-start gap-4">
              {member.avatar_url && (
                <img
                  src={member.avatar_url}
                  alt={member.user?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">
                  {member.user?.name}
                </h3>
                <p className="text-purple-600 text-sm font-medium mb-1">
                  {member.specialty}
                </p>
                {member.bio && (
                  <p className="text-gray-600 text-sm line-clamp-2">{member.bio}</p>
                )}
              </div>
              {selectedStaffId === member.id && (
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
