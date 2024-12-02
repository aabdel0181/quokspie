import * as dbsingleton from '../models/db_access.js';
import bcrypt from 'bcrypt';
import { encryptPassword, isOK, isLoggedIn } from '../routes/route_helper.js';

const db = dbsingleton;

// GET /getUserInfo
export const getUserInfo = async function (req, res) {
    const username = req.params.username;

    if (!isLoggedIn(req, username)) {
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
            user: userData,
            gpus: gpu_rows,
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error querying database.' });
    }
};

// POST /update-username
export const postNewUsername = async function (req, res) {
    const old_username = req.params.username;

    if (!isLoggedIn(req, old_username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { username } = req.body;
    if (!username || !isOK(username)) {
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
export const postNewPw = async function (req, res) {
    const username = req.params.username;

    if (!isLoggedIn(req, username)) {
        return res.status(403).send({ error: 'Not logged in.' });
    }

    const { password } = req.body;
    if (!password || !isOK(password)) {
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
export const postRegister = async function (req, res) {
    const { username, password, firstName, lastName, gpuModel, gpuSerial } = req.body;

    if (!username || !password || !firstName || !lastName || !gpuModel || !gpuSerial) {
        return res.status(400).send({ error: 'Missing required fields.' });
    }

    try {
        const username_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
        if (username_rows.length > 0) {
            return res.status(409).send({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.send_sql(
            `INSERT INTO users (username, hashed_password, first_name, last_name) VALUES ('${username}', '${hashedPassword}', '${firstName}', '${lastName}')`
        );

        // await db.send_sql(
        //     `INSERT INTO gpus (model, gpu_id, user_id) VALUES ('${gpuModel}', '${gpuSerial}', (SELECT user_id FROM users WHERE username = '${username}'))`
        // );

        const user_id = (
            await db.send_sql(`SELECT user_id FROM users WHERE username = '${username}'`)
        )[0].user_id;

        // Set session variables
        req.session.user_id = user_id;
        req.session.username = username;

        return res.status(200).send({ message: 'User registered successfully.', username });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send({ error: 'Error registering user.' });
    }
};

// POST /login
export const postLogin = async function (req, res) {
    console.log("in postLogin");

    const { username, password } = req.body;
  
    if (!username || !password || !isOK(username) || !isOK(password)) {
      return res.status(400).send({ error: 'Invalid credentials.' });
    }
  
    try {
      // Fetch the user record by username
      const user_rows = await db.send_sql(`SELECT * FROM users WHERE username = '${username}'`);
      if (user_rows.length === 0) {
        return res.status(401).send({ error: 'Invalid username or password.' });
      }
  
      const user = user_rows[0];
      // Compare the password with the hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.hashed_password);
  
      if (!isPasswordCorrect) {
        return res.status(401).send({ error: 'Invalid username or password.' });
      }
  
      // Set session data
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
export const postLogout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send({ message: 'Logout failed' });
      }
      res.status(200).send({ message: 'Logged out successfully' });
    });
  };

// GET /check-username
export const checkUsername = async function (req, res) {
    const { username } = req.query;

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

// GET /session-check
export const checkSession = (req, res) => {
    if (req.session && req.session.user_id) {
        return res.status(200).send({ authenticated: true, username: req.session.username });
    }
    res.status(401).send({ authenticated: false });
};

// POST /ramp-results
export const postRampResults = async function (req, res) {
    const {
        gpu_id,
        timestamp,
        temperature,
        voltage,
        power_usage,
        delta_t,
        mttf_em,
        mttf_sm,
        mttf_tddb,
        mttf_tc,
        mttf_overall,
    } = req.body;

    if (
        !gpu_id ||
        !timestamp ||
        temperature === undefined ||
        voltage === undefined ||
        power_usage === undefined ||
        delta_t === undefined ||
        mttf_em === undefined ||
        mttf_sm === undefined ||
        mttf_tddb === undefined ||
        mttf_tc === undefined ||
        mttf_overall === undefined
    ) {
        return res.status(400).send({ error: "Missing required fields." });
    }

    try {
        console.log("Inserting into ramp_model_results table with data:", req.body);

        await db.insert_items(
            `INSERT INTO ramp_model_results (
                gpu_id, timestamp, temperature, voltage, power_usage, delta_t,
                mttf_em, mttf_sm, mttf_tddb, mttf_tc, mttf_overall
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                gpu_id,
                timestamp,
                temperature,
                voltage,
                power_usage,
                delta_t,
                mttf_em,
                mttf_sm,
                mttf_tddb,
                mttf_tc,
                mttf_overall,
            ]
        );

        return res.status(200).send({ message: "RAMP model results inserted successfully." });
    } catch (err) {
        console.error("Database error during insertion:", err); // Log the actual error
        return res.status(500).send({ error: "Error inserting RAMP model results." });
    }
};


// Export all routes as a single object
const routes = {
    post_login: postLogin,
    post_register: postRegister,
    post_logout: postLogout,
    post_new_username: postNewUsername,
    post_new_pw: postNewPw,
    get_user_info: getUserInfo,
    check_username: checkUsername,
    check_session: checkSession,
    post_ramp_results: postRampResults,
};

export default routes;
