import * as React from "react";

const TextField = ({ label, name, type = "text" }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className="form-control form-control-lg"
        id={name}
        name={name}
        type={type}
      />
    </div>
  );
};

export default TextField;
