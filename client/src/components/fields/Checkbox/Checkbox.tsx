import React from "react";

const Checkbox = ({
  value,
  label,
  onChange,
  isEditing,
}: {
  value: Boolean;
  label: string;
  onChange: (value: Boolean) => Promise<void>;
  isEditing: Boolean;
}) => {
  const [checked, setChecked] = React.useState(Boolean(value));
  if (!isEditing) return null;
  return (
    <div className="checkbox-container">
      <input
        id={"cb" + label}
        type="checkbox"
        checked={checked}
        onChange={() => {
          onChange(!checked);
          setChecked(!checked);
        }}
      />
      <label htmlFor={"cb" + label}>{label}</label>
      <h1>{value}</h1>
    </div>
  );
};

export default Checkbox;
