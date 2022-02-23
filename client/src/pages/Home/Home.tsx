import React from "react";
import { Link } from "react-router-dom";
import { CreateCatalogueButton } from "../../components";
import { client } from "../../graphql/clientConfig";
import { MY_CATALOGUES } from "../../graphql/schemas";

import "./Home.less";

const Home = () => {
  // need some way to get user id here
  const cachedData = client.readQuery({
    query: MY_CATALOGUES,
  });
  console.log("cachedData", cachedData);

  const ButtonToShow = () => {
    switch (true) {
      case cachedData === null:
        return (
          <div className="btn btn-primary" style={{ opacity: 0 }}>
            Invisible
          </div>
        );
      case cachedData.myCatalogues.length > 0:
        return (
          <Link className="btn btn-secondary-outline" to={`/catalogues`}>
            Go to Lists
          </Link>
        );
      case cachedData.myCatalogues.length === 0:
        return <CreateCatalogueButton />;
      default:
        return (
          <div className="btn btn-primary" style={{ opacity: 0 }}>
            Invisible
          </div>
        );
    }
  };

  return (
    <div className="home-page-container">
      <section className="welcome-section">
        <div className="text-container">
          <h3 className="title">Welcome to GiveSpace</h3>
          <p>
            Some type of slogan or hook will be written here. Your lists made
            easy, or something
          </p>
          <div className="f-row">
            <div className="btn-wrapper">
              <ButtonToShow />
            </div>
            <div className="btn-wrapper">
              <ButtonToShow />
            </div>
          </div>
        </div>
        <div className="image-container">
          <img src="#" alt="IMAGE" />
        </div>
      </section>

      <section className="description-section"></section>
    </div>
  );
};

export default Home;
