import React from "react";
import useListingApolloHooks from "../../graphql/hooks/listing";

import "./LinksContainer.less";

type Props = {
  listing: Listing;
  isEditing: boolean;
};

const LinksContainer: React.FC<Props> = ({ listing, isEditing }) => {
  const linkInputRef = React.useRef<HTMLInputElement>(null);
  const { addLink, removeLink } = useListingApolloHooks();

  const handleSubmit = () => {
    addLink(listing.id, linkInputRef.current!.value);
  };

  return (
    <div>
      {listing.links &&
        listing.links.map((link: Link) => (
          <div className="link" key={link.id}>
            <a href={link.url} key={link.id} target="_blank">
              {link.title}
            </a>
            <button
              className={`${!isEditing && "hidden"}`}
              onClick={() => removeLink(link.id)}
            >
              X
            </button>
          </div>
        ))}
      <div className={`row-container ${!isEditing && "hidden"}`}>
        <input type="text" ref={linkInputRef} />
        <button onClick={handleSubmit} type="submit">
          submit
        </button>
      </div>
    </div>
  );
};

export default LinksContainer;
