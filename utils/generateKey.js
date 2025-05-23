const crypto = require('crypto');

const generateKey = () => {
    const key = crypto.randomBytes(64).toString('hex');
    return key;
};

console.log(generateKey());
module.exports = { generateKey };