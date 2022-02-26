import React from "react";
import { Edit2, Eye } from "../../assets";
import {
  TextInput,
  Dropdown,
  CatalogueBanner,
  AvatarImage,
  CalendarInput,
  TextareaInput,
  IconButton,
} from "../../components";
import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import { handleCopy } from "../../utils/functions";
import { statusOptions, statusTitles } from "../../utils/references";

import "./CatalogueHeader.less";

type Props = {
  isEditing: any;
  editable: boolean;
  catalogue: CatalogueType;
  toggleEdit: () => void;
};

const CatalogueHeader: React.FC<Props> = ({
  isEditing,
  editable,
  catalogue,
  toggleEdit,
}) => {
  const { editCatalogue, editCatalogueFile } = useCatalogueApolloHooks({
    id: catalogue.id,
  });

  return (
    <div className="catalogue-header-container">
      {/* header image hero*/}
      <div className={`catalogue-banner-wrapper ${isEditing ? "editing" : ""}`}>
        {/* color border */}
        <CatalogueBanner
          isEditing={isEditing}
          handleSubmit={editCatalogueFile}
          keyProp={"header_image_url"}
          value={catalogue.header_image_url || ""}
          catalogue={catalogue}
        />
        <div
          className="color-border"
          style={{ backgroundColor: catalogue.header_color }}
        ></div>
      </div>
      <div className="header-content">
        {/* left half */}
        <div className="left-half">
          {/* avatar, author, title */}
          <div className="avatar-author-title-container">
            <div className="avatar-image-wrapper">
              <AvatarImage
                isEditing={isEditing}
                handleSubmit={editCatalogueFile}
                keyProp={"profile_picture_url"}
                value={catalogue.profile_picture_url || ""}
              />
            </div>
            <div className="author-title-wrapper">
              <TextInput
                isEditing={isEditing}
                handleSubmit={editCatalogue}
                fieldEditingProp={{
                  typename: "Catalogue",
                  key: "author",
                  id: catalogue.id,
                }}
                value={catalogue.author || ""}
                placeholder="Author"
              />
              <TextInput
                isEditing={isEditing}
                handleSubmit={editCatalogue}
                fieldEditingProp={{
                  typename: "Catalogue",
                  key: "title",
                  id: catalogue.id,
                }}
                value={catalogue.title || ""}
                className="fs-2"
              />
            </div>
          </div>

          {/* event_date, views, location */}
          <div className="f-row event-date-views-location">
            <div className="views-wrapper">views: {catalogue.views}</div>
            <div className="event-date-wrapper">
              <CalendarInput
                isEditing={isEditing}
                value={catalogue.event_date}
                handleOnSubmit={(date: string) =>
                  editCatalogue(date, "event_date")
                }
              />
            </div>
          </div>
          {/* description */}
          <div>
            <TextareaInput
              isEditing={isEditing}
              handleSubmit={editCatalogue}
              fieldEditingProp={{
                typename: "Catalogue",
                key: "description",
                id: catalogue.id,
              }}
              value={catalogue.description || ""}
            />
          </div>
        </div>

        {/* right half */}
        <div className="right-half">
          {/* edit toggle, editor link, share link, public/private options */}
          <div className="edit-copy-share">
            <div className="btn-wrapper">
              {editable && (
                <IconButton
                  className={`btn btn-primary edit-button`}
                  src={isEditing ? Eye : Edit2}
                  label={isEditing ? "Preview" : "Edit"}
                  onClick={toggleEdit}
                />
              )}
            </div>
            {editable && (
              <div className="btn-wrapper">
                <a
                  onClick={() =>
                    handleCopy(`/ctg/${catalogue.edit_id}?edit=true`)
                  }
                  className="btn"
                >
                  Copy Editor Link
                </a>
              </div>
            )}
            <div className="btn-wrapper">
              <a
                onClick={() => handleCopy(`/ctg/${catalogue.id}`)}
                className="btn"
              >
                Share
              </a>
            </div>
          </div>
          <div className="dropdown-wrapper">
            <span className="fs-1-125">This list is: </span>
            <Dropdown
              value={catalogue.status}
              handleSubmit={editCatalogue}
              fieldEditingProps={{
                typename: "Catalogue",
                key: "status",
                id: catalogue.id,
              }}
            >
              <Dropdown.Toggle
                className="sudo-btn"
                disable={
                  !isEditing ||
                  catalogue.user_id !== localStorage.getItem("authorization")
                }
              />

              <Dropdown.Menu>
                {statusOptions
                  .filter((option) => option !== catalogue.status)
                  .map((option) => (
                    <Dropdown.Item
                      title={statusTitles[option]}
                      className="btn"
                      key={option}
                      value={option}
                    >
                      {option}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueHeader;
