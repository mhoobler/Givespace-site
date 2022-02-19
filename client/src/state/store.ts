import { makeVar, ReactiveVar, useReactiveVar } from "@apollo/client";

// Special hooks that triggers an update of a Query or
// subcription when its value changes

const fieldEditingVar: ReactiveVar<FieldEditing | null> =
  makeVar<FieldEditing | null>(null);
// The behaviour of fields in relation to useFieldEditing
// should be explicidly defined in the field components
export const useFieldEditing = (): UseFieldEditing => {
  const fieldEditing = useReactiveVar(fieldEditingVar);
  const setFieldEditing = (value: FieldEditing | null) => {
    fieldEditingVar(value);
  };
  return { fieldEditing, setFieldEditing };
};

const markedForDeletionVar: ReactiveVar<MarkedForDeletion[]> = makeVar<
  MarkedForDeletion[]
>([]);

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
