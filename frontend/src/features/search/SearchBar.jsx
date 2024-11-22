import axios from "axios";
import { useEffect } from "react";
import { HiSearch } from "react-icons/hi";

function SearchBar({ setResults, globalSearch, query, setQuery }) {
  const handleSearch = async () => {
    const data = globalSearch(query);
    setResults(data);
  };

  function handleChange(e) {
    setQuery(e.target.value);
  }

  // Debounce logic
  useEffect(() => {
    if (query.length < 3) {
      setResults([]); // Clear results if query is less than 3 characters
      return;
    }

    const timeoutId = setTimeout(async () => {
      search(query); // Call search after 500ms
      // const data = await globalSearch(query);
      // console.log(data);
      // setResults(data);
    }, 500);

    // Cleanup function to clear timeout
    return () => clearTimeout(timeoutId);
  }, [query]); // Trigger when `query` changes

  // Function to perform the search
  const search = async (searchQuery) => {
    const response = await axios.post(`http://localhost:8000/api/search`, {
      text: searchQuery,
    });

    setResults(response.data); // Update results with search response
  };

  return (
    <div className="hidden sm:block">
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2"
          onClick={handleSearch}
        >
          <HiSearch />
        </button>
        <input
          type="text"
          name="search"
          placeholder="Type to search..."
          value={query}
          onChange={handleChange}
          className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
        />
      </div>
    </div>
  );
}

export default SearchBar;
