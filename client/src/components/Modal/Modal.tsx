import React from "react";

// TODO: I think this whole page needs touch up
import "./Modal.less";

type ModalProps = {
  className?: string;
  show: boolean;
  close: () => void;
};

const Modal: React.FC<ModalProps> = ({ className, show, close, children }) => {
  return (
    <div className={`modal ${show && "show"} ${className || ""}`}>
      <div className="modal-dialog">
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
          X
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
