import React, { useRef, useState } from "react";
import useListingApolloHooks from "../../graphql/hooks/listing";
import { isUrl } from "../../utils/functions";
import EditLinkModal from "./EditLinkModal";

import "./LinksContainer.less";

type Props = {
  listing: Listing;
  isEditing: boolean;
};

const LinksContainer: React.FC<Props> = ({ listing, isEditing }) => {
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [linkEditingId, setLinkEditingId] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const { addLink, removeLink } = useListingApolloHooks();

  const handleSubmit = () => {
    if (!linkInputRef.current) {
      console.log("no input");
      return;
    }
    if (isUrl(linkInputRef.current.value)) {
      setIsValid(true);
      addLink(listing.id, linkInputRef.current.value);
      linkInputRef.current!.value = "";
    } else {
      setIsValid(false);
    }
  };

  const handleEditLinkClose = () => {
    setLinkEditingId(null);
  };

  const linkEditing = linkEditingId
    ? listing.links!.find((lk: Link) => lk.id === linkEditingId)!
    : null;

  return (
    <div>
      {listing.links &&
        listing.links.map((link: Link) => (
          <div className="links" key={link.id}>
            <a href={link.url} key={link.id} target="_blank">
              {link.title}
            </a>
            <div className={`row-container ${!isEditing && "hidden"}`}>
              <button onClick={() => removeLink(link.id)}>X</button>
              <button onClick={() => setLinkEditingId(link.id)}>Edit</button>
            </div>
          </div>
        ))}
      <div className={`row-container ${!isEditing && "hidden"}`}>
        <input
          className={`${!isValid && "invalid_input"}`}
          type="text"
          ref={linkInputRef}
          placeholder="add link"
        />
        <button onClick={handleSubmit} type="submit">
          submit
        </button>
      </div>
      <EditLinkModal link={linkEditing} handleClose={handleEditLinkClose} />
    </div>
  );
};

export default LinksContainer;
