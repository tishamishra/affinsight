"use client";

import { Listbox } from "@headlessui/react";
import { useState } from "react";

const networks = ["All Networks", "ClickBank", "AdCombo", "Mobidea"];
const categories = ["All Categories", "Finance", "Health", "Ecommerce"];
const countries = ["All Countries", "USA", "UK", "India", "Canada"];

export default function Filters() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Listbox value={selectedNetwork} onChange={setSelectedNetwork}>
        <div className="relative">
          <Listbox.Button className="w-44 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-left cursor-pointer">
            {selectedNetwork}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {networks.map((network) => (
              <Listbox.Option
                key={network}
                value={network}
                className={({ active }) =>
                  `px-4 py-2 cursor-pointer ${active ? "bg-blue-100 text-blue-700" : ""}`
                }
              >
                {network}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <Listbox value={selectedCategory} onChange={setSelectedCategory}>
        <div className="relative">
          <Listbox.Button className="w-44 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-left cursor-pointer">
            {selectedCategory}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {categories.map((category) => (
              <Listbox.Option
                key={category}
                value={category}
                className={({ active }) =>
                  `px-4 py-2 cursor-pointer ${active ? "bg-blue-100 text-blue-700" : ""}`
                }
              >
                {category}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <Listbox value={selectedCountry} onChange={setSelectedCountry}>
        <div className="relative">
          <Listbox.Button className="w-44 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-left cursor-pointer">
            {selectedCountry}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {countries.map((country) => (
              <Listbox.Option
                key={country}
                value={country}
                className={({ active }) =>
                  `px-4 py-2 cursor-pointer ${active ? "bg-blue-100 text-blue-700" : ""}`
                }
              >
                {country}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
} 