"use client";

import { useEffect, useState } from "react";
import type { Advocate } from "./types";

const yearRanges = [
  { label: "< 2 years", value: "<2" },
  { label: "3-6 years", value: "3-6" },
  { label: "7-10 years", value: "7-10" },
  { label: "10+ years", value: "10+" },
];

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [degrees, setDegrees] = useState<string[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    city: "",
    degree: "",
    yearsOfExperience: "",
    phoneNumber: "",
    specialties: [] as string[],
  });

  useEffect(() => {
    fetch("/api/advocates").then((response) =>
      response.json().then((jsonResponse) => {
        const data: Advocate[] = jsonResponse.data;
        setAdvocates(data);
        setFilteredAdvocates(data);

        const uniqueDegrees = data
          .map((a) => a.degree)
          .filter((val, i, self) => self.indexOf(val) === i);
        setDegrees(uniqueDegrees);

        const uniqueSpecialties = data
          .flatMap((a) => a.specialties)
          .filter((val, i, self) => self.indexOf(val) === i);
        setSpecialtiesList(uniqueSpecialties);
      })
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSearch = () => {
    const filtered = advocates.filter((advocate) => {
      const yearsMatch =
        filters.yearsOfExperience === "" ||
        (filters.yearsOfExperience === "<2" &&
          advocate.yearsOfExperience < 2) ||
        (filters.yearsOfExperience === "3-6" &&
          advocate.yearsOfExperience >= 3 &&
          advocate.yearsOfExperience <= 6) ||
        (filters.yearsOfExperience === "7-10" &&
          advocate.yearsOfExperience >= 7 &&
          advocate.yearsOfExperience <= 10) ||
        (filters.yearsOfExperience === "10+" &&
          advocate.yearsOfExperience > 10);

      const specialtyMatch =
        filters.specialties.length === 0 ||
        filters.specialties.every((filterSpecialty) =>
          advocate.specialties.includes(filterSpecialty)
        );

      return (
        advocate.firstName
          .toLowerCase()
          .includes(filters.firstName.toLowerCase()) &&
        advocate.lastName
          .toLowerCase()
          .includes(filters.lastName.toLowerCase()) &&
        advocate.city.toLowerCase().includes(filters.city.toLowerCase()) &&
        advocate.degree.toLowerCase().includes(filters.degree.toLowerCase()) &&
        advocate.phoneNumber
          .toString()
          .includes(filters.phoneNumber.toLowerCase()) &&
        yearsMatch &&
        specialtyMatch
      );
    });

    setFilteredAdvocates(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;

    const isTextInput =
      target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.tagName === "TEXTAREA";

    // allow default behavior to submit form
    if (e.key === "Enter" && isTextInput) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Solace Advocates
      </h1>
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {(["firstName", "lastName", "city", "phoneNumber"] as const).map(
          (field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={filters[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Degree
          </label>
          <select
            name="degree"
            value={filters.degree}
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
            value={filters.yearsOfExperience}
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
            {filters.specialties.map((s) => (
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
              // I am doing dive with role button so then when I hit enter it does select an option
              // and instead submits the form
              <div
                key={s}
                role="button"
                tabIndex={-1}
                onClick={() => toggleSpecialty(s)}
                className={`cursor-pointer text-xs px-2 py-1 rounded-full border ${
                  filters.specialties.includes(s)
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

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAdvocates.map((advocate) => (
          <div
            key={advocate.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {advocate.firstName} {advocate.lastName}
            </h2>
            <p className="text-sm text-gray-600 mb-1">📍 {advocate.city}</p>
            <p className="text-sm text-gray-600 mb-1">🎓 {advocate.degree}</p>
            <p className="text-sm text-gray-600 mb-1">
              🕰️ {advocate.yearsOfExperience} years experience
            </p>
            {advocate.phoneNumber && (
              <p className="text-sm text-gray-600 mb-1">
                📞 {advocate.phoneNumber}
              </p>
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
        ))}
      </div>
    </div>
  );
}
