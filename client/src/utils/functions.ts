import { ApolloError } from "@apollo/client";
import { DocumentNode } from "graphql";
import { cache } from "../graphql/clientConfig";
import {
  ALL_CATALOGUE_FIELDS,
  LABEL_FIELDS,
  LISTING_FIELDS,
  LISTING_LABEL_FIELDS,
} from "../graphql/fragments";

export const getCatalogueFromCache = (
  catalogueId: string
): CatalogueType | null => {
  return cache.readFragment({
    id: `Catalogue:${catalogueId}`,
    fragment: ALL_CATALOGUE_FIELDS,
    fragmentName: "AllCatalogueFields",
  });
};

export const apolloHookErrorHandler = (
  path: string,
  hookError: ApolloError | undefined,
  warning?: boolean
): void => {
  if (hookError) {
    if (hookError.message.includes("Catalogue does not exist")) {
      console.log("Catalogue does not exist", path);
      window.location.reload();
      return;
    }
    if (warning || process.env.NODE_ENV === "production") {
      // if (warning || prcess) {
      console.log(hookError);
      console.warn(`☝️☝️☝️ ERROR at "${path}" ☝️☝️☝️`);
    } else {
      console.log(hookError);
      throw new Error(`☝️☝️☝️ ERROR at "${path}" ☝️☝️☝️`);
    }
  }
};

export const updateCatalogueCache = (id: string, field: string, value: any) => {
  // will require updates as the object has more depth
  cache.modify({
    id,
    fields: {
      [field](existing) {
        return value;
      },
    },
  });
};

export const handleCacheDeletion = (cacheId: string) => {
  cache.evict({ id: cacheId });
  cache.gc();
};

export const endOrdering = (list: any[] | null, type: string): number => {
  if (!list || (list && list.length === 0)) return 0;
  return list.reduce(
    // @ts-ignore
    (max, ins) => {
      if (type === "max") return Math.max(max, ins.ordering);
      if (type === "min") return Math.min(max, ins.ordering);
    },
    list[0].ordering
  );
};

const getDependentCacheItem = (
  cacheId: string,
  fragment: DocumentNode,
  fragmentName: string
) => {
  return {
    id: cacheId,
    fragment,
    fragmentName,
    data: cache.readFragment({
      id: cacheId,
      fragment,
      fragmentName,
    }),
  };
};

export const handleDeletion = (
  id: string,
  type: string,
  deletionMutation: () => void,
  textField?: string,
  setRemoveMFD?: (value: RemoveMFD) => void,
  markedForDeletion?: MarkedForDeletion[],
  setMarkedForDeletion?: (value: MarkedForDeletion[]) => void,
  catalogue?: CatalogueType
) => {
  const cacheId = `${type}:${id}`;

  let dependentCacheItems: DependentCacheItems[] = [];

  if (type === "Label") {
    dependentCacheItems.push(
      getDependentCacheItem(cacheId, LABEL_FIELDS, "AllLabelFields")
    );
    // TODO: standardize undo
    if (catalogue) {
      catalogue.listings?.forEach((li: Listing) => {
        if (li.labels) {
          li.labels.forEach((la: ListingLabel) => {
            if (la.label.id === id) {
              dependentCacheItems.push(
                getDependentCacheItem(
                  `ListingLabel:${la.id}`,
                  LISTING_LABEL_FIELDS,
                  "AllListingLabelFields"
                )
              );
            }
          });
        }
      });
    }
  } else if (type === "Listing") {
    dependentCacheItems.push(
      getDependentCacheItem(cacheId, LISTING_FIELDS, "AllListingFields")
    );
  } else {
    dependentCacheItems.push(
      getDependentCacheItem(cacheId, ALL_CATALOGUE_FIELDS, "AllCatalogueFields")
    );
  }

  // if it will contain undo functionality
  if (textField && setRemoveMFD && markedForDeletion && setMarkedForDeletion) {
    const deleteTimeout = setTimeout(() => {
      deletionMutation();
      setRemoveMFD({ id: cacheId, isUndo: false });
    }, 5000);

    setMarkedForDeletion([
      ...markedForDeletion,
      {
        id: cacheId,
        text: `${type.toLocaleLowerCase()} "${
          dependentCacheItems[0].data[textField]
        }" deletion`,
        timeout: deleteTimeout,
        dependentCacheItems,
      },
    ]);
  } else {
    deletionMutation();
  }
  dependentCacheItems.forEach((item) => {
    handleCacheDeletion(item.id);
  });
};

export const randomNumbers = (length: number): string => {
  const numbers = [];
  for (let i = 0; i < length; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  return numbers.join("");
};

export const isUrl = (value: string): boolean => {
  if (value.slice(0, 8) === "https://" || value.slice(0, 7) === "http://")
    return true;
  return false;
};

export const cleanedPath = (path: string): string => {
  let reducedUrl: string;
  if (location.pathname.endsWith("/")) {
    reducedUrl = location.pathname.slice(0, -1);
  } else {
    reducedUrl = location.pathname;
  }
  return reducedUrl;
};

export const concurrentEditingBlocker = (
  catalogue: CatalogueType,
  fieldEditing: FieldEditing
): CatalogueType => {
  switch (fieldEditing.typename) {
    case "Catalogue":
      // TODO: create enum for catalogue fields
      // @ts-ignore
      delete catalogue[fieldEditing.key];
      break;
    case "Listing":
      let listingRef: Listing | undefined | null;
      listingRef =
        catalogue.listings &&
        catalogue.listings!.find(
          (listing: Listing) => listing.id === fieldEditing.id
        );
      // @ts-ignore
      if (listingRef) delete listingRef[fieldEditing.key];
      break;
    case "Label":
      break;
    case "ListingLabel":
      break;
    case "Link":
      // listing where link is found
      let listingRefForLink: Listing | undefined | null;
      listingRefForLink =
        catalogue.listings &&
        catalogue.listings!.find(
          (listing: Listing) =>
            listing.links &&
            listing.links.find((link: Link) => link.id === fieldEditing.id)
        );
      let linkRef: Link | undefined | null;
      linkRef =
        listingRefForLink &&
        listingRefForLink.links &&
        listingRefForLink.links.find(
          (link: Link) => link.id === fieldEditing.id
        );
      // @ts-ignore
      if (linkRef) delete linkRef[fieldEditing.key];
      break;
    default:
      break;
  }

  return catalogue;
};

export const catalogueFEParser = (
  catalogue: CatalogueType,
  fieldEditing: FieldEditing | null
): CatalogueType => {
  // catalogue cleaning
  // if fieldEditing block the relevant update
  if (fieldEditing) {
    catalogue = concurrentEditingBlocker(catalogue, fieldEditing);
  }

  return catalogue;
};

export const removeFromCacheIfMFD = (
  catalogue: CatalogueType,
  markedForDeletion: MarkedForDeletion[]
) => {
  const labelsMFD: Label[] | null =
    markedForDeletion.length && catalogue.labels
      ? catalogue.labels.filter((label: Label) =>
          markedForDeletion.find((mfd) => mfd.id.split(":")[1] === label.id)
        )
      : null;
  if (labelsMFD) {
    // TODO: standardize undo
    const labelsMFDIds: string[] = labelsMFD.map((label: Label) => label.id);
    catalogue.listings?.forEach((li: Listing) => {
      if (li.labels) {
        li.labels.forEach((la: ListingLabel) => {
          if (labelsMFDIds.includes(la.label.id)) {
            handleCacheDeletion(`ListingLabel:${la.id}`);
          }
        });
      }
    });
    // for each labelsMFDIds remove from cache
    labelsMFDIds.forEach((labelId: string) => {
      handleCacheDeletion(`Label:${labelId}`);
    });
  }
  // prevents listings from being shown if MFD
  const listingsMFD: Listing[] | null =
    markedForDeletion.length && catalogue.listings
      ? catalogue.listings.filter((listing: Listing) =>
          markedForDeletion.find((mfd) => mfd.id.split(":")[1] === listing.id)
        )
      : null;
  if (listingsMFD) {
    const listingsMFDIds: string[] = listingsMFD.map(
      (listing: Listing) => listing.id
    );
    // for each listingsMFDIds remove from cache
    listingsMFDIds.forEach((labelId: string) => {
      handleCacheDeletion(`Listing:${labelId}`);
    });
  }
};

export const handleCopy = (path: string): void => {
  const currentUrl = window.location.href;
  const domain = currentUrl.split("/").slice(0, 3).join("/");
  navigator.clipboard.writeText(domain + path);
};
