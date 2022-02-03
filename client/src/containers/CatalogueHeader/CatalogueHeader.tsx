import React from "react";
import {
  TextInput,
  Dropdown,
  HeaderImage,
  AvatarImage,
  CalendarInput,
} from "../../components";
import { statusOptions } from "../../utils/references";

import "./CatalogueHeader.less";

type Props = {
  isEditing: any;
  catalogue: CatalogueType;
  handleTextInput: (t: string, objectKey: string) => void;
  handleFileInput: (f: File | undefined, objectKey: string) => void;
  handleDDSubmit: (t: string, objectKey: string) => void;
  handleDateInput: (ISOString: string, objectKey: string) => void;
  toggleEdit: () => void;
};

const CatalogueHeader: React.FC<Props> = ({
  isEditing,
  catalogue,
  handleTextInput,
  handleFileInput,
  handleDDSubmit,
  handleDateInput,
  toggleEdit,
}) => {
  return (
    <div className="catalogue-header-container">
      {/* header image hero*/}
      <div className="header-image-wrapper">
        <HeaderImage
          isEditing={isEditing}
          handleSubmit={handleFileInput}
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
                handleSubmit={handleFileInput}
                keyProp={"profile_picture_url"}
                value={catalogue.profile_picture_url || ""}
              />
            </div>
            <div className="d-flex flex-column author-title-wrapper">
              <TextInput
                isEditing={isEditing}
                handleSubmit={handleTextInput}
                keyProp="author"
                value={catalogue.author || ""}
              />
              <TextInput
                isEditing={isEditing}
                handleSubmit={handleTextInput}
                keyProp="title"
                value={catalogue.title}
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
                handleDateInput={handleDateInput}
              />
            </div>
          </div>
          {/* description */}
          <div>
            <TextInput
              isEditing={isEditing}
              handleSubmit={handleTextInput}
              keyProp="description"
              value={catalogue.description || ""}
            />
          </div>
        </div>

        {/* right half */}
        <div className="d-flex flex-grow-1 flex-md-column flex-sm-row right-half">
          {/* edit toggle, editor link, share link, public/private options */}
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={toggleEdit}>
              Edit
            </button>
            <a className="btn btn-link">Copy Editor Link</a>
            <a className="btn btn-link">Share</a>
          </div>
          <div className="d-flex justify-content-end">
            <Dropdown
              value={catalogue.status}
              handleSubmit={handleDDSubmit}
              keyProp="status"
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
  );
};

export default CatalogueHeader;
