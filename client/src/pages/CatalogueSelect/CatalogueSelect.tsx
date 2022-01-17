import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";

const CatalogueRow: React.FC<CatalogueListItem> = ({
  id,
  //user_id,
  title,
  //created,
  //updated,
}) => {
  return (
    <div className="row">
      <div className="col-8">{title}</div>
      <div className="col-4">
        <Link className="btn btn-primary" to={`/list/${id}`}>
          Go
        </Link>
        <button className="btn btn-danger">Del</button>
      </div>
    </div>
  );
};

const CreateCatalogue = (): React.ReactElement => {
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);

  const navigate = useNavigate();
  console.log("data", data);
  if (!loading && data) {
    navigate("/" + data.createCatalogue.id);
  }

  const handleClick = async () => {
    createCatalogue();
  };

  return (
    <div className="row">
      <div className="col-2">
        <button onClick={handleClick} className="btn btn-success">
          Create New
        </button>
      </div>
    </div>
  );
};

const CatalogueSelect = () => {
  //@ts-ignore

  const { user_id } = useParams();

  // Some kind of Query;
  const results = useQuery(MY_CATALOGUES);
  console.log("results.data", results.data);
  if (results.loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <Link className="btn btn-primary" to={`/`}>
            Go Back
          </Link>
        </div>
      </div>
      {results.data.myCatalogues.map((e: CatalogueListItem) => (
        <CatalogueRow key={e.id} {...e} />
      ))}
      <CreateCatalogue />
    </div>
  );
};

export default CatalogueSelect;
