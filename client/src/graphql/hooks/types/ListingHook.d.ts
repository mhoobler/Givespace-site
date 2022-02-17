declare namespace ListingHook {
  export type createListing = (catalogue_id: string) => (name: string) => void;

  export type editListing = (id: string) => GenericEdit;
  export type editBoolean = (
    id: string,
  ) => (value: boolean, keyProp: string) => void;
  export type editListingFile = (id: string) => GenericFileEdit;

  export type reorderListing = (
    id: string,
  ) => (id: string, ordering: number) => void;

  export type deleteListing = (id: string) => void;

  export type base = {
    createListing: ListingHook.createListing;
    editListing: ListingHook.editListing;
    editBoolean: ListingHook.editBoolean;
    editListingFile: ListingHook.editListingFile;
    reorderListing: ListingHook.reorderListing;
    deleteListing: ListingHook.deleteListing;
  };

  export type FC = () => ListingHook.base;
}
