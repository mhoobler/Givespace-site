type Props = {
  id: string;
};

declare namespace CatalogueHook {
  export type editCatalogue = (text: string, objectKey: string) => void;

  export type editCatalogueFile = (
    file: File | undefeind,
    objectKey: string,
  ) => void;

  export type base = {
    incrementCatalogueViews: any;
    catalogueSubscription: any;
    catalogueQuery: any;
    editCatalogue: editCatalogue;
    editCatalogueFile: editCatalogueFile;
  };

  export type FC = (p: Props) => CatalogueHook.base;
}
