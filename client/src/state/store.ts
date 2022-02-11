import { makeVar, ReactiveVar, useReactiveVar } from "@apollo/client";

// Special hooks that triggers an update of a Query or
// subcription when its value changes
const fieldEditingVar: ReactiveVar<string | null> = makeVar<string | null>(
  null,
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

const markedForDeletionVar: ReactiveVar<MarkedForDeletion[]> = makeVar<
  MarkedForDeletion[]
>([]);
type UseMarkedForDeletion = {
  markedForDeletion: MarkedForDeletion[];
  setMarkedForDeletion: (value: MarkedForDeletion[]) => void;
};
export const useMarkedForDeletion = (): UseMarkedForDeletion => {
  const markedForDeletion = useReactiveVar(markedForDeletionVar);
  const setMarkedForDeletion = (value: MarkedForDeletion[]) => {
    markedForDeletionVar(value);
  };
  return { markedForDeletion, setMarkedForDeletion };
};

const removeMFDVar: ReactiveVar<RemoveMFD> = makeVar<RemoveMFD>(null);
type Remove = {
  removeMFD: RemoveMFD;
  setRemoveMFD: (value: RemoveMFD) => void;
};
export const useRemoveMFD = (): Remove => {
  const removeMFD = useReactiveVar(removeMFDVar);
  const setRemoveMFD = (value: RemoveMFD) => {
    removeMFDVar(value);
  };
  return { removeMFD, setRemoveMFD };
};
