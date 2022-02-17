import React, { useRef, useState } from "react";
import useLinkApolloHooks from "../../graphql/hooks/link";
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
  const { addLink, removeLink } = useLinkApolloHooks();

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
    <div className="links-container">
      {listing.links &&
        listing.links.map((link: Link) => (
          <div className="link-wrapper" key={link.id}>
            <div className={`link ${isEditing ? "" : "editing"}`}>
              <button onClick={() => removeLink(link.id)}>X</button>
              <a href={link.url} key={link.id} target="_blank">
                {link.title}
              </a>
              <button onClick={() => setLinkEditingId(link.id)}>Edit</button>
            </div>
          </div>
        ))}
      <div
        className={`d-flex link-wrapper input-wrapper ${
          !isEditing && "hidden"
        }`}
      >
        <div className="link">
          <button onClick={handleSubmit} type="submit">
            Add Link
          </button>
        </div>
      </div>
      <EditLinkModal link={linkEditing} handleClose={handleEditLinkClose} />
    </div>
  );
};

export default LinksContainer;
