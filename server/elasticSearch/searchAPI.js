const axios = require('axios');
const sConfig = require("./searchConfig");
const AWS = require("aws-sdk");

const addQuestion = async (questionDB) => {

    const question = {
        "id": questionDB._id,
        "title": questionDB.title,
        "description": questionDB.description
    }

    var url = "", res = {};

    if (sConfig.useAws) {
        var test = await addQuestionAWS(question);
        console.log(test);
        return;
    }

    url = sConfig.baseUrl + sConfig.slash + sConfig.questionIndex + sConfig.slash + sConfig.questionType;
    res = await axios.post(url, question);
}

const addQuestionAWS = async (question) => {

    var region = 'us-east-1';
    var endpoint = new AWS.Endpoint(sConfig.awsDomain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'POST';
    request.path += sConfig.questionIndex + '/' + sConfig.questionType;
    console.log(request.path);
    request.body = JSON.stringify(question);
    request.headers['host'] = sConfig.awsDomain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Authorization'] = sConfig.buildAWSBasicAuthenticationHash();

    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
            console.log(response.statusCode + ' ' + response.statusMessage);
            var responseBody = '';
            response.on('data', function (chunk) {
                responseBody += chunk;
            });
            response.on('end', function (chunk) {
                console.log('Response body: ' + responseBody);
            });
    }, function (error) {
        console.log('Error: ' + error);
    });

}

const doNormalSearchAWS = async (query,successCallback,errorCallback) => {

    var region = 'us-east-1';
    var endpoint = new AWS.Endpoint(sConfig.awsDomain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'POST';
    request.path += sConfig.search;
    request.body = JSON.stringify(query);
    request.headers['host'] = sConfig.awsDomain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Authorization'] = sConfig.buildAWSBasicAuthenticationHash();

    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
        var responseBody = '';
        response.on('data', function (chunk) {
            responseBody += chunk;
        });
        response.on('end', function (chunk) {
            successCallback(JSON.parse(responseBody));
        });
    }, function (error) {
        errorCallback(error);
    });

}

const doNormalSearchAWSWrap = (searchQuery) => {
    return new Promise((resolve,reject) => {
        doNormalSearchAWS(searchQuery,(sucessRes) => resolve(sucessRes)
        ,(errorRes) => reject(errorRes))
    });
}

const doNormalSearch = async (query) => {
    const searchQuery = {
        "query": {
            "bool": {
                "should": [
                    { "term": { "title": query } },
                    { "term": { "description": query } },
                    {
                        "multi_match": {
                            "query": query,
                            "type": "cross_fields",
                            "operator": "and",
                            "fields": [
                                "title",
                                "description"
                            ]
                        }
                    }
                ]
            }
        },
        "highlight": {
            "pre_tags": ["<span class=\"matched_word\">"],
            "post_tags": ["</span>"],
            "fields": {
                "title": {},
                "description": {}
            }
        }
    }

    if (sConfig.useAws){
        const res =  await doNormalSearchAWSWrap(searchQuery);
        return res.hits.hits;
    }

    const url = sConfig.baseUrl + sConfig.slash + sConfig.search;
    const { data } = await axios.post(url, searchQuery);
    return data.hits.hits;

}



module.exports = {
    addQuestion, doNormalSearch
}