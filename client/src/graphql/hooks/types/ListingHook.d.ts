declare namespace ListingHook {
  export type createListing = (catalogue_id: string) => (name: string) => void;

  export type editListing = (id: string) => GenericEdit;
  export type editBoolean = (
    id: string
  ) => (value: boolean, keyProp: string) => void;
  export type editListingFile = (id: string) => GenericFileEdit;

  export type deleteListing = (id: string) => void;

  export type addListingLabel = (listing_id: string, label_id: string) => void;

  export type removeListingLabel = (id: string) => void;

  export type base = {
    createListing: ListingHook.createListing;
    editListing: ListingHook.editListing;
    editBoolean: ListingHook.editBoolean;
    editListingFile: ListingHook.editListingFile;
    deleteListing: ListingHook.deleteListing;
    addListingLabel: ListingHook.addListingLabel;
    removeListingLabel: ListingHook.removeListingLabel;
  };

  export type FC = () => ListingHook.base;
}
