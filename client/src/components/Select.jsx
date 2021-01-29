import * as React from "react";

const Select = React.forwardRef(({ label, name, options }, ref) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        className="custom-select custom-select-lg"
        id={name}
        name={name}
        ref={ref}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
