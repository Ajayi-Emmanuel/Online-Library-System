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


const PORT = 3000; 
 
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
        AuthenticateUser(req, res, ['admin'])
            .then((book) => {
                CreateBook(req, res, book)
            }).catch((err) =>   {
                res.writeHead(400)
                res.end(JSON.stringify({
                    message: "book error"
                }))
            })
    }else if(req.url === "/books" && req.method === "DELETE"){
        //Authentication
        AuthenticateUser(req,res, ['admin'])
            .then((book) => {
                DeleteBook(req, res, book)
            }).catch((err) =>   {
                res.writeHead(401)
                res.end(JSON.stringify({
                    message: "error"
                }))
            })
        
    }else if(req.url === "/books" && req.method === "PUT"){
        //Authentication
        AuthenticateUser(req,res, ['admin'])
            .then((book) => {
                UpdateBook(req, res, book)
            }).catch((err) =>   {
                res.writeHead(401)
                res.end(JSON.stringify({
                    message: "error"
                }))
            })
    }else if(req.url === "/loanBook" && req.method === "POST"){
        //Authentication
        AuthenticateUser(req, res, ['reader'])
            .then((book) => {
                LoanBook(req, res, book)
            }).catch((err) =>   {
                res.writeHead(401)
                res.end(JSON.stringify({
                    message: "error"
                }))
            })
    }else if(req.url === "/returnBook" && req.method === "POST"){
        //Authentication
        AuthenticateUser(req,res, ['reader'])
            .then((book) => {
                ReturnBook(req, res, book)
            }).catch((err) =>   {
                res.writeHead(401)
                res.end(JSON.stringify({
                    message: "error"
                }))
            })
        
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

const CreateBook = function (req, res, newBook){
    
        fs.readFile(bookFilePath, "utf8", (err, data) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }
    
            const oldBooks = JSON.parse(data)
            const allBooks = [...oldBooks, newBook]

            const lastBook = booksDb[booksDb.length - 1];
            const lastBookId = lastBook.id;
            newBook.id = lastBookId + 1;
    
            fs.writeFile(bookFilePath, JSON.stringify(allBooks), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }
    
                res.end(JSON.stringify(newBook));
            });
    
        })
}

const DeleteBook = function (req, res, bookid){

    const bookId = bookid.id
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
            res.end("Deletion successful!");
        });

    })
}

const UpdateBook = function (req, res, update){

    const bookId = update.id

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

        const updatedBook = { ...booksObj[bookIndex], ...update }
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
}

const LoanBook = function (req, res, bookloan){

    const bookTitle = bookloan.title

    fs.readFile(bookFilePath, "utf8", (err, books) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        const booksObj = JSON.parse(books)
        const bookdetails = booksObj.find(book => book.title === bookTitle)
        const bookId = bookdetails.id
        const bookIndex = booksObj.findIndex(book => book.id === bookId)

        if (bookIndex === -1) {
            res.writeHead(404)
            res.end("Book with the specified id not found!")
            return
        }
        
        bookLoanDb.push(bookdetails);
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
            res.end("Loan Successful")
        });

    })

}

const ReturnBook = function (req, res, bookToReturn){
    
    const bookTitle = bookToReturn.title;

    fs.readFile(bookLoanFilePath, "utf8", (err, books) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }
        const booksObj = JSON.parse(books)
        const bookdetails = booksObj.find(book => book.title === bookTitle)
        bookId = bookdetails.id
        const bookIndex = booksObj.findIndex(book => book.id === bookId)

        if (bookIndex === -1) {
            res.writeHead(404)
            res.end("Book with the specified id not found!")
            return
        }

        booksDb.push(bookdetails)
        fs.writeFile(bookFilePath, JSON.stringify(booksDb), (err) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end(JSON.stringify({
                    message: 'Internal Server Error. Could not save book to database.'
                }));
            }
            
        });
        res.writeHead(200)

        booksObj.splice(bookIndex, 1)
        
        fs.writeFile(bookLoanFilePath, JSON.stringify(booksObj), (err) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end(JSON.stringify({
                    message: 'Internal Server Error. Could not save book to database.'
                }));
            }

            
            
        });
        res.writeHead(200)
        res.end("Book has been Returned")

    })
}



const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    
    booksDb = JSON.parse(fs.readFileSync(bookFilePath, 'utf8'));
    usersDb = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
    bookLoanDb = JSON.parse(fs.readFileSync(bookLoanFilePath, 'utf8'));
    console.log(`Server running on https://localhost:${PORT}`);
    
})

module.exports = server;