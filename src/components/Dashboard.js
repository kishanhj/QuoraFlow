import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Navbar, FormControl, Form, Nav } from 'react-bootstrap';
import queryString from 'query-string'
import SignOut from "./SignOut"


const Dashboard = (props) => {

    const [searchQuery, setSearchQuery] = useState("");
    const search = (query) => {
        setSearchQuery(query);
    }

    const getQueryFromParams = () => {
        // return "test";
        if (props.location && props.location.search) {
            const values = queryString.parse(props.location.search);
            return values.q;
        }
        return "";
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
                    <Nav.Link href="/">Answer</Nav.Link>
                    <Nav.Link href="/">Notifications</Nav.Link>
                    <Nav.Link href="/questions">Add Question</Nav.Link>


                </Nav>
                <Form inline>
                    <FormControl id="search" type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-info" onClick={() => search(document.getElementById("search").value)}>Search</Button>
                    <SignOut />
                </Form>
            </Navbar>
            <br />
            {searchRedirect()}
        </div>
    );
}

export default Dashboard;
