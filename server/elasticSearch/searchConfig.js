const Base64 = require("base-64");
require("dotenv").config();

const buildAWSBasicAuthenticationHash = () => {
    const tok = `${process.env.AWS_ELASTIC_USERNAME}:${process.env.AWS_ELASTIC_PASSWORD}`;
    const hash = Base64.encode(tok);
    return 'Basic ' + hash;
}

module.exports = { 
    useAws : true,
    baseUrl : "http://localhost:9200",
    awsDomain : "search-quora-flow-apdxw3rdvykxp7qthvnhxo2qk4.us-east-1.es.amazonaws.com",
    questionIndex : "quora-flow-question",
    tagIndex : "quora-flow-tag",
    questionType : "question",
    tagType : "tag",
    search : "_search",
    slash : "/",
    buildAWSBasicAuthenticationHash,
    aws_username : process.env.AWS_ELASTIC_USERNAME,
    aws_password : process.env.AWS_ELASTIC_PASSWORD
}