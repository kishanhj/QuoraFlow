import React from 'react';
import './App.css';
import Form from "./components/Form";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Question from "./components/questiondisplay";
import EditQuestion from "./components/editQuestion";
import DeleteQuestion from "./components/deleteQuestion";
import PagenotFound from "./components/pageNotFound";
import DashBoard from "./components/Dashboard";
import Search from "./components/Search";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import TagPage from "./components/TagPage";
import { AuthProvider } from "./firebase/Auth"
import PrivateRoute from "./components/PrivateRoute"
import UserName from "./components/UserName"
import Questiondeleted from "./components/QuestionDeleted"

import LandingPage from './components/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* <header className="App-header">
          <h1>Add question</h1>
          <Link className="showlink" to="/questions">Add question</Link>
      </header>
      <CommentList comments={comments} />  */}
          <DashBoard></DashBoard>
          <div className="App-body">
            {/* <Route exact path="/home" exact component={DashBoard}/> */}
            <PrivateRoute exact path="/" component={LandingPage} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <PrivateRoute exact path="/questions" exact component={Form} />
            <PrivateRoute exact path="/questions/display/:id" exact component={Question} />
            <PrivateRoute exact path="/questions/edit/:id" exact component={EditQuestion} />
            <PrivateRoute exact path="/questions/delete/:id" exact component={DeleteQuestion} />
            <Route exact path="/notfound" component={PagenotFound} status={404} />
            <PrivateRoute exact path="/search" component={Search} />
            <Route exact path="/username" component={UserName} />
            <PrivateRoute exact path="/tag/:id" component={TagPage} />
            {/* <CommentList comments={comments} /> */}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
