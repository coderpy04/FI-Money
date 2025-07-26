const db = require('./db');


async function createUserTable() {
    const result =
        await db`CREATE TABLE IF NOT EXISTS fiMoney.user(
            id SERIAL PRIMARY KEY,
            username VARCHAR(25) NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`;
    console.log(result);
}


async function getUsers() {
    const result = await db`SELECT * FROM fiMoney.user`
    console.log(result);
};

async function createSchema() {
    const result = await db`CREATE SCHEMA IF NOT EXISTS fiMoney;`
    console.log(result);
};



async function createProductsTable() {
    try {
        const result = await db`CREATE TABLE IF NOT EXISTS fiMoney.products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(25) NOT NULL,
        sku VARCHAR(20) NOT NULL UNIQUE,
        image_url TEXT,
        description TEXT,
        quantity INTEGER DEFAULT 0,
        price NUMERIC NOT NULL
        );`
    }
    catch (err) {
        console.log(err);
    }
};

async function deleteTables() {
    try {
        await db`DROP TABLE IF EXISTS fiMoney.products CASCADE;`
        await db`DROP TABLE IF EXISTS fiMoney.user CASCADE;`
    }
    catch (err) {
        console.log(err);
    }
};
const init = async () => {
    await createSchema();
    await createUserTable();
    await createProductsTable();
    await getUsers();
};


const deleteAll = () => {
    deleteTables();
}

module.exports = { createProductsTable, getUsers, createUserTable, deleteTables, init, deleteAll, createSchema };