import React, { useState,useContext } from 'react';
import { Redirect,useHistory } from 'react-router-dom';
import { Button, Navbar, FormControl, Form, Nav } from 'react-bootstrap';
import queryString from 'query-string'
import SignOut from "./SignOut"
import { AuthContext } from '../firebase/Auth'


const Dashboard = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const history = useHistory();
    const search = (query) => {
        setSearchQuery(query);
    }

    const searchRedirect = () => {
        if (searchQuery)
            return (<Redirect to={{ pathname: '/search', search: `?q=${searchQuery}` }}></Redirect>);
    }

    return (
        <div>
            {/* <img alt='img'></img> */}
            {/* <button>Home</button>
            <button>Answer</button>
            <button>Notifications</button>
            <input id= "search" type='text' placeholder="Enter text here" ></input>
            <button onClick={() => search(document.getElementById("search").value)}>Search</button>
            <button><Link className="showlink" to="/questions">Add question</Link></button> */}

            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">QuoraFlow</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/answer">Answer</Nav.Link>
                    <Nav.Link href="/">Notifications</Nav.Link>
                    <Nav.Link href="/questions">Add Question</Nav.Link>


                </Nav>
                <Form inline>
                    <Form.Label htmlFor="search"><span className="searchKey">Search  By Keyword</span></Form.Label>
                    <FormControl id="search" type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-info" onClick={() => search(document.getElementById("search").value)}>Search</Button>
                    {currentUser?<SignOut />:<Button variant="outline-info" onClick={() => history.push('/signin')}>SignIn</Button>}
                </Form>
            </Navbar>
            <br />
            {searchRedirect()}
        </div>
    );
}

export default Dashboard;
