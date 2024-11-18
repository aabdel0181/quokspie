const { S3Client, PutObjectCommand, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const dbsingleton = require('../models/db_access.js');
const config = require('../config.json'); // Load configuration
const bcrypt = require('bcrypt');
const helper = require('../routes/route_helper.js');
const db = dbsingleton;
const s3 = new S3Client({ region: config.awsRegion });

// GET /getUserInfo
var getUserInfo = async function (req, res) {
    // Check if user is logged in
    const username = req.params.username;
    if (!helper.isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const params = {
        Bucket: config.photoBucket,
        Key: username,
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 7200 });
    // console.log(url);

    try {
        username_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        console.log(username_rows);

        const data = JSON.parse(JSON.stringify(username_rows));

        console.log(data[0].hashed_password);

        return res.status(200).send({ username: data[0].username, linked_nconst: data[0].linked_nconst, link: url });

    } catch {
        return res.status(500).send({ error: 'Error querying database.' });
    }
}

var postNewUsername = async function (req, res) {
    const old_username = req.params.username;
    console.log(old_username);
    if (!helper.isLoggedIn(req, old_username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { username } = req.body;
    if (!username || !helper.isOK(username)) {
        return res.status(400).send({ error: 'One or more of the fields you entered was empty, please try again.' });
    }

    // Check if account already exist
    try {
        username_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        console.log(username_rows);
        if (username_rows.length > 0) {
            return res.status(409).send({ error: 'An account with this username already exists, please try again.' });
        }
    } catch {
        return res.status(500).send({ error: 'Error querying database.' });
    }

    try {
        const num_rows = await db.insert_items(`UPDATE users SET username = '${username}' WHERE user_id = '${req.session.user_id}';`)
    } catch {
        return res.status(500).send({ error: 'Error querying database.' });
    }

    const copyParams = {
        Bucket: config.photoBucket,
        CopySource: `${config.photoBucket}/${old_username}`,
        Key: username
    };

    try {
        const copyCommand = new CopyObjectCommand(copyParams);
        s3.send(copyCommand);

        const deleteParams = {
            Bucket: config.photoBucket,
            Key: old_username
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);

        s3.send(deleteCommand);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error updating photo.' });
    }


    try {
        const result = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`)
        req.session.user_id = result[0].user_id;
        req.session.username = username;

        return res.status(200).send({ username: username });
    } catch {
        return res.status(500).send({ error: 'Error querying database.' });
    }
}

var postNewPw = async function (req, res) {
    const username = req.params.username;
    if (!helper.isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { password } = req.body;
    if (!password || !helper.isOK(password)) {
        return res.status(400).send({ error: 'One or more of the fields you entered was empty, please try again.' });
    }

    store = async function (err, hash) {
        // Store in db
        if (err) {
            return res.status(500).send({ error: 'Error querying database.' });
        }
        try {
            const num_rows = await db.insert_items(`UPDATE users SET hashed_password = '${hash}' WHERE username = '${username}';`)
            return res.status(200).send({ username: username });
        } catch {
            return res.status(500).send({ error: 'Error querying database.' });
        }
    }

    helper.encryptPassword(password, store);
}

var postNewPhoto = async function (req, res) {
    const username = req.params.username;
    if (!helper.isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const photo = req.file;
    if (!photo) {
        return res.status(400).send({ error: 'One or more of the fields you entered was empty, please try again.' });
    }

    const params = {
        Bucket: config.photoBucket,
        Key: `${username}`,
        Body: photo.buffer,
        ContentType: photo.mimetype
    };

    const command = new PutObjectCommand(params);

    try {
        // Upload the file to S3
        const data = await s3.send(command);
    } catch (err) {
        console.error("Error uploading to S3", err);
        res.status(500).send("Error registering user");
    }

}

var postNewNconst = async function (req, res) {
    const username = req.params.username;
    if (!helper.isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { nconst } = req.body;
    if (!nconst) {
        return res.status(400).send({ error: 'One or more of the fields you entered was empty, please try again.' });
    }

    try {
        const num_rows = await db.insert_items(`UPDATE users SET linked_nconst = '${nconst}' WHERE username = '${username}';`)

        const actor_name_res = await db.send_sql(`SELECT primaryName FROM names WHERE nconst = '${nconst}';`);
        console.log(actor_name_res);

        const actor_name = JSON.parse(JSON.stringify(actor_name_res))[0].primaryName;
        console.log(actor_name);

        const newPost = await db.send_sql(`INSERT INTO posts (content, author_id) VALUES ('${username} is now linked to ${actor_name}.', ${req.session.user_id});`);
        console.log("Uploaded post successfully");
        return res.status(200).send({ username: username });
    } catch {
        return res.status(500).send({ error: 'Error querying database.' });
    }
}

// POST /register 
var postRegister = async function (req, res) {
    // Register a user with given body parameters
    const { username, password, linked_id, s_hashtags } = req.body;
    const photo = req.file;
    const hashtags = JSON.parse(s_hashtags);

    console.log(req.body);

    // Error checking
    if (!username || !password || !linked_id || !helper.isOK(username) || !helper.isOK(password) || !helper.isOK(linked_id) || !photo) {
        return res.status(400).send({ error: 'One or more of the fields you entered was empty, please try again.' });
    }

    // Check if account already exist
    try {
        username_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        console.log(username_rows);
        if (username_rows.length > 0) {
            return res.status(409).send({ error: 'An account with this username already exists, please try again.' });
        }
    } catch {
        return res.status(500).send({ error: 'Error querying database.' });
    }


    store = async function (err, hash) {
        // Store in db
        if (err) {
            return res.status(500).send({ error: 'Error querying database.' });
        }

        const params = {
            Bucket: config.photoBucket,
            Key: `${username}`,
            Body: photo.buffer,
            ContentType: photo.mimetype
        };

        const command = new PutObjectCommand(params);

        try {
            // Upload the file to S3
            const data = await s3.send(command);
        } catch (err) {
            console.error("Error uploading to S3", err);
            res.status(500).send("Error registering user");
        }

        try {
            const num_rows = await db.insert_items(`INSERT INTO users (username, hashed_password, linked_nconst) VALUES ('${username}', '${hash}', '${linked_id}')`)
        } catch {
            return res.status(500).send({ error: 'Error querying database.' });
        }

        // Hashtags
        try {
            const result = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`)
            const hashtag_success = processHashtags(result[0].user_id, hashtags);
            if (!hashtag_success) {
                return res.status(500).send({ error: 'Error querying database.' });
            }
        } catch {
            return res.status(500).send({ error: 'Error querying database.' });
        }

        try {
            const result = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`)
            req.session.user_id = result[0].user_id;
            req.session.username = username;

            return res.status(200).send({ username: username });
        } catch {
            return res.status(500).send({ error: 'Error querying database.' });
        }
    }
    // Salt and hash
    helper.encryptPassword(password, store);
};


// POST /login
var postLogin = async function (req, res) {
    // Check username and password and login
    const username = req.body.username;
    const password = req.body.password;

    console.log("Reached login");

    // Error checking
    if (!username || !password || !helper.isOK(username) || !helper.isOK(password)) {
        return res.status(400).send({ error: 'One or more of the fields you entered was empty, please try again.' });
    }

    db.send_sql(`SELECT * FROM users WHERE username = '${username}'`)
        .then(result => {
            hashed_password = result[0].hashed_password;
            user_id = result[0].user_id;
            console.log("Trying to login");
            bcrypt.compare(password, hashed_password, function (err, result) {
                if (err) {
                    return res.status(500).send({ error: 'Error querying database.' });
                }
                if (result) {
                    // Correct username and pw, set session
                    req.session.user_id = user_id;
                    req.session.username = username;
                    return res.status(200).send({ username: username });
                } else {
                    // Wrong username and pw
                    return res.status(401).send({ error: 'Username and/or password are invalid.' });
                }
            });
        })
        .catch(err => {
            console.log(err);

            return res.status(500).send({ error: 'Error querying database.' });
        })
};


// GET /logout
var postLogout = function (req, res) {
    // Log out logic to disable session info
    req.session.user_id = null;
    req.session.username = null;
    return res.status(200).send({ message: "You were successfully logged out." });
};

// GET /check-username
var checkUsername = async function (req, res) {
    const username = req.query.username;

    if (!username) {
        return res.status(400).send({ error: 'Username parameter is missing.' });
    }

    try {
        const result = await db.send_sql(`SELECT username FROM users WHERE username = '${username}'`);
        if (result.length > 0) {
            return res.status(200).send({ exists: true });
        } else {
            return res.status(200).send({ exists: false });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error querying database.' });
    }
};

/* se construct an object that contains a field for each route
   we've defined, so we can call the routes from app.js. */
var routes = {
    post_login: postLogin,
    post_register: postRegister,
    post_logout: postLogout,
    post_new_username: postNewUsername,
    post_new_pw: postNewPw,
    post_new_photo: postNewPhoto,
    post_new_nconst: postNewNconst,
    get_user_info: getUserInfo,
    check_username: checkUsername,
};

module.exports = routes;