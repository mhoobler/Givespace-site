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

export const dummyListing = {
  __typename: "Listing",
  id: "",
  catalogue_id: "",
  name: "",
  link_url: null,
  image_url: null,
  description: null,
  ordering: 0,
  show_price: true,
  price: null,
  created: "",
  updated: "",
};
