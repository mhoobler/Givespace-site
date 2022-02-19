import React from "react";

import "./ListingCardsContainer.less";

type Props = {};

const ListingCardsContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="listing-cards-container-wrapper">
      <div className="listing-cards-container">{children}</div>
    </div>
  );
};

export default ListingCardsContainer;
