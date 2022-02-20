import React, { useRef, useEffect } from "react";
import { X } from "../../assets";

import "./Modal.less";

type ModalProps = {
  className?: string;
  show: boolean;
  close: () => void;
};

const Modal: React.FC<ModalProps> = ({ className, show, close, children }) => {
  const outterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outterRef.current) {
      if (show) {
        outterRef.current.classList.remove("hide");
        setTimeout(() => {
          outterRef.current!.classList.add("show");
        }, 1);
      } else {
        outterRef.current.classList.remove("show");
        setTimeout(() => {
          outterRef.current!.classList.add("hide");
        }, 125);
      }
    }
  });

  //Close the modal if we click on the outterRef
  const handleOutterClick = (evt: React.SyntheticEvent<HTMLDivElement>) => {
    if (outterRef.current) {
      if (evt.target === outterRef.current) {
        // when leaving modal, this saves current changes because of the way
        // submitting works on inputs
        outterRef.current.focus();
        setTimeout(() => {
          close();
        }, 0);
      }
    }
  };

  return (
    <div
      className={`modal hide ${className || ""}`}
      onMouseDown={handleOutterClick}
      ref={outterRef}
    >
      <div className="modal-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

type HeaderProps = {
  close?: () => void;
};

const Header: React.FC<HeaderProps> = ({ close, children }) => {
  return (
    <div className="modal-header">
      <div className="modal-title">{children}</div>
      {close && (
        <button type="button" className="close" onClick={close}>
          <img src={X} />
        </button>
      )}
    </div>
  );
};

type BodyProps = {};

const Body: React.FC<BodyProps> = ({ children }) => {
  return <div className="modal-body">{children}</div>;
};

type FooterProps = {};

const Footer: React.FC<FooterProps> = ({ children }) => {
  return <div className="modal-footer">{children}</div>;
};

export default Object.assign(Modal, { Header, Body, Footer });
