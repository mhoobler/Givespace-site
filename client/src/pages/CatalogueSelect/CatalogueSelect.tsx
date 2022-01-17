import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";

const CatalogueRow: React.FC<CatalogueStub> = ({
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
  if (!loading && data) {
    console.log("data", data);
    navigate("/" + data.createCatalogue.id);
  }

  if (!loading && error) {
    console.warn("error", error);
  }

  const handleClick = async () => {
    createCatalogue();
  };

  return (
    <div className="col-4">
      <button onClick={handleClick} className="btn btn-success">
        Create New
      </button>
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
    <div data-testid="test">
      <div className="row">
        <h2>Your Catalogues</h2>
      </div>
      <div className="row">
        <div className="col-2">
          <Link className="btn btn-primary" to={`/`}>
            Go Back
          </Link>
        </div>
        <CreateCatalogue />
      </div>
      {results.data &&
        results.data.myCatalogues.map((e: CatalogueStub) => (
          <CatalogueRow key={e.id} {...e} />
        ))}
    </div>
  );
};

export default CatalogueSelect;
