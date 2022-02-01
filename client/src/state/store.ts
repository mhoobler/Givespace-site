import { makeVar, ReactiveVar, useReactiveVar } from "@apollo/client";

// Special hooks that triggers an update of a Query or
// subcription when its value changes
const fieldEditingVar: ReactiveVar<string | null> = makeVar<string | null>(
  null
);
type FieldEditing = {
  fieldEditing: string | null;
  setFieldEditing: (value: string | null) => void;
};
// The behaviour of fields in relation to useFieldEditing
// should be explicidly defined in the field components
export const useFieldEditing = (): FieldEditing => {
  const fieldEditing = useReactiveVar(fieldEditingVar);
  const setFieldEditing = (value: string | null) => {
    fieldEditingVar(value);
  };
  return { fieldEditing, setFieldEditing };
};

const markedForDeletionVar: ReactiveVar<string[]> = makeVar<string[]>([]);
type MarkedForDeletionFields = {
  markedForDeletion: string[];
  setMarkedForDeletion: (value: string[]) => void;
};
export const useMarkedForDeletion = (): MarkedForDeletionFields => {
  const markedForDeletion = useReactiveVar(markedForDeletionVar);
  const setMarkedForDeletion = (value: string[]) => {
    markedForDeletionVar(value);
  };
  return { markedForDeletion, setMarkedForDeletion };
};
