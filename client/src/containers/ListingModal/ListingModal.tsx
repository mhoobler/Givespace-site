import React from "react";

import {
  FileInput,
  Modal,
  TextInput,
  Checkbox,
  TextareaInput,
  ListingLabelContainer,
  LinksContainer,
} from "../../components";
import useListingApolloHooks from "../../graphql/hooks/listing";

import "./ListingModal.less";

type Props = {
  listingId: string | null;
  listing: Listing | null;
  labels: Label[] | null;
  isEditing: boolean;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({
  listingId,
  listing,
  labels,
  isEditing,
  handleClose,
}) => {
  const { editListing, editBoolean, editListingFile } = useListingApolloHooks();
  if (!listingId) return null;
  if (!listing) {
    return (
      <Modal show={listing !== null} close={handleClose}>
        <div className="modal-header">Listing no longer exists</div>
      </Modal>
    );
  }
  // console.log("ListingModal", listing);

  return (
    <Modal
      className="listing-modal-container"
      show={listing !== null}
      close={handleClose}
    >
      <Modal.Header close={handleClose}>{listing && listing.name}</Modal.Header>
      <Modal.Body>
        {/* left side - name, image*/}
        <div className="left-side">
          <TextInput
            isEditing={isEditing}
            handleSubmit={editListing(listing.id)}
            value={listing.name || ""}
            keyProp="name"
            className="h2"
            placeholder="Title"
          />
          <FileInput
            isEditing={isEditing}
            handleSubmit={editListingFile(listing.id)}
            keyProp="image_url"
            value={listing.image_url || ""}
          />
        </div>
        <div className="listing-separator"></div>
        {/* right side - description, labels, links, price*/}
        <div className="right-side">
          <TextareaInput
            isEditing={isEditing}
            handleSubmit={editListing(listing.id)}
            value={listing.description || ""}
            keyProp="description"
            placeholder="Description"
          />
          <ListingLabelContainer
            labels={labels}
            listing={listing}
            isEditing={isEditing}
          />
          <div className="d-flex justify-content-between">
            <TextInput
              isEditing={isEditing}
              handleSubmit={editListing(listing.id)}
              value={listing.price?.toString() || ""}
              keyProp="price"
              validator={(value) => {
                // if value contains letters return false
                return !/[a-z]/i.test(value);
              }}
              placeholder="Price"
            />
            <Checkbox
              isEditing={isEditing}
              value={listing.show_price}
              label="Show price"
              keyProp="show_price"
              onChange={editBoolean(listing.id)}
            />
          </div>
          <LinksContainer listing={listing} isEditing={isEditing} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ListingModal;
