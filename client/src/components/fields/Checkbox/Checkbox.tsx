import React from "react";

type Props = {
  value: Boolean;
  label: string;
  keyProp: string;
  onChange: (value: boolean, keyProp: string) => void;
  isEditing: Boolean;
};

const Checkbox: React.FC<Props> = ({
  value,
  keyProp,
  label,
  onChange,
  isEditing,
}) => {
  const [checked, setChecked] = React.useState<boolean>(Boolean(value));
  if (!isEditing) return null;

  const handleChange = () => {
    setChecked((prev) => {
      onChange(!prev, keyProp);
      return !prev;
    });
  };

  return (
    <div className="checkbox-container">
      <input
        id={"cb" + label}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={"cb" + label}>{label}</label>
      <h1>{value}</h1>
    </div>
  );
};

export default Checkbox;
