import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Share2, Trash2 } from "../../assets";
import { IconButton } from "../../components";
import { cache } from "../../graphql/clientConfig";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

import "./CatalogueCards.less";

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

  const handleCreate = async () => {
    createCatalogue();
  };

  const handleDelete = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    console.log("delete", evt);
  };

  const handleShare = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    console.log("share", evt);
  };
  return (
    <div className="f-row catalogue-cards-container">
      {catalogues.map((catalogue: CatalogueStub) => (
        <Link className="catalogue-card-wrapper" to={`/ctg/${catalogue.id}`}>
          <div className="card f-col">
            {/*TODO: need to somehow maintain aspect ratio of 6:1*/}
            <div
              className="card-header"
              style={{
                backgroundColor: !catalogue.profile_picture_url
                  ? catalogue.header_color
                  : "",
              }}
            >
              <img src={catalogue.header_image_url || "#"} />
            </div>
            <div className="f-col card-body">
              <div className="f-row avatar-title-author">
                <div className="avatar-image-wrapper">
                  <img src={catalogue.profile_picture_url || ""} />
                </div>
                <div className="f-col title-author">
                  <p>{catalogue.author}</p>
                  <h5>{catalogue.title}</h5>
                </div>
              </div>
              <div className="description-row">
                <p>{catalogue.description}</p>
              </div>
              <div className="f-row images-row">
                {catalogue.listings &&
                  catalogue.listings.slice(0, 3).map((e: ListingStub) => (
                    <div key={e.id}>
                      <img src={"https://via.placeholder.com/800"} alt="" />
                    </div>
                  ))}
              </div>
              <div className="f-row options-row">
                <button className="btn f-row option" onClick={handleDelete}>
                  <div>
                    <img src={Trash2} alt="delete" />
                  </div>
                  <div className="fs-1"> Delete</div>
                </button>
                <button className="btn f-row option" onClick={handleShare}>
                  <div>
                    <img src={Share2} alt="share" />
                  </div>
                  <div className="fs-1">Share</div>
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <div className="catalogue-card-wrapper">
        <div className="card f-col add-catalogue">
          <div className="f-col card-body">
            <div className="fs-1-625">Add List</div>
            <IconButton
              className="btn-primary"
              src={Plus}
              onClick={handleCreate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCards;
