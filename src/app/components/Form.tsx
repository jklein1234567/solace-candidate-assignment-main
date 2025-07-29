"use client";

import React from "react";
import { FilterField } from "../types";

type Props = {
  filters: Record<string, string | string[]>;
  degrees: string[];
  yearRanges: { label: string; value: string }[];
  specialtiesList: string[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  toggleSpecialty: (specialty: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => void;
};

export const Form: React.FC<Props> = ({
  filters,
  degrees,
  yearRanges,
  specialtiesList,
  handleChange,
  toggleSpecialty,
  handleSubmit,
  handleKeyDown,
}) => (
  <form
    onSubmit={handleSubmit}
    onKeyDown={handleKeyDown}
    className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    {Object.values(FilterField).map((field) => (
      <div key={field}>
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {field}
        </label>
        <input
          type="text"
          name={field}
          value={filters[field] as string}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    ))}

    <div>
      <label className="block text-sm font-medium text-gray-700">Degree</label>
      <select
        name="degree"
        value={filters.degree as string}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
      >
        <option value="">All</option>
        {degrees.map((deg) => (
          <option key={deg} value={deg}>
            {deg}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Years of Experience
      </label>
      <select
        name="yearsOfExperience"
        value={filters.yearsOfExperience as string}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
      >
        <option value="">All</option>
        {yearRanges.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>

    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Specialties
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {(filters.specialties as string[]).map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {s}
            <button
              type="button"
              onClick={() => toggleSpecialty(s)}
              className="text-blue-500 hover:text-red-600"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
        {specialtiesList.map((s) => (
          <div
            key={s}
            role="button"
            tabIndex={-1}
            onClick={() => toggleSpecialty(s)}
            className={`flex items-center justify-center text-xs text-center px-3 py-2 rounded-full border transition ${
              (filters.specialties as string[]).includes(s)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>

    <div className="col-span-full">
      <button
        type="submit"
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>
  </form>
);
