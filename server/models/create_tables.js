const dbaccess = require('./db_access');
const config = require('../config.json'); // load configuration

function sendQueryOrCommand(db, query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function create_tables(db) {

    // Users table
    var q1 = db.create_tables('CREATE TABLE IF NOT EXISTS users ( \
        user_id int PRIMARY KEY AUTO_INCREMENT, \
        username VARCHAR(255), \
        hashed_password VARCHAR(255), \
        linked_nconst VARCHAR(10), \
        FOREIGN KEY (linked_nconst) REFERENCES names(nconst) \
        );'
    );

    return await Promise.all([q1]);
}

// Database connection setup
dbaccess.get_db_connection();

create_tables(dbaccess)
    .then(_ => {
        console.log('Tables created');
        dbaccess.close_db();
    })