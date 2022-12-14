const supertest = require("supertest")
const httpServer = require("../index")


describe("user Route", () => {

    it("GET /user works", async () => {
        const testuser = {
            user: {
                "username": "enoch1",
                "password": "blessing1"
            }
        }
        const response = await supertest(httpServer).get("/users").send(testuser)
        
        const res_user = JSON.parse(response.text)
        
        expect(res_user[0].username).toBe("Emmanuel101")
        expect(res_user[1].role).toBe("reader")
        expect(res_user.length).toBe(4)
        expect(response.statusCode).toBe(200)
    })

    it("POST /register works", async () => {

        const newtestuser = {
                "fullName": "Ajayi Emmanuel",
                "username": "Emmanuel101",
                "email": "emmanueltemitayo056@gmail.com",
                "role": "admin",
                "phoneNumber": "09032608313",
                "password": "qwerty23."
            }
        
        const response = await supertest(httpServer).post("/register").send(newtestuser)

        const res_user = JSON.parse(response.text)

        expect(response.statusCode).toBe(200);
        expect(res_user.role).toBe("admin");
        expect(res_user.username).toBe("Emmanuel101");
    })

    

})

describe("Book Route", () => {
    
    it("POST /books works", async () => {

        const details = {
            user: {
                username: "enoch1",
                password: "blessing1"
            },
            book:{
                "title": "The Church",
                "author": "Ajayi Emmanuel",
                "year": 2021
            }
        }

        const response = await supertest(httpServer).post("/books").send(details)

        const res_user = JSON.parse(response.text)

        expect(res_user.title).toBe("The Church")
        expect(res_user.author).toBe("Ajayi Emmanuel")
    })

    it("DELETE /books works", async () => {

        const details = {
            user: {
                "username": "enoch1",
                "password": "blessing1"
            },
            book: {
                "id": 4
            }
        }
        const response = await supertest(httpServer).delete("/books").send(details)

        expect(response.text).toBe("Deletion successful!")
        expect(response.statusCode).toBe(200)
    })

    it("PUT /books works", async () => {

        const details = {
            user: {
                "username": "enoch1",
                "password": "blessing1"
            },
            book: {
                "title": "Tested",
                "id": 5
            }
        }
        const response = await supertest(httpServer).put("/books").send(details)

        console.log(response.text)
        expect(response.text).toBe("Update successful!")
        expect(response.statusCode).toBe(200)
    })

    it("POST /loanBook works", async () => {

        const details = {
            user: {
                "username": "Tosin101",
                "password": "qwert21."
            },
            book: {
                "title": "Death of a City"
            }
        }

        const response = await supertest(httpServer).post("/loanBook").send(details)

        expect(response.text).toBe("Loan Successful")
        expect(response.statusCode).toBe(200)
    })

    it("POST /returnBook works", async () => {

        const details = {
            user: {
                "username": "Tosin101",
                "password": "qwert21."
            },
            book: {
                "title": "The Revenue Stamp"
            }
        }
        const response = await supertest(httpServer).post("/returnBook").send(details)

        expect(response.text).toBe("Book has been Returned")
        expect(response.statusCode).toBe(200)
    })
})