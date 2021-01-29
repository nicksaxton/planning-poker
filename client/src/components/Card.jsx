import * as React from "react";

const Card = ({ active, children, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={`card ${hovered ? "bg-light" : ""} ${
        active ? "border-primary" : ""
      }`}
      style={{
        borderWidth: "2px",
        cursor: `${hovered ? "pointer" : "default"}`,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`card-body py-5 text-center ${active ? "text-primary" : ""}`}
      >
        <h1>{children}</h1>
      </div>
    </div>
  );
};

export default Card;
