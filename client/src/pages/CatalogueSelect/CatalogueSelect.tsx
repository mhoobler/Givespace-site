import { useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import CreateCatalogueButton from "../../components/CreateCatalogueButton";
import { MY_CATALOGUES } from "../../graphql/schemas";
import { CatalogueListItem } from "../../types";

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
      <CreateCatalogueButton />
    </div>
  );
};

export default CatalogueSelect;
