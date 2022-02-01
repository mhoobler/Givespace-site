import { DocumentNode } from "graphql";
import client, { cache } from "../graphql/clientConfig";
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

export const initializeDeletion = (
  id: string,
  type: GraphqlModel,
  markedForDeletion: string[],
  setMarkedForDeletion: (value: string[]) => any
) => {
  const cacheId = `${type}:${id}`;

  let fragment: DocumentNode;
  if (type === "Label") fragment = LABEL_FIELDS;
  else if (type === "Listing") fragment = LISTING_FIELDS;
  else fragment = ALL_CATALOGUE_FIELDS;
  const obj = cache.readFragment({
    id: cacheId,
    fragment,
  });
  console.log("obj", obj);

  const markedObj = {
    id: cacheId,
    obj,
  };

  setMarkedForDeletion([...markedForDeletion, JSON.stringify(markedObj)]);

  handleCacheDeletion(cacheId);

  return obj;
};

export const handleDeletion = (
  id: string,
  type: GraphqlModel,
  data: any,
  markedForDeletion: string[],
  setMarkedForDeletion: (value: string[]) => void,
  callback: () => any
) => {
  const cacheId = `${type}:${id}`;
  console.log("markedForDeletion", markedForDeletion);

  let fragment: DocumentNode;
  if (type === "Label") fragment = LABEL_FIELDS;
  else if (type === "Listing") fragment = LISTING_FIELDS;
  else fragment = ALL_CATALOGUE_FIELDS;

  if (markedForDeletion.find((item) => item === cacheId)) {
    console.log("Deleted");
    setMarkedForDeletion(markedForDeletion.filter((item) => item !== cacheId));
    callback();
  } else {
    console.log("Undoood");
    client.writeFragment({
      id: cacheId,
      fragment,
      data,
    });
  }
};

export const maxOrdering = (list: any[]): number => {
  if (!list[0]) return 0;
  return list.reduce(
    // @ts-ignore
    (max, listing) => Math.max(max, listing.ordering),
    list[0].ordering
  );
};
