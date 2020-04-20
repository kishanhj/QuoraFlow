import React from 'react';
import { CommentList } from './components/Comment'
import './App.css';
import Form from "./components/Form";
import {BrowserRouter as Router , Route ,Link} from 'react-router-dom';
import Question from "./components/questiondisplay";
import EditQuestion from "./components/editQuestion";
import DeleteQuestion from "./components/deleteQuestion";

const comments = [{
  "id": 1,
  "user": "cdandrea0",
  "time": "9/11/2019",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue est ut nisl feugiat pretium. Suspendisse faucibus magna id nisl placerat, id aliquam lectus eleifend. Nullam quis mattis quam. Duis eu venenatis nisi, eu pulvinar ex. Cras egestas ac libero vitae facilisis. Suspendisse potenti. Sed rhoncus ut lectus sed iaculis.",
  "points": 89,
  "comments": [{
    "id": 1,
    "user": "ncornely0",
    "time": "6/23/2019",
    "content": "Mauris pretium laoreet maximus. Ut quis aliquet justo, pulvinar hendrerit diam. Proin auctor at sapien et pulvinar. Praesent a felis quam. Suspendisse hendrerit, leo sit amet efficitur malesuada, mauris ligula suscipit dolor, placerat lacinia leo ligula a risus.",
    "points": 60
  }, {
    "id": 2,
    "user": "aernshaw1",
    "time": "5/2/2019",
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at.",
    "points": 32,
    "comments": [{
      "id": 1,
      "user": "rgrist0",
      "time": "12/2/2019",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "points": 95
    }, {
      "id": 2,
      "user": "cstemp1",
      "time": "11/5/2019",
      "content": "Send money   1EuCpkkEYnHERtjooorbXbmgc1EnNXQNuo",
      "points": 126
    }]
  }, {
    "id": 3,
    "user": "fbresnahan2",
    "time": "6/4/2019",
    "content": "Nullam sed quam quam. Mauris sodales lobortis massa vel pellentesque. Proin enim urna, efficitur sed odio nec, fringilla tempus arcu. Phasellus id velit dui. Suspendisse potenti. Pellentesque sed euismod lectus. Maecenas vel pharetra magna, tempor pharetra est.",
    "points": 145
  }]
}, {
  "id": 2,
  "user": "cbiford1",
  "time": "10/20/2019",
  "content": "Cras gravida risus eu faucibus lacinia. In mattis tellus ac viverra tristique. Morbi gravida neque ac bibendum gravida. Nulla sit amet hendrerit nisl. Nunc ipsum felis, blandit id neque vel, sollicitudin lobortis est. Morbi eu sem est. Nam placerat molestie massa, tempus commodo justo porttitor a. Quisque pretium dapibus placerat.",
  "points": 146
}, {
  "id": 3,
  "user": "bcamamile2",
  "time": "6/26/2019",
  "content": "In hac habitasse platea dictumst. Nulla dolor purus, fringilla eu pretium sit amet, facilisis ut mauris. Proin scelerisque ac velit ac malesuada. Integer sed neque ut turpis pulvinar efficitur. Pellentesque hendrerit, velit in gravida vestibulum, nibh enim hendrerit nunc, eu efficitur nunc urna nec erat. Suspendisse potenti. Aliquam et gravida nibh, nec eleifend lacus. Duis quis faucibus sem, scelerisque facilisis lectus.",
  "points": 133
}];

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
          <h1>Add question</h1>
          <Link className="showlink" to="/questions">Add question</Link>
      </header>
      <CommentList comments={comments} />
      <div className="App-body">
          <CommentList comments={comments} />
          <Route exact path="/questions" exact component={Form}/>
          <Route exact path="/questions/display/:id" exact component={Question} />
          <Route exact path="/questions/edit/:id" exact component={EditQuestion} />
          <Route exact path="/questions/delete/:id" exact component={DeleteQuestion} />

        </div>
    </div>
    </Router>
  );
}

export default App;
