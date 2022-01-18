import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  CREATE_CATALOGUE,
  DELTETE_CATALOGUE,
  MY_CATALOGUES,
} from "../../graphql/schemas";

const CatalogueRow: React.FC<CatalogueStub> = ({
  id,
  //user_id,
  title,
  //created,
  //updated,
}) => {
  //@ts-ignore
  //TODO: Do something with this data
  const [deleteCatalogue, { data, loading, error }] = useMutation(
    DELTETE_CATALOGUE,
    { variables: { id } },
  );

  const handleDelete = () => {
    deleteCatalogue();
  };

  return (
    <div className="row">
      <div className="col-8">{title}</div>
      <div className="col-4">
        <Link className="btn btn-primary" to={`/list/${id}`}>
          Go
        </Link>
        <button className="btn btn-danger" onClick={handleDelete}>
          Del
        </button>
      </div>
    </div>
  );
};

const CreateCatalogue = (): React.ReactElement => {
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && data) {
      console.log("data", data);
      navigate("/list/" + data.createCatalogue.id);
    }

    if (!loading && error) {
      console.warn("error", error);
    }
  }, [loading, data, error]);

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
