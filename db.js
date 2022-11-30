const postgres = require("postgres");

// connect to db
const connect = postgres({
  host: "localhost",
  port: 5432,
  database: "postgres_test",
  username: "postgres",
  password: "Ismanyan123", // gunakan password kalian masing-masing
});

module.exports = connect;
