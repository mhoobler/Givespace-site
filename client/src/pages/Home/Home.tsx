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
          <Link className="btn btn-primary" to={`/lists`}>
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
    <div className="container-fluid">
      <div className="row nav-like"></div>
      <section className="welcome row">
        <div className="col">
          <h3>Welcome to GiveSpace</h3>
          <p>
            Some type of slogan or hook will be written here. Your lists made
            easy, or something
          </p>
          <ButtonToShow />
        </div>
      </section>

      <section className="description row">
        <div className="d-flex flex-column justify-content-center">
          <div className="row p-5 justify-content-around">
            <div className="col-md-4 col-sm-12 d-flex flex-column align-items-center">
              <div className="box"></div>
              <p>Help</p>
            </div>
            <div className="col-md-4 col-sm-12 d-flex flex-column align-items-center">
              <div className="box"></div>
              <p>Help</p>
            </div>
            <div className="col-md-4 col-sm-12 d-flex flex-column align-items-center">
              <div className="box"></div>
              <p>Help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
