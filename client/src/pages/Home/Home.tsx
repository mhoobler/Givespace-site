import React from "react";
import { Link } from "react-router-dom";
import { CreateCatalogueButton } from "../../components";
import { client } from "../../graphql/clientConfig";
import { MY_CATALOGUES } from "../../graphql/schemas";

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
    <div className="App">
      <header className="App-header">
        <p>Home</p>
        <ButtonToShow />
      </header>
    </div>
  );
};

export default Home;
