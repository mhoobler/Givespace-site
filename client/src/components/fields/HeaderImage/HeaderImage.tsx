import React, { useState, useRef } from "react";

import ToggleEdit from "../../ToggleEdit/ToggleEdit";
import Modal from "../../Modal/Modal";
import { acceptedImageFiles } from "../../../utils/references";

import "./HeaderImage.less";

type Props = {
  isEditing: boolean;
  handleSubmit: (file: any, objectKey: string) => any;
  value: string;
  keyProp: string;
  className?: string;
};

const HeaderImage: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  keyProp,
  value,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);

  const fileRef = useRef(null);

  const handleModal = () => setShowModal((prev) => !prev);

  const handleClickSubmit = () => {
    if (!fileRef.current) {
      throw new Error("Could not find fileRef for AvatarImage");
    }
    const { files } = fileRef.current;

    if (!files[0]) {
      throw new Error("No file selected");
    }
    const file = files[0] as File;

    if (!acceptedImageFiles.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    handleSubmit(file, keyProp);
  };

  return (
    <>
      <ToggleEdit className="header-image-container" isEditing={isEditing}>
        {/* open modal, display image */}
        {/* TODO: Replace Icons */}
        <div className="toggle-wrapper">
          <div
            onClick={handleModal}
            className={`toggle-input icons-container f-center`}
          >
            <div>H</div>
          </div>
          <div className={`toggle-input image-wrapper`}>
            <img src={value} alt="" />
          </div>
          <div className={`toggle-display image-wrapper`}>
            <img src={value} alt="" />
          </div>
        </div>
      </ToggleEdit>
      {/* file selection, image cropping, submit */}
      <Modal show={showModal} close={handleModal}>
        <Modal.Header close={handleModal}>Edit Header Image</Modal.Header>
        <Modal.Body>
          {/* TODO: Should probably replace with a React Component */}
          <input
            ref={fileRef}
            className={`toggle-input file-input ${className || ""}`}
            type="file"
            name={keyProp}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleClickSubmit}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HeaderImage;
