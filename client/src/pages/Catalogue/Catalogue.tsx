import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_CATALOGUE, LIVE_CATALOGUE } from "../../graphql/schemas";

type ToolbarProps = {
  setIsEditing: (f: React.SetStateAction<boolean>) => void;
};

const CatalogueToolbar: React.FC<ToolbarProps> = ({ setIsEditing }) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  return (
    <div className="row">
      <div className="col-2">
        <a className="btn btn-primary" onClick={goBack}>
          Go Back
        </a>
        <button className="btn btn-warning" onClick={toggleEditing}>
          Edit
        </button>
      </div>
    </div>
  );
};

const ToggleInput: React.FC<any> = ({ boolean, children }) => {
  if (boolean) {
    return <>{children[0]}</>;
  }
  return <>{children[1]}</>;
};

const Catalogue = () => {
  const { catalogue_id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const catalogueSubscription = useSubscription(LIVE_CATALOGUE, {
    variables: { id: catalogue_id },
  });
  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: { id: catalogue_id },
  });
  console.log("catalogueQuery.data", catalogueQuery.data);
  console.log("catalogue_id", catalogue_id);
  console.log("catalogueSubscription.data", catalogueSubscription.data);

  if (!catalogueQuery.data && !catalogueSubscription.data) {
    return <div>Loading...</div>;
  }

  // This needs to update cache

  const catalogue = catalogueSubscription.data
    ? catalogueSubscription.data.liveCatalogue
    : catalogueQuery.data.catalogues[0];
  return (
    <div>
      <CatalogueToolbar setIsEditing={setIsEditing} />
      <div className="row">
        <ToggleInput boolean={isEditing}>
          <input value={catalogue.title} disabled />
          <div>{catalogue.title}</div>
        </ToggleInput>
        <div>views: {catalogue.views}</div>
      </div>
    </div>
  );

  // console.warn("error", error);
  // return <div> Uh oh something went wrong</div>;
};

export default Catalogue;
