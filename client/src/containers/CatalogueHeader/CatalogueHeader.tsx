import React from "react";
import { TextInput, FileInput, Dropdown } from "../../components";

type Props = {
  isEditing: any;
  catalogue: CatalogueType;
  handleTextInput: (t: string) => void;
  handleFileInput: (f: File | undefined) => void;
  toggleEdit: () => void;
};

const CatalogueHeader: React.FC<Props> = ({
  isEditing,
  catalogue,
  handleTextInput,
  handleFileInput,
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
            <Dropdown value="test">
              <Dropdown.Toggle />
              <Dropdown.Menu>
                <Dropdown.Item value={"test1"}>Test 1</Dropdown.Item>
                <Dropdown.Item value={"test2"}>Test 2</Dropdown.Item>
                <Dropdown.Item value={"test3"}>Test 3</Dropdown.Item>
                <Dropdown.Item value={"test4"}>Test 4</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueHeader;
