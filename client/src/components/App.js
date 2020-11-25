// Suspense for data fetching is an experimental feature
// Suspense component lets you "wait" for some code to load and declaratively 
// secify a loading state (like a spinner) while we're waiting
import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";

// Bring in pages for this application
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import MovieDetailPage from "./views/MovieDetailPage/MovieDetailPage";
import FavoriteMovies from "./views/FavoriteMovies/FavoriteMovies";

/*
 * null - anyone can access page
 * true - only logged in users can access
 * false - logged in users cannot access
*/

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/movie/:movieId" component={Auth(MovieDetailPage, null)} />
          <Route exact path="/favorite" component={Auth(FavoriteMovies, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
