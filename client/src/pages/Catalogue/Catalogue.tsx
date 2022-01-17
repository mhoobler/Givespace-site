import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATALOGUE } from "../../graphql/schemas";

const Catalogue = () => {
  const { catalogue_id } = useParams();
  const navigate = useNavigate();

  // @ts-ignore
  // Some kind of Query or Subscription
  let catalogueData = useQuery(GET_CATALOGUE, {
    variables: { id: catalogue_id },
  });

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
        {/* {catalogueData.data && (
          <div className="col-12">User: {catalogueData.data.user_id}</div>
        )} */}
      </div>
    </div>
  );
};

export default Catalogue;
