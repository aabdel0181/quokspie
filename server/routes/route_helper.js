import bcrypt from 'bcrypt';

export function encryptPassword(password, callback) {
    bcrypt.hash(password, 10, callback);
}

export function isOK(str) {
    if (str == null) return false;
    for (let i = 0; i < str.length; i++) {
        if (!/[A-Za-z0-9 \.\?,_]/.test(str[i])) {
            return false;
        }
    }
    return true;
}

export function isLoggedIn(req, obj) {
    if (typeof obj === 'string' || obj instanceof String) {
        return req.session.username != null && req.session.username === obj;
    } else {
        return req.session.user_id != null && req.session.user_id === obj;
    }
}
