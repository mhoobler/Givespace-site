import React from "react";
import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { CreateCatalogueButton, DeleteCatalogueButton } from "../../components";
import { MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

const CatalogueRow: React.FC<CatalogueStub> = ({
  id,
  //user_id,
  title,
  //created,
  //updated,
}) => {
  //@ts-ignore
  //TODO: Do something with this data

  return (
    <div className="row">
      <div className="col-8">{title}</div>
      <div className="col-4">
        <Link className="btn btn-primary" to={`/list/${id}`}>
          Go
        </Link>
        <DeleteCatalogueButton id={id} />
      </div>
    </div>
  );
};

const CatalogueSelect = () => {
  //@ts-ignore
  const { user_id } = useParams();

  const results = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("CatalogueSelect.tsx", results.error);

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
        <CreateCatalogueButton />
      </div>
      {results.data &&
        results.data.myCatalogues.map((e: CatalogueStub) => (
          <CatalogueRow key={e.id} {...e} />
        ))}
    </div>
  );
};

export default CatalogueSelect;
