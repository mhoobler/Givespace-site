import React from "react";
import {
  TextInput,
  Dropdown,
  CatalogueBanner,
  AvatarImage,
  CalendarInput,
  TextareaInput,
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
      <div className="catalogue-banner-wrapper">
        <CatalogueBanner
          isEditing={isEditing}
          handleSubmit={editCatalogueFile}
          keyProp={"header_image_url"}
          value={catalogue.header_image_url || ""}
          catalogue={catalogue}
        />
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
              <button
                className={`btn btn-primary ${editable ? "" : "hidden"}`}
                onClick={toggleEdit}
              >
                Edit
              </button>
            </div>
            {editable && (
              <div className="btn-wrapper">
                <a
                  onClick={() =>
                    handleCopy(`/list/${catalogue.edit_id}?edit=true`)
                  }
                  className="btn btn-link"
                >
                  Copy Editor Link
                </a>
              </div>
            )}
            <div className="btn-wrapper">
              <a
                onClick={() => handleCopy(`/list/${catalogue.id}`)}
                className="btn btn-link"
              >
                Share
              </a>
            </div>
          </div>
          <div className="dropdown-wrapper">
            <Dropdown
              value={catalogue.status}
              handleSubmit={editCatalogue}
              fieldEditingProps={{
                typename: "Catalogue",
                key: "status",
                id: catalogue.id,
              }}
              className="btn"
            >
              <Dropdown.Toggle
                className="btn"
                disable={
                  !isEditing ||
                  catalogue.user_id !== localStorage.getItem("authorization")
                }
              />

              <Dropdown.Menu>
                {statusOptions.map((option) => (
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
