import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./components/Home";
import Post from "./components/Posts";
import Series from "./components/Series";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/series/:slug" component={Series} />
        <Route path="/posts/:slug" component={Post} />
      </Switch>
    </Router>
  );
}

export default App;
