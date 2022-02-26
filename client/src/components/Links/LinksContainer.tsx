import React, { KeyboardEvent, useRef, useState } from "react";
import { IconButton } from "..";
import { Plus } from "../../assets";
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
  isEditing = true;
  const [linkEditingId, setLinkEditingId] = useState<string | null>(null);
  const [_isValid, setIsValid] = useState(true);
  const { addLink, removeLink } = useLinkApolloHooks();

  const handleSubmit = () => {
    if (!linkInputRef.current) {
      console.log("no input");
      return null;
    }
    if (isUrl(linkInputRef.current.value)) {
      setIsValid(true);
      addLink(listing.id, linkInputRef.current.value);
      linkInputRef.current!.value = "";
    } else {
      setIsValid(false);
    }
  };
  const inputKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && linkInputRef.current) {
      handleSubmit();
    }
  };

  const handleEditLinkClose = () => {
    setLinkEditingId(null);
  };

  const linkEditing =
    linkEditingId && listing.links
      ? listing.links.find((lk: Link) => lk.id === linkEditingId)!
      : null;
  const orderedLinks: Link[] | null =
    listing.links &&
    [...listing.links].sort((a: Link, b: Link) => {
      // transform date to number
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    });

  return (
    <div className="links-container">
      {orderedLinks &&
        orderedLinks.map((link: Link) => (
          <div
            className={`link-wrapper length-${orderedLinks.length}`}
            key={link.id}
          >
            <div className={`link ${isEditing ? "" : "editing"}`}>
              <button onClick={() => removeLink(link.id)}>X</button>
              <a href={link.url} key={link.id} target="_blank">
                {link.title}
              </a>
              <button onClick={() => setLinkEditingId(link.id)}>Edit</button>
            </div>
          </div>
        ))}
      {!(listing.links && listing.links.length > 5) && (
        <div
          className={`d-flex link-wrapper length-${
            listing.links && listing.links.length
          } input-wrapper ${isEditing ? "" : "hidden"}`}
        >
          <div className="link input-wrapper">
            <input
              ref={linkInputRef}
              onKeyDown={inputKeyDown}
              type="text"
              placeholder="Add Link"
            />
            <IconButton src={Plus} onClick={handleSubmit} />
          </div>
        </div>
      )}
      <EditLinkModal link={linkEditing} handleClose={handleEditLinkClose} />
    </div>
  );
};

export default LinksContainer;
