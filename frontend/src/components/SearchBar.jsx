import React, { useState } from "react";
import { Search } from "lucide-react";

function  SearchBar ({ onSearch })  {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "",
    category: "",
  });

  const toggleAdvancedSearch = () => {
    setIsAdvancedSearchOpen(!isAdvancedSearchOpen);
  };

  const handleSearch = () => {
    console.log("Recherche :", searchQuery, filters);
  };

  return (
    <div className="p-6  w-[700px]  ">
      {/* Barre de recherche */}
      <div className="flex items-center  space-x-2 bg-white shadow rounded-full px-4 py-2  ">
        <Search className="text-gray-400" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-[var(--status-gray)] "
          placeholder="Tapez un mot clé"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--blue-menu)] text-white text-sm   border-none rounded-full p-2"
        >
          Recherche
        </button>
        <button
          onClick={toggleAdvancedSearch}
          className="text-blue-900 underline text-sm border-none"
        >
          Recherche avancée
        </button>
      </div>

      {/* Recherche avancée */}
      {isAdvancedSearchOpen && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--subfont-gray)]">Recherche avancée</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Période (de - à)
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 rounded-md border border-gray-300 p-1 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ex : 2023-01-01 à 2023-12-31"
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Catégorie
              </label>
              <select
                className="w-full bg-gray-100 rounded-md border border-gray-300 p-1 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">Toutes</option>
                <option value="finance">Finance</option>
                <option value="audit">Audit</option>
                <option value="tech">Technologie</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-[var(--blue-menu)] text-white text-sm   border-none rounded-full p-2"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
