import { randomNumbers } from "./functions";

export const statusOptions = ["public", "private", "sharable"];

export const acceptedImageFiles = ["image/jpeg", "image/png"];

export const dummyLabel = {
  __typename: "Label",
  id: "",
  catalogue_id: "",
  name: "",
  ordering: 0,
  is_private: false,
  link_url: null,
  created: "",
  updated: "",
};

export const dummyListing = (catalogue_id: string): Listing => {
  return {
    // @ts-ignore
    __typename: "Listing",
    id: `${randomNumbers(4)}2a78-c744-4f8e-a2c5-d4a422fc657d`,
    catalogue_id,
    name: "",
    link_url: null,
    image_url: null,
    description: null,
    ordering: 1000000,
    show_price: true,
    price: null,
    links: null,
    labels: null,
    created: new Date(),
    updated: new Date(),
  };
};

export const dummyListingLabel = (label: Label): ListingLabel => {
  return {
    // @ts-ignore
    __typename: "ListingLabel",
    id: `${randomNumbers(4)}2a78-c744-4f8e-a2c5-d4a422fc657d`,
    listing_id: "",
    label,
  };
};
