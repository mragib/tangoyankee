import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) {
      searchParams.set("page", 1);
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="border-gray-100 border rounded-sm bg-white shadow-3  p-1 flex gap-2">
      {options.map((item) => (
        <button
          className={`font-medium rounded-xl text-sm py-2 px-3 transition-all delay-75 active:${
            currentValue === item.value ? " bg-primary text-white" : ""
          } hover:bg-primary hover:text-white`}
          key={item.value}
          onClick={() => handleClick(item.value)}
          disabled={currentValue === item.value}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;
