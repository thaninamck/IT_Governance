import React, { useState } from "react";
import { Search } from "lucide-react";
import Table from "./Table";

function  SearchBar ({ onSearch })  {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
   // dateRange: "",
    role: "",
  });

  const toggleAdvancedSearch = () => {
    setIsAdvancedSearchOpen(!isAdvancedSearchOpen);
  };

  

  const columnsConfig2 = [
  
    { field: 'statusMission', headerName: 'Status', width: 180 },
    { field: 'mission', headerName: 'Mission', width: 180 },
    { field: 'client', headerName: 'Client', width: 180 },
    { field: 'role', headerName: 'Role', width: 180 },
    { field: 'actions', headerName: 'Actions', width: 80 },
  ];
  
  
  // Données originales du tableau
  const initialRows = [
    { id: 1, statusMission: 'en_cours', mission: 'DSP', client: 'Djeezy', role: 'Manager'},
    { id: 2, statusMission: 'terminee', mission: 'DSP1', client: 'Oredoo', role: 'Testeur' },
    { id: 3, statusMission: 'non_commencee', mission: 'DSP2', client: 'Mazars', role: 'Testeur' },
    { id: 4, statusMission: 'en_retard', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur'},
  ];
  const getRowLink = (row) => `/tablemission/${row.mission}`;

   // 🔹 État des données filtrées
   const [filteredRows, setFilteredRows] = useState(initialRows);

   const handleSearch = () => {
    console.log("Recherche :", searchQuery, filters);
   

    const filtered = initialRows.filter((row) => {
      // 🔎 Vérifie si le `searchQuery` correspond à l'une des colonnes
      const matchesSearch = searchQuery === "" || 
        row.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.role.toLowerCase().includes(searchQuery.toLowerCase());
        

      // Vérifie le role (si sélectionnée)
     const matchesRole = filters.role === "" || row.role === filters.role;

      // 🔎 Filtrage par date (à adapter selon ton format)
      //const matchesDate = true; // (Ajoute ici la logique pour filtrer par date si nécessaire)

      return matchesSearch && matchesRole /*&& matchesDate*/;
      
    });
    console.log(filtered)
    setFilteredRows(filtered);
    
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Déclenche la recherche avec "Entrée"
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
                Role
              </label>
              <select
                className="w-full bg-gray-100 rounded-md border border-gray-300 p-1 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
              >
                <option value="">Toutes</option>
                <option value="Testeur">Testeur</option>
                <option value="Manager">Manager</option>
                <option value="Superviseur">Superviseur</option>
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
      {console.log("Données envoyées à Table :", filteredRows)}
      <Table key={filteredRows.length} columnsConfig={columnsConfig2} rowsData={filteredRows} checkboxSelection={false} getRowLink={getRowLink} />

    </div>
  );
};

export default SearchBar;
