import * as React from "react";

const TextField = React.forwardRef(({ label, name, type = "text" }, ref) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className="form-control form-control-lg"
        id={name}
        name={name}
        ref={ref}
        type={type}
      />
    </div>
  );
});

export default TextField;
