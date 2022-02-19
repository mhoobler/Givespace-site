import React from "react";
import { useLocation } from "react-router-dom";
import {
  TextInput,
  Dropdown,
  HeaderImage,
  AvatarImage,
  CalendarInput,
  ColorInput,
} from "../../components";
import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import { handleCopy, updateCatalogueCache } from "../../utils/functions";
import { statusOptions } from "../../utils/references";

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
      <div className="header-image-wrapper">
        <ColorInput
          handleSubmit={(color) => editCatalogue(color, "header_color")}
          handleChange={(color) =>
            updateCatalogueCache(
              `Catalogue:${catalogue.id}`,
              "header_color",
              color
            )
          }
          color={catalogue.header_color}
        />
        <HeaderImage
          isEditing={isEditing}
          handleSubmit={editCatalogueFile}
          keyProp={"header_image_url"}
          value={catalogue.header_image_url || ""}
        />
      </div>
      <div className="header-content">
        {/* left half */}
        <div className="left-half">
          {/* avatar, author, title */}
          <div className="d-flex avatar-author-title">
            <div className="d-flex avatar-image-wrapper">
              <AvatarImage
                isEditing={isEditing}
                handleSubmit={editCatalogueFile}
                keyProp={"profile_picture_url"}
                value={catalogue.profile_picture_url || ""}
              />
            </div>
            <div className="d-flex flex-column author-title-wrapper">
              <TextInput
                isEditing={isEditing}
                handleSubmit={editCatalogue}
                fieldEditingProp={{
                  typename: "Catalogue",
                  key: "author",
                  id: catalogue.id,
                }}
                value={catalogue.author || ""}
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
          <div className="row event-date-views-location">
            <div className="col-4 views-wrapper">views: {catalogue.views}</div>
            <div className="col-4 event-date-wrapper">
              <CalendarInput
                value={catalogue.event_date}
                keyProp="event_date"
                handleDateInput={editCatalogue}
              />
            </div>
          </div>
          {/* description */}
          <div>
            <TextInput
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
          <div className="d-flex flex-grow-1 flex-md-column flex-sm-row right-half">
            {/* edit toggle, editor link, share link, public/private options */}
            <div className="d-flex justify-content-end">
              <button
                className={`btn btn-primary ${editable ? "" : "hidden"}`}
                onClick={toggleEdit}
              >
                Edit
              </button>
              <a
                onClick={() =>
                  handleCopy(`/list/${catalogue.edit_id}?edit=true`)
                }
                className="btn btn-link"
              >
                Copy Editor Link
              </a>
              <a
                onClick={() => handleCopy(`/list/${catalogue.id}`)}
                className="btn btn-link"
              >
                Share
              </a>
            </div>
            <div className="d-flex justify-content-end">
              <Dropdown
                value={catalogue.status}
                handleSubmit={editCatalogue}
                fieldEditingProps={{
                  typename: "Catalogue",
                  key: "status",
                  id: catalogue.id,
                }}
                className={isEditing ? "hidden" : ""}
              >
                <Dropdown.Toggle disable={!isEditing} />
                <Dropdown.Menu>
                  {statusOptions.map((option) => (
                    <Dropdown.Item key={option} value={option}>
                      {option}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueHeader;
