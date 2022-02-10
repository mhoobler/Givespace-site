declare namespace LabelHook {
  export type createLabel = (name: string) => void;
  export type reorderLabel = (id: string, ordering: number) => void;
  export type deleteLabel = (id: string) => void;

  export type base = {
    createLabel: LabelHook.createListing;
    reorderLabel: LabelHook.reorderLabel;
    deleteLabel: LabelHook.deleteListing;
  };

  type Props = {
    catalogue_id: string;
  };

  export type FC = (p: Props) => LabelHook.base;
}
