export const apolloHookErrorHandler = (
  path: string,
  hookError: any,
  warning?: boolean
) => {
  if (hookError) {
    if (warning) {
      console.warn(`ERROR at "${path}":\n\n${hookError}`);
    } else {
      throw new Error(`ERROR at "${path}":\n\n${hookError}`);
    }
  }
};
