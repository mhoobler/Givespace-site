import { UserInputError } from "apollo-server-express";

export const urlValidation = (url: string): void => {
  if (!url.includes("https://") && !url.includes("http://")) {
    throw new UserInputError("Invalid URL");
  }
};
