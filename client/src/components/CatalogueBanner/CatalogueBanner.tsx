import React, {
  useState,
  useRef,
  ChangeEvent,
  createRef,
  useEffect,
} from "react";

import { ImageCrop, Modal, ToggleEdit, ColorInput, IconButton } from "..";
import { acceptedImageFiles } from "../../utils/references";

import { Camera } from "../../assets";

import "./CatalogueBanner.less";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogueFile;
  value: string;
  keyProp: string;
  className?: string;
};

const CatalogueBanner: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  keyProp,
  value,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ImageCrop: use `createRef` and assign `new ImageCrop.RefManager`
  const cropRef = createRef<ImageCrop.RefManager>();
  (cropRef as any).current = new ImageCrop.RefManager({
    aspect: 5.5,
    bound_h: 0.6,
    bound_w: 0.8,
    shape: "rect",
  });

  // ImageCrop: this `useEffect` clears the canvas and the render loop
  useEffect(() => {
    return () => {
      if (cropRef.current) {
        cropRef.current.clear();
      }
    };
  }, [handleSubmit, isEditing, showModal]);

  const handleModal = () =>
    setShowModal((prev) => {
      (fileRef as any).current.value = "";
      return !prev;
    });

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      throw new Error("No files property on event target");
    }
    if (!cropRef.current) {
      throw new Error("No cropRef");
    }

    const file = evt.target.files[0];
    if (!acceptedImageFiles.includes(file.type)) {
      throw new Error("Invalid file type");
    }
    // ImageCrop: load a file
    cropRef.current.loadFile(file);
  };

  const handleClickSubmit = () => {
    if (!fileRef.current)
      throw new Error("Could not find fileRef for HeaderImage");
    if (!cropRef.current)
      throw new Error("Could not find cropRef for HeaderImage");

    const { files } = fileRef.current;
    if (!files || !files[0]) throw new Error("No file selected");

    // ImageCrop: Good for testing
    //const display = document.getElementById(
    //  "header-image-display",
    //) as HTMLImageElement;
    //const input = document.getElementById(
    //  "header-image-input",
    //) as HTMLImageElement;
    //display.src = cropRef.current.getDataURL();
    //input.src = cropRef.current.getDataURL();

    // ImageCrop: Extract image data and package into file
    cropRef.current.getImageBlob(
      // BlobCallback
      (blob: BlobPart | null) => {
        // file name
        const splitFile = files[0].name.split(".");
        const filename = splitFile[0] + Date.now() + "." + splitFile[1];
        if (blob) {
          handleSubmit(new File([blob], filename), keyProp);
          handleModal();
        }
      },
      "image/jpg", // file type
      0.9, // image quality
    );
  };

  return (
    <>
      <ToggleEdit
        className="catalogue-banner-container"
        isEditing={isEditing}
        style={{ display: value || isEditing ? "" : "none" }}
      >
        {/* open modal, display image */}
        <div className="toggle-wrapper">
          <div className={`toggle-input icons-container f-center`}>
            {/* change image */}
            <IconButton onClick={handleModal} src={Camera} />
            {/* color image */}
            {/* TODO: TODO: TODO: change the handleFunctions */}
            <ColorInput
              color="#FFAAAA"
              handleChange={(s: string) => {}}
              handleSubmit={(s: string) => {}}
            />
          </div>
          {/* color border */}
          <div
            className="color-border"
            style={{ backgroundColor: "red" }}
          ></div>
          {/* background images */}
          <div className={`toggle-input image-wrapper`}>
            <img id="header-image-display" src={value} alt="" />
          </div>
          <div className={`toggle-display image-wrapper`}>
            <img id="header-image-input" src={value} alt="" />
          </div>
        </div>
      </ToggleEdit>
      {/* file selection, image cropping, submit */}
      <Modal show={showModal} close={handleModal}>
        <Modal.Header close={handleModal}>Edit Header Image</Modal.Header>
        <Modal.Body>
          {/* ImageCrop: pass ref to component */}
          <ImageCrop ref={cropRef} />
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
    </>
  );
};

export default CatalogueBanner;