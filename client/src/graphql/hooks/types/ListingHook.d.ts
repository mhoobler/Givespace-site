declare namespace ListingHook {
  export type createListing = (name: string, catalogue_id: string) => void;

  export type editListing = (id: string) => GenericEdit;
  export type editBoolean = (
    id: string,
  ) => (value: boolean, keyProp: string) => void;
  export type editListingFile = (id: string) => GenericFileEdit;

  export type deleteListing = (id: string) => void;

  export type base = {
    createListing: ListingHook.createListing;
    editListing: ListingHook.editListing;
    editBoolean: ListingHook.editBoolean;
    editListingFile: ListingHook.editListingFile;
    deleteListing: ListingHook.deleteListing;
  };

  export type FC = () => ListingHook.base;
}
