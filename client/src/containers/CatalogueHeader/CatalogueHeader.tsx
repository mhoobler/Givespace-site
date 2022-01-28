import React from "react";
import { TextInput, FileInput, Dropdown } from "../../components";
import { statusOptions } from "../../utils/references";

type Props = {
  isEditing: any;
  catalogue: CatalogueType;
  handleTextInput: (t: string, objectKey: string) => void;
  handleFileInput: (f: File | undefined, objectKey: string) => void;
  handleDDSubmit: (t: string, objectKey: string) => void;
  toggleEdit: () => void;
};

const CatalogueHeader: React.FC<Props> = ({
  isEditing,
  catalogue,
  handleTextInput,
  handleFileInput,
  handleDDSubmit,
  toggleEdit,
}) => {
  return (
    <div className="row catalogue-header-container">
      {/* header image hero*/}
      <div className="col-12" style={{ height: "50px" }}>
        <div> IMAGE </div>
      </div>
      {/* avatar, name, title, views, description, date, location */}
      <div className="col-12 d-flex flex-md-row flex-sm-column-reverse">
        <div className="flex-grow-1">
          <TextInput
            isEditing={isEditing}
            handleSubmit={handleTextInput}
            keyProp="title"
            value={catalogue.title}
            className="fs-2"
          />
          <TextInput
            isEditing={isEditing}
            handleSubmit={handleTextInput}
            keyProp="description"
            value={catalogue.description || ""}
          />
          <FileInput
            isEditing={isEditing}
            handleSubmit={handleFileInput}
            keyProp="header_image_url"
            value={catalogue.header_image_url || ""}
          />

          <div className="row">
            <div>views: {catalogue.views}</div>
          </div>
        </div>

        {/* edit toggle, editor link, share link, public/private options */}
        <div className="flex-grow-1">
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
