import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "../../assets";
import { IconButton } from "../../components";
import CatalogueCard from "../../components/CatalogueCard/CatalogueCard";
import { cache } from "../../graphql/clientConfig";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

import "./CatalogueSelectItems.less";

type Props = {
  catalogues: CatalogueStub[];
};

const CatalogueCards: React.FC<Props> = ({ catalogues }) => {
  // TODO: Replace this with something like useUserApolloHooks
  //@ts-ignore
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);
  apolloHookErrorHandler("CreateCatalogueButton.tsx", error);

  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && data) {
      cache.updateQuery({ query: MY_CATALOGUES }, (prev) => {
        return {
          myCatalogues: [...prev.myCatalogues, data.createCatalogue],
        };
      });
      navigate("/ctg/" + data.createCatalogue.id);
    }
  }, [loading, data]);

  return (
    <div className="f-row catalogue-cards-container">
      {catalogues.map((catalogue: CatalogueStub) => (
        <Link className="catalogue-card-wrapper" to={`/ctg/${catalogue.id}`}>
          <CatalogueCard catalogue={catalogue} />
        </Link>
      ))}
      <div className="catalogue-card-wrapper">
        <div className="card f-col catalogue-card add-catalogue">
          <div className="f-col card-body">
            <div className="fs-1-625">Add List</div>
            <IconButton
              className="btn-primary"
              src={Plus}
              onClick={createCatalogue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCards;
