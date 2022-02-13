import React from "react";
import Modal from "../Modal/Modal";
import useListingApolloHooks from "../../graphql/hooks/listing";
import { isUrl } from "../../utils/functions";

import "./LinksContainer.less";
import TextInput from "../fields/TextInput/TextInput";

type Props = {
  link: Link | null;
  handleClose: () => void;
};

const EditLinkModal: React.FC<Props> = ({ link, handleClose }) => {
  const { editLink } = useListingApolloHooks();

  if (!link) return null;

  const handleSubmit = (text: string, keyProp: string) => {
    const key = keyProp.split(":").pop();
    if (!key) {
      console.warn("Key error");
      return;
    }
    editLink(link.id, text, key);
  };

  // only get the first part of the url
  const rootUrl = link.url.split("/").slice(0, 3).join("/");

  return (
    <Modal show={link !== null} close={handleClose}>
      <div className="row-container">
        <img
          src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${rootUrl}&size=256`}
          alt="url favicon"
        />
        <TextInput
          isEditing={true}
          handleSubmit={handleSubmit}
          value={link.title || ""}
          keyProp={`Link:${link.id}:title`}
          placeholder="title"
        />
      </div>
      <TextInput
        isEditing={true}
        handleSubmit={handleSubmit}
        validator={isUrl}
        value={link.url || ""}
        keyProp={`Link:${link.id}:url`}
        placeholder="url"
      />
    </Modal>
  );
};

export default EditLinkModal;
