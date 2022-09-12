const http = require("http");
const path = require("path");
const fs = require("fs");


const bookFilePath = path.join(__dirname, "db", "Books.json")
const userFilePath = path.join(__dirname, "db", "users.json")
usersDb = [];

const PORT = 3000;

const requestHandler = function (req, res){

    if (req.url == "/register" && req.method == "POST") {
        CreateUser(req, res)
    } else if(req.url === "/login" && req.method === "POST"){
        AuthenticateUser(req, res)
    } else if(req.url === "/users" && req.method === "GET"){ 
        //Authentication
        getAllUsers(req, res)
    } else if(req.url === "/books" && req.method === "POST"){
        //Authentication
        CreateBook(req, res)
    }else if(req.url === "/books" && req.method === "DELETE"){
        //Authentication
        DeleteBook(req, res)
    }else if(req.url === "/books" && req.method === "PUT"){
        //Authentication
        UpdateBook(req, res)
    }else if(req.url === "/loanBook" && req.method === "POST"){
        //Authentication
        LoanBook(req, res)
    }else if(req.url === "/returnBook" && req.method === "POST"){
        //Authentication
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

        usersDb.push(newUser);
        fs.writeFile(userFilePath, JSON.stringify(usersDb), (err) => {
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
            res.writeHead(404)
            res.end(JSON.stringify({
                message: "No Username or Password Provided"
            }))
        }
        const loginDetails = JSON.parse(parsedBody);
        let userFound = usersDb.find((user) => {
            return user.username == loginDetails.username;
        })
        if (!userFound){
            res.writeHead(404)
            res.end(JSON.stringify({
                error: "Invalid Username or Password" 
            })) 
        }
        res.writeHead(200);
        res.end(`Welcome ${userFound.username}, you are ${userFound.role}`);
        
    })
}


const getAllUsers = function (req, res){
    fs.readFile(userFilePath, "utf-8", (err, users) => {
        if (err){
            res.writeHead(400)
            console.log(err)
            res.end(JSON.stringify({
                error: "Server Error!"
            }))
        }
        res.end(users)
    })
}



const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    
    booksDb = JSON.parse(fs.readFileSync(bookFilePath, 'utf8'));
    usersDb = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
    console.log(`Server running on https://localhost:${PORT}`);
    
})
