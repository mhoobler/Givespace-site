import React from "react";
import { Link, useParams } from "react-router-dom";

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
  const results: CatalogueList = [
    {
      id: "id1",
      user_id: "id",
      title: "title1",
      created: new Date().toString(),
      updated: new Date().toString(),
    },
    {
      id: "id2",
      user_id: "id",
      title: "title2",
      created: new Date().toString(),
      updated: new Date().toString(),
    },
  ];

  return (
    <div>
      <div className="row">
        <div className="col-2">
          <Link className="btn btn-primary" to={`/`}>
            Go Back
          </Link>
        </div>
      </div>
      {results.map((e: CatalogueListItem) => (
        <CatalogueRow key={e.id} {...e} />
      ))}
    </div>
  );
};

export default CatalogueSelect;
