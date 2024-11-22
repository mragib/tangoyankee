import React from "react";
function FloatingInput({ error, placeholder, ...props }, ref) {
  const label = props.name.slice(12);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          name={label}
          className={`peer block  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-white rounded-lg border  appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 ${
            error ? "border-red-300" : "border-gray-300"
          }`}
          placeholder=" "
          {...props}
          ref={ref}
        />
        <label
          htmlFor={props.name}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-2 origin-[0] bg-white rounded-full px-2 left-1 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
          peer-focus:-translate-y-4 peer-focus:scale-75"
        >
          {label}
        </label>
      </div>
    </div>
  );
}

const InputFloating = React.forwardRef(FloatingInput);

export default InputFloating;
