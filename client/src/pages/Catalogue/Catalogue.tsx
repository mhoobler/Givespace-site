import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const Catalogue = () => {
  const { catalogue_id } = useParams();
  const navigate = useNavigate();

  // @ts-ignore
  // Some kind of Query or Subscription

  const goBack = () => navigate(-1);

  return (
    <div>
      <div className="row">
        <div className="col-2">
          <a className="btn btn-primary" onClick={goBack}>
            Go Back
          </a>
        </div>
      </div>
      <div className="row">
        <div className="col-12">Catalogue: {catalogue_id}</div>
      </div>
    </div>
  );
};

export default Catalogue;
