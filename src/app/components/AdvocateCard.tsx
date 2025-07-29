"use client";

import React from "react";
import type { Advocate } from "../types";

export const AdvocateCard: React.FC<{ advocate: Advocate }> = ({
  advocate,
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5">
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      {advocate.firstName} {advocate.lastName}
    </h2>
    <p className="text-sm text-gray-600 mb-1">📍 {advocate.city}</p>
    <p className="text-sm text-gray-600 mb-1">🎓 {advocate.degree}</p>
    <p className="text-sm text-gray-600 mb-1">
      🕰️ {advocate.yearsOfExperience} years experience
    </p>
    {advocate.phoneNumber && (
      <p className="text-sm text-gray-600 mb-1">📞 {advocate.phoneNumber}</p>
    )}
    <div className="mt-3 flex flex-wrap gap-1">
      {advocate.specialties.map((s, idx) => (
        <span
          key={idx}
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);
