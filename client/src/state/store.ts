import { makeVar, ReactiveVar, useReactiveVar } from "@apollo/client";

const fieldEditingVar: ReactiveVar<string | null> = makeVar<string | null>(
  null
);
type FieldEditing = {
  fieldEditing: string | null;
  setFieldEditing: (value: string | null) => void;
};
export const useFieldEditing = (): FieldEditing => {
  const fieldEditing = useReactiveVar(fieldEditingVar);
  const setFieldEditing = (value: string | null) => {
    fieldEditingVar(value);
  };
  return { fieldEditing, setFieldEditing };
};
