import React from "react";
import ReactDOM from "react-dom";
import App from "../App";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/clientConfig";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import "../index.css";

ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root"),
);