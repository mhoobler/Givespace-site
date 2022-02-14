declare namespace LinkHook {
  export type addLink = (listing_id: string, url: string) => void;

  export type removeLink = (id: string) => void;

  export type editLink = (id: string, value: string, key: string) => void;

  export type base = {
    addLink: LinkHook.addLink;
    removeLink: ListingHook.removeLink;
    editLink: LinkHook.editLink;
  };

  export type FC = () => LinkHook.base;
}
