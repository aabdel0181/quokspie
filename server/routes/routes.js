const dbsingleton = require('../models/db_access.js');
const bcrypt = require('bcrypt');
const helper = require('../routes/route_helper.js');
const db = dbsingleton;

// GET /getUserInfo
var getUserInfo = async function (req, res) {
    const username = req.params.username;

    if (!helper.isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    try {
        const username_rows = await db.send_sql(`SELECT username, first_name, last_name FROM users WHERE username = '${username}'`);
        if (username_rows.length === 0) {
            return res.status(404).send({ error: 'User not found.' });
        }

        const userData = username_rows[0];

        const gpu_rows = await db.send_sql(
            `SELECT model, gpu_id FROM gpus WHERE user_id = (SELECT user_id FROM users WHERE username = '${username}')`
        );

        return res.status(200).send({
            user: userData, // Includes username, first_name, and last_name
            gpus: gpu_rows, // Array of associated GPUs
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error querying database.' });
    }
};

// POST /update-username
var postNewUsername = async function (req, res) {
    const old_username = req.params.username;

    if (!helper.isLoggedIn(req, old_username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { username } = req.body;
    if (!username || !helper.isOK(username)) {
        return res.status(400).send({ error: 'Invalid username.' });
    }

    try {
        const username_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        if (username_rows.length > 0) {
            return res.status(409).send({ error: 'Username already exists.' });
        }

        await db.insert_items(`UPDATE users SET username = '${username}' WHERE user_id = '${req.session.user_id}'`);

        req.session.username = username;

        return res.status(200).send({ message: 'Username updated successfully.', username });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error updating username.' });
    }
};

// POST /update-password
var postNewPw = async function (req, res) {
    const username = req.params.username;

    if (!helper.isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { password } = req.body;
    if (!password || !helper.isOK(password)) {
        return res.status(400).send({ error: 'Invalid password.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert_items(`UPDATE users SET hashed_password = '${hashedPassword}' WHERE username = '${username}'`);

        return res.status(200).send({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error updating password.' });
    }
};

// POST /register
var postRegister = async function (req, res) {
    const { username, password, gpuModel, gpuSerial } = req.body;

    if (!username || !password || !gpuModel || !gpuSerial) {
        return res.status(400).send({ error: 'Missing required fields.' });
    }

    try {
        const username_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        if (username_rows.length > 0) {
            return res.status(409).send({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.send_sql(`INSERT INTO users (username, hashed_password) VALUES ('${username}', '${hashedPassword}')`);

        await db.send_sql(
            `INSERT INTO gpus (model, gpu_id, user_id) VALUES ('${gpuModel}', '${gpuSerial}', (SELECT user_id FROM users WHERE username = '${username}'))`
        );

        const user_rows = await db.send_sql(`SELECT username, first_name, last_name FROM users WHERE username = '${username}'`);
        const gpu_rows = await db.send_sql(
            `SELECT model, gpu_id FROM gpus WHERE user_id = (SELECT user_id FROM users WHERE username = '${username}')`
        );

        req.session.user_id = (await db.send_sql(`SELECT user_id FROM users WHERE username = '${username}'`))[0].user_id;
        req.session.username = username;

        return res.status(200).send({
            message: 'User registered successfully.',
            user: user_rows[0],
            gpus: gpu_rows,
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error registering user.' });
    }
};

// POST /login
var postLogin = async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password || !helper.isOK(username) || !helper.isOK(password)) {
        return res.status(400).send({ error: 'Invalid credentials.' });
    }

    try {
        const user_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        if (user_rows.length === 0) {
            return res.status(401).send({ error: 'Invalid username or password.' });
        }

        const user = user_rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordCorrect) {
            return res.status(401).send({ error: 'Invalid username or password.' });
        }

        req.session.user_id = user.user_id;
        req.session.username = username;

        return res.status(200).send({
            message: 'Login successful.',
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error logging in.' });
    }
};

// GET /logout
var postLogout = function (req, res) {
    req.session.user_id = null;
    req.session.username = null;
    return res.status(200).send({ message: 'Logged out successfully.' });
};

// GET /check-username
var checkUsername = async function (req, res) {
    const username = req.query.username;

    if (!username) {
        return res.status(400).send({ error: 'Username is required.' });
    }

    try {
        const result = await db.send_sql(`SELECT username FROM users WHERE username = '${username}'`);
        return res.status(200).send({ exists: result.length > 0 });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error querying database.' });
    }
};

// Export routes
const routes = {
    post_login: postLogin,
    post_register: postRegister,
    post_logout: postLogout,
    post_new_username: postNewUsername,
    post_new_pw: postNewPw,
    get_user_info: getUserInfo,
    check_username: checkUsername,
};

module.exports = routes;
