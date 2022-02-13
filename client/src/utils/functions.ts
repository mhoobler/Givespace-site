import { DocumentNode } from "graphql";
import { cache } from "../graphql/clientConfig";
import {
  ALL_CATALOGUE_FIELDS,
  LABEL_FIELDS,
  LISTING_FIELDS,
} from "../graphql/fragments";

export const apolloHookErrorHandler = (
  path: string,
  hookError: any,
  warning?: boolean
): void => {
  if (hookError) {
    if (warning) {
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

export const maxOrdering = (list: any[]): number => {
  if (!list[0]) return 0;
  return list.reduce(
    // @ts-ignore
    (max, listing) => Math.max(max, listing.ordering),
    list[0].ordering
  );
};

export const handleDeletion = (
  id: string,
  type: string,
  deletionMutation: () => void,
  textField?: string,
  setRemoveMFD?: (value: RemoveMFD) => void,
  markedForDeletion?: MarkedForDeletion[],
  setMarkedForDeletion?: (value: MarkedForDeletion[]) => void
) => {
  const cacheId = `${type}:${id}`;

  // if it will contain undo functionality
  if (textField && setRemoveMFD && markedForDeletion && setMarkedForDeletion) {
    const deleteTimeout = setTimeout(() => {
      deletionMutation();
      setRemoveMFD({ id: cacheId, isUndo: false });
    }, 5000);

    let fragment: DocumentNode;
    let fragmentName: string;
    if (type === "Label") {
      fragment = LABEL_FIELDS;
      fragmentName = "AllLabelFields";
    } else if (type === "Listing") {
      fragment = LISTING_FIELDS;
      fragmentName = "AllListingFields";
    } else {
      fragment = ALL_CATALOGUE_FIELDS;
      fragmentName = "AllCatalogueFields";
    }

    const data: any = cache.readFragment({
      id: cacheId,
      fragment,
      fragmentName,
    });

    setMarkedForDeletion([
      ...markedForDeletion,
      {
        id: cacheId,
        text: `${type.toLocaleLowerCase()} "${data[textField]}" deletion`,
        timeout: deleteTimeout,
        data,
        fragment,
      },
    ]);
  } else {
    deletionMutation();
  }

  handleCacheDeletion(cacheId);
};

export const randomNumbers = (length: number): string => {
  const numbers = [];
  for (let i = 0; i < length; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  return numbers.join("");
};
