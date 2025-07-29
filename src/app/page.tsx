"use client";

import { useEffect, useState } from "react";

type Advocate = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber?: string;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    fetch("/api/advocates").then((response) =>
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      })
    );
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const label = document.getElementById("search-term");
    if (label) label.innerHTML = searchTerm;

    const filtered = advocates.filter((advocate) => {
      const term = searchTerm.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(term) ||
        advocate.lastName.toLowerCase().includes(term) ||
        advocate.city.toLowerCase().includes(term) ||
        advocate.degree.toLowerCase().includes(term) ||
        advocate.specialties.some((s) => s.toLowerCase().includes(term)) ||
        advocate.yearsOfExperience.toLowerCase().includes(term) ||
        advocate.phoneNumber?.toLowerCase().includes(term)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Solace Advocates</h1>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Advocates</label>
          <input
            onChange={onChange}
            placeholder="Search by name, city, specialty, etc."
            className="w-full p-3 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            Searching for: <span id="search-term" className="font-semibold" />
          </p>
          <button
            onClick={onClick}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Reset Search
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAdvocates.map((advocate) => (
            <div
              key={advocate.id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
              <div className="mt-3 flex flex-wrap gap-2">
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
    </main>
  );
}
