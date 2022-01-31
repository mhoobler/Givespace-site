import { cache } from "../graphql/clientConfig";

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
