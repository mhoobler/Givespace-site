import React, {
  useState,
  useRef,
  ChangeEvent,
  createRef,
  useEffect,
} from "react";

import { ImageCrop, Modal, ToggleEdit } from "..";
import { acceptedImageFiles } from "../../utils/references";

import "./HeaderImage.less";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogueFile;
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
  const fileRef = useRef<HTMLInputElement>(null);
  const cropRef = createRef<ImageCrop.RefManager>();
  (cropRef as any).current = new ImageCrop.RefManager({
    aspect: 6,
    bound_h: 0.6,
    bound_w: 0.8,
    shape: "rect",
  });

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
    cropRef.current.loadFile(file);
  };

  const handleClickSubmit = () => {
    if (!fileRef.current) {
      throw new Error("Could not find fileRef for HeaderImage");
    }
    if (!cropRef.current) {
      throw new Error("Could not find cropRef for HeaderImage");
    }

    const { files } = fileRef.current;
    if (!files || !files[0]) {
      throw new Error("No file selected");
    }

    // *** Good for testing ***
    const display = document.getElementById(
      "header-image-display",
    ) as HTMLImageElement;
    const input = document.getElementById(
      "header-image-input",
    ) as HTMLImageElement;
    display.src = cropRef.current.getDataURL();
    input.src = cropRef.current.getDataURL();

    //  (canvasRef.current as any).getCroppedImage(
    //    // BlobCallback
    //    (blob: BlobPart | null) => {
    //      // file name
    //      const filename = files[0].name.split(".")[0] + Date.now();
    //      if (blob) {
    //        handleSubmit(new File([blob], filename), keyProp);
    //      }
    //    },
    //    "image/jpg", // file type
    //    0.9, // image quality
    //  );
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
            <div className="icon-btn">Click This</div>
          </div>
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
          {/* TODO: Should probably replace with a React Component */}
          <ImageCrop ref={cropRef} testProp="test" />
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

export default HeaderImage;
