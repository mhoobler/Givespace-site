declare namespace ListingHook {
  export type createListing = (name: string, catalogue_id: string) => void;
  export type editListing = (
    id: string,
    value: string | boolean,
    key: string,
  ) => void;
  export type editListingFile = (id: string, file: File | undefined) => void;
  export type deleteListing = (id: string) => void;

  export type base = {
    createListing: ListingHook.createListing;
    editListing: ListingHook.editListing;
    editListingFile: ListingHook.editListingFile;
    deleteListing: ListingHook.deleteListing;
  };

  export type FC = () => ListingHook.base;
}
