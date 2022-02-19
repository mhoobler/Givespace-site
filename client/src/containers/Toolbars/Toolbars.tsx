import React from "react";
import { useNavigate } from "react-router-dom";

interface ToolbarProps {}

interface CatalogueToolbarProps extends ToolbarProps {}

const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
  return <nav className="toolbar-container">{children}</nav>;
};

const CatalogueToolbar: React.FC<CatalogueToolbarProps> = ({}) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Toolbar>
      <div className="">
        <a className="btn btn-primary" onClick={goBack}>
          Go Back
        </a>
      </div>
    </Toolbar>
  );
};

export { CatalogueToolbar };
