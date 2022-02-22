import { randomNumbers } from "./functions";

export const statusOptions = ["private", "public", "collaborative"];
export const statusTitles: any = {
  private: "Only visible to you",
  public: "Visible to everyone",
  collaborative: "Visible to everyone, editable with editor link",
};

export const acceptedImageFiles = ["image/jpeg", "image/png"];

export const dummyLabel = (catalogue_id: string): Label => {
  return {
    // @ts-ignore
    __typename: "Label",
    id: `${randomNumbers(4)}2a78-c744-4f8e-a2c5-d4a422fc657d`,
    catalogue_id,
    name: "",
    ordering: 0,
    is_private: false,
    link_url: null,
    created: new Date(),
    updated: new Date(),
  };
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

export const dummyLink = (listing_id: string, url: string): Link => {
  const domain = url.split("/")[2];
  let title: string[] | string = domain.split(".");
  if (title[0] === "www") title.shift();
  title.pop();
  title = title.join(".");

  return {
    // @ts-ignore
    __typename: "Link",
    id: `${randomNumbers(4)}2a78-c744-4f8e-a2c5-d4a422fc657d`,
    listing_id,
    url,
    title,
    created: new Date(),
    updated: new Date(),
  };
};
