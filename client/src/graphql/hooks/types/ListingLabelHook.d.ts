declare namespace ListingLabelHook {
  export type addListingLabel = (listing_id: string, label: Label) => void;

  export type removeListingLabel = (id: string) => void;

  export type base = {
    addListingLabel: ListingLabelHook.addListingLabel;
    removeListingLabel: ListingLabelHook.removeListingLabel;
  };

  export type FC = () => ListingLabelHook.base;
}
