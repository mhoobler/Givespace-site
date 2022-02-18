type Props = {
  id: string;
};

declare namespace CatalogueHook {
  export type editCatalogue = GenericEdit;

  export type editCatalogueFile = GenericFileEdit;

  export type base = {
    incrementCatalogueViewsMuation: any;
    handleCatalogueQuery: (idVariable: { [x: string]: string }) => any;
    handleCatalogueSubscription: (idVariable: { [x: string]: string }) => any;
    editCatalogue: editCatalogue;
    editCatalogueFile: editCatalogueFile;
  };

  export type FC = (p: Props) => CatalogueHook.base;
}
