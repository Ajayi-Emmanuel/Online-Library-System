const http = require("http");
const path = require("path");
const fs = require("fs");
const {AuthenticateUser} = require("./authenticate");


const bookFilePath = path.join(__dirname, "db", "Books.json")
const userFilePath = path.join(__dirname, "db", "users.json")
const bookLoanFilePath = path.join(__dirname, "db", "bookLoan.json")
usersDb = [];
booksDb = [];
bookLoanDb = [];


const PORT = 4000;

const requestHandler = function (req, res){

    if (req.url == "/register" && req.method == "POST") {
        CreateUser(req, res)
    } else if(req.url === "/users" && req.method === "GET"){ 
        //Authentication
        AuthenticateUser(req,res, ['admin'])
            .then(() => {
                getAllUsers(req,res)
            }).catch((err) =>   {
                res.writeHead(400)
                res.end(JSON.stringify({
                    message: err
                }))
            })
    } else if(req.url === "/books" && req.method === "POST"){
        //Authentication
        AuthenticateUser(req,res, ['admin'])
            .then(() => {
                CreateBook(req, res, book)
            }).catch((err) =>   {
                res.writeHead(400)
                res.end(JSON.stringify({
                    message: "error"
                }))
            })
    }else if(req.url === "/books" && req.method === "DELETE"){
        //Authentication
        AuthenticateUser(req,res, ['admin'])
            .then(() => {
                DeleteBook(req, res)
            }).catch((err) =>   {
                res.writeHead(401)
                res.end(JSON.stringify({
                    message: "error"
                }))
            })
        
    }else if(req.url === "/books" && req.method === "PUT"){
        //Authentication
        UpdateBook(req, res)
    }else if(req.url === "/loanBook" && req.method === "POST"){
        // res.end("Hello")
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
        console.log(usersDb)
        fs.writeFile(userFilePath, JSON.stringify(usersDb), (err) => {
            if (err){
                console.log(err)
            }
            res.end(JSON.stringify(newUser));
        })

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

const CreateBook = function (req, res){
    body = []
    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString()
        const newBook = JSON.parse(parsedBody)

        const lastBook = booksDb[booksDb.length - 1];
        const lastBookId = lastBook.id;
        newBook.id = lastBookId + 1;

        //Join book to db
        booksDb.push(newBook);
        fs.writeFile(bookFilePath, JSON.stringify(booksDb), (err) => {
            if (err){
                console.log(err);
                res.writeHead(500);
                res.end(JSON.stringify({
                    message: "Internal Error"
                }))
            }
            res.end(JSON.stringify(newBook));
        })

    })
}

const DeleteBook = function (req, res){
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBook)
        const bookId = detailsToUpdate.id

        fs.readFile(bookFilePath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const booksObj = JSON.parse(books)
            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }

            // DELETE FUNCTION
            booksObj.splice(bookIndex, 1)

            fs.writeFile(bookFilePath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Deletion successfull!");
            });

        })

    })
}

const UpdateBook = function (req, res){
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBook)
        const bookId = detailsToUpdate.id

        fs.readFile(bookFilePath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const booksObj = JSON.parse(books)

            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }

            const updatedBook = { ...booksObj[bookIndex], ...detailsToUpdate }
            booksObj[bookIndex] = updatedBook

            fs.writeFile(bookFilePath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Update successfull!");
            });

        })

    })
}

const LoanBook = function (req, res){
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const bookToLoan = JSON.parse(parsedBook)
        const bookTitle = bookToLoan.title
  
        fs.readFile(bookFilePath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const booksObj = JSON.parse(books)
            const bookName = booksObj.find(book => book.title === bookTitle)
            bookId = bookName.id
            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }
            
            bookLoanDb.push(bookName);
            fs.writeFile(bookLoanFilePath, JSON.stringify(bookLoanDb), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }
                res.writeHead(200)
            });

            booksObj.splice(bookIndex, 1)             
            fs.writeFile(bookFilePath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
            });

        })
    })

}

const ReturnBook = function (req, res){
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const bookToReturn = JSON.parse(parsedBook)
        const bookTitle = bookToReturn.title
        
        fs.readFile(bookLoanFilePath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }
            const booksObj = JSON.parse(books)
            const bookName = booksObj.find(book => book.title === bookTitle)
            bookId = bookName.id
            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }

            booksDb.push(bookName)
            fs.writeFile(bookFilePath, JSON.stringify(booksDb), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }
                res.writeHead(200)
            });
      

            booksObj.splice(bookIndex, 1)
            
            fs.writeFile(bookLoanFilePath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
            });

        })
    })
}



const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    
    booksDb = JSON.parse(fs.readFileSync(bookFilePath, 'utf8'));
    usersDb = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
    bookLoanDb = JSON.parse(fs.readFileSync(bookLoanFilePath, 'utf8'));
    console.log(`Server running on https://localhost:${PORT}`);
    
})
