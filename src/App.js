import React from 'react';
import './App.css';
import Form from "./components/Form";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Question from "./components/questiondisplay";
import EditQuestion from "./components/editQuestion";
import DeleteQuestion from "./components/deleteQuestion";
import PagenotFound from "./components/pageNotFound";
import DashBoard from "./components/dashboard";
import Search from "./components/Search";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { AuthProvider } from "./firebase/Auth"
import PrivateRoute from "./components/PrivateRoute"

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
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/questions" exact component={Form} />
            <Route exact path="/questions/display/:id" exact component={Question} />
            <Route exact path="/questions/edit/:id" exact component={EditQuestion} />
            <Route exact path="/questions/delete/:id" exact component={DeleteQuestion} />
            <Route exact path="/notfound" component={PagenotFound} status={404} />
            <Route exact path="/search" component={Search} />
            {/* <CommentList comments={comments} /> */}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
