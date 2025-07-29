"use client";

import { useEffect, useState } from "react";
import { AdvocateCard, Form } from "./components";
import { Advocate } from "./types";

const yearRanges = [
  { label: "< 2 years", value: "<2" },
  { label: "2-6 years", value: "2-6" },
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
        (filters.yearsOfExperience === "2-6" &&
          advocate.yearsOfExperience >= 2 &&
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
      <Form
        filters={filters}
        degrees={degrees}
        yearRanges={yearRanges}
        specialtiesList={specialtiesList}
        handleChange={handleChange}
        toggleSpecialty={toggleSpecialty}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAdvocates.map((advocate, i) => (
          <AdvocateCard advocate={advocate} key={i} />
        ))}
      </div>
    </div>
  );
}
