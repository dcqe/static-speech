import React from "react";
import Theme from "./theme";
import CocktailBrowser from "./components/CocktailBrowser";
import CocktailPage from "./components/CocktailPage";
import Bar from "./components/Bar";
import Settings from "./components/Settings";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Topbar from "./components/Topbar";

function App() {
  return (
    <Theme>
      <Router>
        <Topbar />
        {
          // Routes
        }
        <Route exact path={["/~ge47qut/cocktail/", "/~ge47qut/cocktail/cocktails"]} component={CocktailBrowser} />
        <Route path={"/~ge47qut/cocktail/cocktails/:slug"} component={CocktailPage} />
        <Route path="/~ge47qut/cocktail/my-bar" component={Bar} />
        <Route path="/~ge47qut/cocktail/settings" component={Settings} />
      </Router>
    </Theme>
  );
}

export default App;