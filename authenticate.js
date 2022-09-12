const path = require("path");
const fs = require("fs");

const userFilePath = path.join(__dirname, "db", "users.json")



exports.module = {
    AuthenticateUser
}