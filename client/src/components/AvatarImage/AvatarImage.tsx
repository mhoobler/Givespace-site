import React, { ChangeEvent, useRef, useState } from "react";

import ToggleEdit from "../ToggleEdit/ToggleEdit";
import Modal from "../Modal/Modal";
import { acceptedImageFiles } from "../../utils/references";

import canvasHelper from "./canvasHelper";
import "./AvatarImage.less";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogueFile;
  value: string;
  keyProp: string;
  className?: string;
};

const AvatarImage: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  keyProp,
  value,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleModal = () => setShowModal((prev) => !prev);

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      throw new Error("No files property on event target");
    }
    if (!canvasRef.current) {
      throw new Error("Could not find cavasRef for HeaderImage");
    }

    const file = evt.target.files[0];
    if (!acceptedImageFiles.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    if (file) {
      const img = new Image();
      img.onload = canvasHelper(canvasRef.current, img);
      img.src = URL.createObjectURL(file);
    }
  };

  const handleClickSubmit = () => {
    if (!fileRef.current) {
      throw new Error("Could not find fileRef for AvatarImage");
    }
    if (!canvasRef.current) {
      throw new Error("Could not find cavasRef for HeaderImage");
    }

    const { files } = fileRef.current;
    if (!files || !files[0]) {
      throw new Error("No file selected");
    }

    // *** Good for testing ***
    //const c: any = canvasRef.current;
    //const display = document.getElementById("avatar-image-display") as HTMLImageElement;
    //const input = document.getElementById("avatar-image-input") as HTMLImageElement;
    //display.src = c.getDataURL();
    //input.src = c.getDataURL();
    //console.log(display.src);

    (canvasRef.current as any).getCroppedImage(
      // toBlob(callback, MIME type, quality)
      (blob: BlobPart | null) => {
        // file name
        const filename = files[0].name.split(".")[0] + Date.now();
        if (blob) {
          handleSubmit(new File([blob], filename), keyProp);
        }
      },
      "image/jpg", // file type
      0.9, // image quality
    );
  };

  return (
    <div>
      <ToggleEdit className="avatar-image-container" isEditing={isEditing}>
        {/* open modal, display image */}
        {/* TODO: Replace Icon */}
        <div className="toggle-wrapper">
          <div
            onClick={handleModal}
            className={`toggle-input icons-container f-center`}
          >
            <div className="icon-btn">Click This</div>
          </div>
          <div className={`toggle-input image-wrapper`}>
            <img id="avatar-image-display" src={value} alt="" />
          </div>
          <div className={`toggle-display image-wrapper`}>
            <img id="avatar-image-input" src={value} alt="" />
          </div>
        </div>
      </ToggleEdit>
      {/* file selection, image cropping, submit */}
      <Modal show={showModal} close={handleModal}>
        <Modal.Header close={handleModal}>Edit Avatar Image</Modal.Header>
        <Modal.Body>
          {/* TODO: Should probably replace with a React Component */}
          <canvas ref={canvasRef} width="200px" height="200px" />
          <input
            ref={fileRef}
            onChange={handleFileChange}
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
    </div>
  );
};

export default AvatarImage;
