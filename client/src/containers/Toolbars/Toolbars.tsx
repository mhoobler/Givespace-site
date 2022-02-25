import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Feedback } from "../../components";
import useUtilsHooks from "../../graphql/hooks/utils";

import "./Toolbars.less";

interface ToolbarProps {}

interface CatalogueToolbarProps extends ToolbarProps {}

const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
  return <nav className="toolbar-wrapper">{children}</nav>;
};

const CatalogueToolbar: React.FC<CatalogueToolbarProps> = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { addNavigationMetric } = useUtilsHooks();

  useEffect(() => {
    addNavigationMetric(location.pathname + location.search);
  }, [location]);

  return (
    <Toolbar>
      <Feedback />
      <div className="">
        <a className="btn btn-primary" onClick={goBack}>
          Go Back
        </a>
      </div>
    </Toolbar>
  );
};

export { CatalogueToolbar };
