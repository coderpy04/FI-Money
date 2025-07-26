const bcrypt = require('bcrypt');
async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function checkPassword(password, hashedPassword) {
    console.log(hashPassword, password)
    const hash = await bcrypt.compare(password, hashedPassword);
    return hash;
}

module.exports = { hashPassword, checkPassword };