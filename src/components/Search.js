import React,{useState, useEffect} from "react";
import queryString from 'query-string'
import SearchCard from "./SearchCard";
import "../public/css/Search.css";
import Axios from "axios"; 

const makeid = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 8; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const Search = (props) => {

    const [query,setQuery] = useState("");
    const [results,setResults] = useState(undefined);

    useEffect(() => {
    const fetchResults = async () => {
        if(props.location && props.location.search){
            const newValues = queryString.parse(props.location.search)
            setQuery(newValues.q);
            const {data} = await Axios.get(`http://localhost:8080/search/?q=${newValues.q}`);
            setResults(data);
        }
    }
    fetchResults();
    },[props.location.search]);

    if(!results){
		return ( <div className='loader'></div>)
    }

    return (
    <div id="search-body" className="search-body">
            <div className="resultTitle" >Results for : <span className='title'>{query}</span> </div>
            {results && results.map((q) => <SearchCard data={q} key={makeid()}/>)}
    </div>
    );
}


export default Search;