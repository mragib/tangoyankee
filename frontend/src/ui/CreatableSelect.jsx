import { changeForSelectArray } from "@/util";
import AsyncSelect from "react-select/async";

function CreatableSelect({ data, error = false, multiple, ...props }) {
  const reMappedData = changeForSelectArray(data);

  function promiseOptions(inputValue, callback) {
    setTimeout(() => {
      const filterOptions = reMappedData.filter((brand) =>
        brand.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filterOptions);
    }, 1000);
  }

  return (
    <AsyncSelect
      {...props}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: error && !state.isFocused ? "rgb(252,165,165)" : "grey",
        }),
      }}
      defaultOptions={reMappedData}
      loadOptions={promiseOptions}
      isMulti={multiple}
    />
  );
}

export default CreatableSelect;
