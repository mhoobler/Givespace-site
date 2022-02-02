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

export const maxOrdering = (list: any[]): number => {
  if (!list[0]) return 0;
  return list.reduce(
    // @ts-ignore
    (max, listing) => Math.max(max, listing.ordering),
    list[0].ordering
  );
};
