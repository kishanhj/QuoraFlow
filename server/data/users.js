const mongocollection = require('../config/mongoCollections');
const ObjectID = require("mongodb").ObjectID
const users = mongocollection.Users

/**
 * Adds the user to the database
 * @param {Object of user to be added} usrObj 
 * @returns {Object of the newly added user}
 */
async function addUser(usrObj) {

    const userCollection = await users();

    let newObj = {
        userName: usrObj.name.toLowerCase(),
        email: usrObj.email,
        questions: [],
        comments: [],
        voted_comments: [],
        questions_followed: [],
        tags: [],
        questions_liked: [],
        isadmin: false
    }

    let status = await userCollection.insertOne(newObj);
    if (status.insertedCount > 0) {
        return await getUser(usrObj.email)
    }
    else {
        throw `Error: User was not added to the database`
    }
}

/**
 * Adds the give tag_id to the user based on the email provided
 * @param {email address of the user} email
 * @param {tag_id of the tag to be added to the given user} t_id
 * * @returns {updated user obj after adding the tag_id}
 */
async function addTag(email, t_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`
    const userCollection = await users();
    if (!t_id) throw "tag_id to be added is not provided"
    if (typeof t_id != 'string') throw `Error: tag_id should be of type string`

    let usr = await userCollection.updateOne({ "email": email }, { "$push": { "tags": t_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: tag_id was not added to the user with email ${email}`
    }



}


/**
 * Removes the given tag_id from the user based on the email provided
 * @param {email address of the user} email
 * @param {tag_id of the tag to be removed from the given user} t_id
 * * @returns {updated user obj after removing the tag_id}
 */
async function removeTag(email, t_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`
    const userCollection = await users();
    if (!t_id) throw "tag_id to be removed is not provided"
    if (typeof t_id != 'string') throw `Error: tag_id should be of type string`

    let usr = await userCollection.updateOne({ "email": email }, { "$pull": { "tags": t_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: tag_id was not removed from the user with email ${email}`
    }



}


/**
 * Adds the likedQuestion_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {likedQuestion_id of the liked question to be added to the given user} q_id
 * * @returns {updated user obj after adding the likedQuestion_id}
 */
async function addLikedQuestionId(email, q_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!q_id) throw "question_id to be added is not provided"
    if (typeof q_id != 'string') throw `Error: question_id should be of type string`


    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ "email": email }, { "$push": { "questions_liked": q_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id was not added to the user with email ${email}`
    }


}

/**
 * Removes the likedQuestion_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {likedQuestion_id of the liked question to be removed from the given user} q_id
 * * @returns {updated user obj after removing the likedQuestion_id}
 */
async function removeLikedQuestionId(email, q_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!q_id) throw "question_id to be removed is not provided"
    if (typeof q_id != 'string') throw `Error: question_id should be of type string`


    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ email: email }, { "$pull": { "questions_liked": q_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id not removed from the user with email ${email}`
    }

}




/**
 * To get user object from the database based on the email address provided 
 * @param {email address of the required user} email 
 * * @returns {user obj based on the email}
 */
async function getUser(email) {
    const userCollection = await users();
    if (!email) { throw `Error: Email is not provided for the user` }
    if (typeof email != 'string') { throw `Error: email should be of type string` }

    let usrToRtrn = await userCollection.findOne({ "email": email })
    if (!usrToRtrn) {
        throw `Error: No user found with email ${email}`
    }
    return usrToRtrn;

}

/**
 * To check if user exists based on the email address provided 
 * @param {email address of the required user} email 
 * * @returns {user obj based on the email}
 */
async function checkUser(email) {
    const userCollection = await users();
    if (!email) { throw `Error: Email is not provided for the user` }
    if (typeof email != 'string') { throw `Error: email should be of type string` }

    let usrToRtrn = await userCollection.findOne({ "email": email })
    if (!usrToRtrn) {
        return false
    }
    return true;

}

/**
 * To check if the provided userName is unique or not
 * @param {string to check if an user with the userName exists in the database} userName 
 * @returns boolean
 */
async function checkUserName(user_name) {
    if (!user_name) throw `Error: userName not provided`
    const userCollection = await users();
    let status = await userCollection.findOne({ userName: user_name });
    console.log(status)
    if (!status) {
        return true;
    }
    else {
        return false
    }

}



/**
 * To get all users in the database
 * * @returns {An array of all users in the database}
 */
async function getAllUsers() {
    const userCollection = await users();

    let allUsers = await userCollection.find({}).toArray();
    return allUsers;


}
/**
 * Adds the question_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {question_id of the question to be added to the given user} q_id 
 * * @returns {updated user obj after adding the question_id}
 */
async function addQuestionId(email, q_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!q_id) throw "question_id to be added is not provided"
    if (typeof q_id != 'string') throw `Error: q_id should be of type string`

    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`
    const userCollection = await users();

    let usr = await userCollection.updateOne({ "email": email }, { $addToSet: { "questions": q_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id was not added to the user with email ${email}`
    }


}
/**
 * Removes the question_id from the user based on the provided email
 * @param {email address of the user} email
 * @param {question_id of the question to be added to the given user} q_id
 * @returns {updated user obj after removing the question_id}
 */
async function removeQuestionId(email, q_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!q_id) throw "question_id to be removed is not provided"
    if (typeof q_id != 'string') throw `Error: q_id should be of type string`

    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();


    let usr = await userCollection.updateOne({ email: email }, { "$pull": { "questions": q_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id not removed from the user with email ${email}`
    }

}

/**
 * Adds the comment_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {comment_id of the comment to be added to the given user} c_id
 * * @returns {updated user obj after adding the comment_id}
 */
async function addCommentId(email, c_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!c_id) throw "comment_id to be added is not provided"
    if (typeof c_id != 'string') throw `Error: comment_id should be of type string`

    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ email: email }, { "$push": { "comments": c_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: comment_id was not added to the user with email ${email}`
    }


}
/**
 * Removes the comment_id from the user based on the provided email
 * @param {email address of the user} email
 * @param {comment_id of the commentto be removed from the given user} c_id
 * @returns {updated user obj after removing the comment_id}
 */
async function removeCommentId(email, c_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!c_id) throw "comment_id to be removed is not provided"
    if (typeof c_id != 'string') throw `Error: comment_id should be of type string`

    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ email: email }, { "$pull": { "comments": c_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id not removed from the user with email ${email}`
    }

}

/**
 * Adds the followedQuestion_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {followedQuestion_id of the followed question to be added to the given user} q_id
 * * @returns {updated user obj after adding the followedQuestion_id}
 */
async function addFollowedQuestionId(email, q_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!q_id) throw "question_id to be added is not provided"
    if (typeof q_id != 'string') throw `Error: question_id should be of type string`


    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ "email": email }, { "$push": { "questions_followed": q_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id was not added to the user with email ${email}`
    }


}

/**
 * Removes the followedQuestion_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {followedQuestion_id of the followed question to be removed from the given user} q_id
 * * @returns {updated user obj after removing the followedQuestion_id}
 */
async function removeFollowedQuestionId(email, q_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!q_id) throw "question_id to be removed is not provided"
    if (typeof q_id != 'string') throw `Error: question_id should be of type string`


    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ email: email }, { "$pull": { "questions_followed": q_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: question_id not removed from the user with email ${email}`
    }

}
/**
 * Adds the voted comment_id to the user based on the provided email
 * @param {email address of the user} email
 * @param {comment_id of the voted comment to be added to the given user} c_id
 * * @returns {updated user obj after adding the voted comment_id}
 */
async function addVotedCommentId(email, c_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!c_id) throw "comment_id of the voted comment to be added is not provided"
    if (typeof c_id != 'string') throw `Error: comment_id of the voted comment should be of type string`
    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`

    const userCollection = await users();

    let usr = await userCollection.updateOne({ email: email }, { "$push": { "voted_comments": c_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: comment_id  of the voted comment was not added to the user with email ${email}`
    }


}

/**
 * Removes the voted comment_id from the user based on the provided email
 * @param {email address of the user} email
 * @param {comment_id of the voted comment to be removed from the given user} c_id
 * @returns {updated user obj after removing the voted comment_id}
 */
async function removeVotedCommentId(email, c_id) {
    if (!email) throw "user's email is required";
    if (typeof email != 'string') { throw `Error: email should be of type string` }
    if (!c_id) throw "comment_id of the voted comment to be removed is not provided"
    if (typeof c_id != 'string') throw `Error: comment_id of the voted comment should be of type string`
    let check = await getUser(email);
    if (!check) throw `Error: no user exists with the email ${email}`
    const userCollection = await users();

    let usr = await userCollection.updateOne({ email: email }, { "$pull": { "voted_comments": c_id } })
    if (usr.modifiedCount > 0) {
        return await getUser(email);
    }
    else {
        throw `Error: comment_id  of the voted comment was not removed to the user with email ${email}`
    }


}

async function getUserInfo(email){
    if (!email) throw "user's email is required";
    const tagDataAPI = require("./tags");
    const userData = await getUser(email);
    const {tags} = userData;
    const questions = [];
    const tagObjList = [];

    for(var tagID of tags){
        var tagData = undefined;

        try {
            tagData = await tagDataAPI.getTag(tagID);
        } catch (error) {
            continue;
        }

        if(!tagData) continue;

        tagObjList.push(tagData.tag);
        questions.push.apply(questions,tagData.questions);
    }

    questions.sort((a,b) => b.timestamp - a.timestamp);
    const data = {
        tags : tagObjList,
        questions : questions
    }

    return data;
}



module.exports = { addUser, getUser, getAllUsers, addQuestionId, removeQuestionId, addCommentId, removeCommentId, addFollowedQuestionId, removeFollowedQuestionId, addVotedCommentId, removeVotedCommentId, checkUserName, addLikedQuestionId, removeLikedQuestionId, addTag, removeTag, getUserInfo, checkUser }
