import React from "react";

//import "./ListingCardsContainer.less";

type Props = {};

const ListingCardsContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="col-12">
      <div className="d-flex flex-wrap">{children}</div>
    </div>
  );
};

export default ListingCardsContainer;
