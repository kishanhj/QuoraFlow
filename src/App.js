import React from 'react';
import './App.css';
import Form from "./components/Form";
import {BrowserRouter as Router , Route ,Link} from 'react-router-dom';
import Question from "./components/questiondisplay";
import EditQuestion from "./components/editQuestion";
import DeleteQuestion from "./components/deleteQuestion";
import PagenotFound from "./components/pageNotFound";

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
          <h1>Add question</h1>
          <Link className="showlink" to="/questions">Add question</Link>
      </header>
      <div className="App-body">
          
          <Route exact path="/questions" exact component={Form}/>
          <Route exact path="/questions/display/:id" exact component={Question} />
          <Route exact path="/questions/edit/:id" exact component={EditQuestion} />
          <Route exact path="/questions/delete/:id" exact component={DeleteQuestion} />
          <Route  exact path="/notfound" component={PagenotFound} status={404} />

        </div>
    </div>
    </Router>
  );
}

export default App;
