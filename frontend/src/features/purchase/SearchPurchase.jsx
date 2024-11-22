import Input from "../../ui/Input";
import styled from "styled-components";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const StyleDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function SearchPurchase() {
  const [query, setQuery] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  function handleChange(e) {
    setQuery(e.target.value);
    searchParams.set("search", e.target.value);
    if (searchParams.get("page")) {
      searchParams.set("page", 1);
    }
    setSearchParams(searchParams);
  }
  return (
    <StyleDiv>
      <Input
        value={query}
        onChange={handleChange}
        placeholder="Search Invoice"
      />
    </StyleDiv>
  );
}

export default SearchPurchase;
