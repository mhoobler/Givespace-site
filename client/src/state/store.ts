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

const currentlyUndoVar: ReactiveVar<any[]> = makeVar<any[]>([]);
type CurrentlyUndo = {
  currentlyUndo: any[];
  setCurrentlyUndo: (value: any[]) => void;
};
export const useCurrentlyUndo = (): CurrentlyUndo => {
  const currentlyUndo = useReactiveVar(currentlyUndoVar);
  const setCurrentlyUndo = (value: any[]) => {
    currentlyUndoVar(value);
  };
  return { currentlyUndo, setCurrentlyUndo };
};

const removeVar: ReactiveVar<any> = makeVar<any>(null);
type Remove = {
  remove: any;
  setRemove: (value: any) => void;
};
export const useRemove = (): Remove => {
  const remove = useReactiveVar(removeVar);
  const setRemove = (value: any) => {
    removeVar(value);
  };
  return { remove, setRemove };
};
