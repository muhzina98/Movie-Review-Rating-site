import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
    const handleChange = (e) => setSearchQuery(e.target.value);


  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery,handleChange }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
