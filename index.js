const http = require("http");
const path = require("path");
const fs = require("fs");

const BookFilePath = path.join(__dirname, "db", "Books.json")
const UserFilePath = path.join(__dirname, "db", "users.json")
UsersDb = [];

const PORT = 3000;

const requestHandler = function (req, res){

    if (req.url == "/register" && req.method == "POST") {
        CreateUser(req, res)
    } else if(req.url === "/login" && req.method === "POST"){
        AuthenticateUser(req, res)
    } else if(req.url === "/users" && req.method === "GET"){
        getAllUsers(req, res)
    } else if(req.url === "/books" && req.method === "POST"){
        CreateBook(req, res)
    }else if(req.url === "/books" && req.method === "DELETE"){
        DeleteBook(req, res)
    }else if(req.url === "/books" && req.method === "PUT"){
        UpdateBook(req, res)
    }else if(req.url === "/loanBook" && req.method === "POST"){
        LoanBook(req, res)
    }else if(req.url === "/returnBook" && req.method === "POST"){
        ReturnBook(req, res)
    }else{
        res.writeHead(404)
        res.end(JSON.stringify({
            error: "Route Not Found!"
        }))
    }
}

const CreateUser = function (req, res){
    const body = []

    req.on('data', (chunk) => {
        body.push(chunk)
    })
    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString()
        const newUser = JSON.parse(parsedBody);

        UsersDb.push(newUser);
        fs.writeFile(UserFilePath, JSON.stringify(UsersDb), (err) => {
            if (err){
                console.log(err)
            }
            res.end(JSON.stringify(newUser));
        })

    })
}

const AuthenticateUser = function (req, res){
    const body = []

    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString()
        if (!parsedBody){
            res.end(JSON.stringify({
                message: "No Username or Password Provided"
            }))
        }
        const loginDetails = JSON.parse(parsedBody);
        const userFound = UsersDb.find((user) => {
           return user.username === loginDetails.username
        })
    })
}




const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    
    booksDb = JSON.parse(fs.readFileSync(BookFilePath, 'utf8'));
    UsersDb = JSON.parse(fs.readFileSync(UserFilePath, 'utf8'));
    console.log(`Server running on https://localhost:${PORT}`);
    
})
