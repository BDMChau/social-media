import React, { createContext, useReducer, Suspense, lazy } from 'react';
import './App.css';
import { reducer, initialState } from './reducer/userReducer'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Profile from './components/display/user/profile';
import UserProfile from './components/display/user/userProfile';
import Home from './components/display/post/home';
import Followposts from './components/display/post/followposts';
import CreatePost from './components/display/post/createpost';
import ResetPass from './components/display/auth/resetpass';
import SendEmail from './components/display/auth/sendmail';
import Login from './components/display/auth/login';
import SignUp from './components/display/auth/signup';
import Loading from './components/loading/point/pointloading';
const NavBar = lazy(() => import('./components/navBar/navBar'));
////////

export const UserContext = createContext();

const Routing = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>

      <Route path="/followposts" >
        <Followposts />
      </Route>

      <Route path="/profile" exact >
        <Profile />
      </Route>

      <Route path="/profile/:userId" >
        <UserProfile />
      </Route>

      <Route path="/createpost">
        <CreatePost />
      </Route>

      <Route path="/signup" >
        <SignUp />
      </Route >

      <Route path="/login" >
        <Login />
      </Route>

      <Route path="/requestemail" >
        <SendEmail />
      </Route>

      <Route path="/resetpass/:tokenReset" >
        <ResetPass />
      </Route>

    </Switch>
  )
}

//////
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Suspense fallback={<Loading />} >
          <NavBar />
        </Suspense>

        <Suspense fallback={<Loading />} >
          <Routing />
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;