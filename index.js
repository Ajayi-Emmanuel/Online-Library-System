const http = require("http");

const PORT = 3000;


const requestHandler = function (req, res){

    if (req.url === "/register" && req.method == "POST") {
        res.end("Create User!")
    } else if(req.url === "/login" && req.method === "POST"){
        res.end("Authenticate User")
    } else if(req.url === "/Users" && req.method === "GET"){
        res.end("Get All User")
    } else if(req.url === "/books" && req.method === "POST"){
        res.end("Create Book")
    }else if(req.url === "/books" && req.method === "DELETE"){
        res.end("Delete Book")
    }else if(req.url === "/books" && req.method === "PUT"){
        res.end("Update Books")
    }else if(req.url === "/loanBook" && req.method === "POST"){
        res.end("Loan Book")
    }else if(req.url === "/returnBook" && req.method === "POST"){
        res.end("Return Book")
    }else{
        res.writeHead(404)
        res.end(JSON.stringify({
            error: "Route Not Found!"
        }))
    }
}






const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`)
})
