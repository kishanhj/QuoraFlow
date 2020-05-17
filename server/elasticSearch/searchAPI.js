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
        var created = await crudAWSWrap(addQuestionAWS,question);
        if(created) {
            console.log("Index created");
            const questionDataApi = require("../data/question");
            questionDataApi.resetQuestionSync(questionDB._id.toString());
        };
        return created;
    }

    url = sConfig.baseUrl + sConfig.slash + sConfig.questionIndex + sConfig.slash + sConfig.questionType;
    res = await axios.post(url, question);
}

const addTag = async (tagID,tagTitle) => {

    const tag = {
        "id": tagID,
        "title": tagTitle
    }

    var url = "", res = {};

    if (sConfig.useAws) {
        var created = await crudAWSWrap(addTagAWS,tag);
        if(created) {
            console.log("Tag Index created");
            const tagDataApi = require("../data/tags");
            tagDataApi.resetTagSync(tagID.toString());
        }
        return created;
    }

    url = sConfig.baseUrl + sConfig.slash + sConfig.tagIndex + sConfig.slash + sConfig.tagType;
    res = await axios.post(url, tag);
}

const updateQuestion = async (questionDB) => {

    const question = {
        "id": questionDB._id,
        "title": questionDB.title,
        "description": questionDB.description
    }

    var url = "", res = {};

    if (sConfig.useAws) {
        var updated = await crudAWSWrap(updateQuestionAWS,question);
        if(updated) { 
            console.log("Index updated");
            const questionDataApi = require("../data/question");
            questionDataApi.resetQuestionSync(question._id.toString());
        }
        return updated;
    }

    url = sConfig.baseUrl + sConfig.slash + sConfig.questionIndex + sConfig.slash + sConfig.questionType;
    res = await axios.post(url, question);
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

    syncData();
    if (sConfig.useAws){
        const res =  await searchAWSWrap(searchQuery);
        return res.hits.hits;
    }

    const url = sConfig.baseUrl + sConfig.slash + sConfig.search;
    const { data } = await axios.post(url, searchQuery);
    return data.hits.hits;

}

const crudAWSWrap = (crudOperation,searchQuery) => {
    return new Promise((resolve,reject) => {
        crudOperation(searchQuery,(sucessRes) => resolve(sucessRes)
        ,(errorRes) => reject(errorRes))
    });
}

const searchAWSWrap = (searchQuery) => {
    return new Promise((resolve,reject) => {
        doNormalSearchAWS(searchQuery,(sucessRes) => resolve(sucessRes)
        ,(errorRes) => reject(errorRes))
    });
}

const addQuestionAWS = async (question,successCallback,errorCallback) => {

    var region = 'us-east-1';
    var endpoint = new AWS.Endpoint(sConfig.awsDomain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'POST';
    request.path += sConfig.questionIndex + '/' + sConfig.questionType + '/' + question.id;
    request.body = JSON.stringify(question);
    request.headers['host'] = sConfig.awsDomain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Authorization'] = sConfig.buildAWSBasicAuthenticationHash();

    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
            successCallback('201' == response.statusCode);
    }, function (error) {
        console.log(error);
        errorCallback(false);
    });

}

const addTagAWS = async (tag,successCallback,errorCallback) => {

    var region = 'us-east-1';
    var endpoint = new AWS.Endpoint(sConfig.awsDomain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'POST';
    request.path += sConfig.tagIndex + '/' + sConfig.tagType + '/' + tag.id;
    request.body = JSON.stringify(tag);
    request.headers['host'] = sConfig.awsDomain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Authorization'] = sConfig.buildAWSBasicAuthenticationHash();

    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
            successCallback('201' == response.statusCode);
    }, function (error) {
        console.log(error);
        errorCallback(false);
    });

}

const updateQuestionAWS = async (question,successCallback,errorCallback) => {

    var region = 'us-east-1';
    var endpoint = new AWS.Endpoint(sConfig.awsDomain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'PUT';
    request.path += sConfig.questionIndex + '/' + sConfig.questionType + '/' + question.id;
    console.log(request.path);
    request.body = JSON.stringify(question);
    request.headers['host'] = sConfig.awsDomain;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Authorization'] = sConfig.buildAWSBasicAuthenticationHash();

    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function (response) {
            successCallback('200' == response.statusCode);
    }, function (error) {
        console.log(error);
        errorCallback(false);
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

const syncData = async () => {
    questionSync();
    tagSync();
}

const questionSync = async () => {
    const questionDataApi = require("../data/question");
    const questions = await questionDataApi.getAllAsyncQuetions();
    for(var question of questions){
        console.log("syncing question : ",question.title);
        switch(question.sync){
            case 1 : if(addQuestion(question)){
                        console.log("syncing added question : ",question.title);
                    }       
                     break;
            case 2 : if(updateQuestion(question)){
                        console.log("syncing updated question : ",question.title);
                    }
                     break;
        }
    }
}

const tagSync = async () => {
    const tagDataApi = require("../data/tags");
    const tags = await tagDataApi.getAllAsyncTags();
    for(var tag of tags){
        console.log("syncing tag : ",tag.tag);
        if(addTag(tag._id.toString(),tag.tag)){
            console.log("syncing success tag : ",tag.tag);
        }
        
    }
}


module.exports = {
    addQuestion, doNormalSearch,updateQuestion,addTag,syncData
}