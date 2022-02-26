import React from "react";
import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { CreateCatalogueButton, DeleteCatalogueButton } from "../../components";
import { MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

import "./CatalogueSelect.less";

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
        <Link className="btn btn-primary" to={`/ctg/${id}`}>
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
  console.log(results);

  if (results.loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="page-wrapper catalogue-select-wrapper">
      <div className="page-container catalogue-select-container">
        <div className="title-row">
          <h2>My Lists</h2>
          <p>All lists saved on this device</p>
        </div>
        <div className="catalogues-container">
          {results.data &&
            results.data.myCatalogues.map((e: CatalogueStub) => (
              <CatalogueRow key={e.id} {...e} />
            ))}
        </div>
        <CreateCatalogueButton />
      </div>
    </div>
  );
};

export default CatalogueSelect;
