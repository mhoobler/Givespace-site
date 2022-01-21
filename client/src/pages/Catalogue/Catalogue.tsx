import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  GET_CATALOGUE,
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
} from "../../graphql/schemas";
import { ToggleEdit } from "../../components";
import {
  apolloHookErrorHandler,
  updateCatalogueCache,
} from "../../utils/functions";

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

const Catalogue: React.FC<{ is_edit_id?: boolean }> = ({ is_edit_id }) => {
  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const CatalogueIdVariables = is_edit_id
    ? { edit_id: corresponding_id }
    : { id: corresponding_id };

  const [incrementCatalogueViews, { error }] = useMutation(
    INCREMENT_CATALOGUE_VIEWS,
    { variables: CatalogueIdVariables }
  );
  apolloHookErrorHandler("Catalogue.tsx", error);
  useEffect(() => {
    incrementCatalogueViews();
  }, []);

  const catalogueSubscription = useSubscription(LIVE_CATALOGUE, {
    variables: CatalogueIdVariables,
  });
  apolloHookErrorHandler("Catalogue.tsx", catalogueSubscription.error);
  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: CatalogueIdVariables,
  });
  apolloHookErrorHandler("Catalogue.tsx", catalogueQuery.error);
  console.log("catalogueQuery.data", catalogueQuery.data);

  if (!catalogueQuery.data && !catalogueSubscription.data) {
    return <div>Loading...</div>;
  }

  // This needs to update cache
  const catalogue = catalogueSubscription.data
    ? catalogueSubscription.data.liveCatalogue
    : catalogueQuery.data.catalogues[0];
  console.log("catalogue", catalogue);

  if (!catalogue) {
    return <h1>Catalogue not found</h1>;
  }

  let editable = is_edit_id || current_user_id === catalogue.user_id;
  console.log("editable", editable);

  const handleTextInput = (text: string) => {
    console.log("handleTextInput", text);
    updateCatalogueCache(`Catalogue:${catalogue.id}`, "title", text);
  };

  const handleFileInput = () => {};

  return (
    <div>
      {editable && <CatalogueToolbar setIsEditing={setIsEditing} />}
      {/* <div className="row">
        <ToggleEdit isEditing={isEditing}>
          <div className="toggle-input">
            <input type="file" onChange={handleFileInput} disabled />
            <div>display faded image behind file input</div>
          </div>
          <div className="toggle-display">display regular image</div>
        </ToggleEdit>
      </div> */}
      <div className="row">
        <ToggleEdit isEditing={isEditing}>
          <input
            className="toggle-input"
            type="text"
            onChange={(e) => handleTextInput(e.target.value)}
            value={catalogue.title}
          />
          <div className="toggle-display">{catalogue.title}</div>
        </ToggleEdit>
        <div>views: {catalogue.views}</div>
      </div>
    </div>
  );

  // console.warn("error", error);
  // return <div> Uh oh something went wrong</div>;
};

export default Catalogue;
