const supertest = require("supertest")
const httpServer = require("../index")


describe("user Route", () => {

    // it("POST /register works", async () => {

    //     const newtestuser = {
    //             "fullName": "Ajayi Emmanuel",
    //             "username": "Emmanuel101",
    //             "email": "emmanueltemitayo056@gmail.com",
    //             "role": "admin",
    //             "phoneNumber": "09032608313",
    //             "password": "qwerty23."
    //         }
        
    //     const response = await supertest(httpServer).post("/register").send(newtestuser)

    //     const res_user = JSON.parse(response.text)

    //     expect(response.statusCode).toBe(200);
    //     expect(res_user.role).toBe("admin");
    //     expect(res_user.username).toBe("Emmanuel101");
    // })

    it("GET /user works", async () => {
        const testuser = {
            "loginDetails": {
                "username": "enoch1",
                "password": "blessing1"
            }
        }
        const response = await supertest(httpServer).get("/users").send(testuser)
        
        console.log(response.text.username)
        // expect(res_user.username).toBe("Emmanuel101")
        // expect(response.text.username).toBe("Emmanuel101")
        // expect(res_user.statusCode).toBe(200)
    })

    // it("GET /users works", async () => {
    //     const response = await supertest(httpServer).get("/users")
    //     expect().toBe()
    //     expect().toBe()
    // })

})

// describe("Book Route", () => {
    
//     it("POST /books works", async () => {

//         const details = {
//             user: {
//                 username: "enoch1",
//                 password: "blessing1"
//             },
//             book:{
//                 "title": "The Church",
//                 "author": "Ajayi Emmanuel",
//                 "year": 2021
//             }
//         }

//         const response = await supertest(httpServer).post("/books").send(user,book)

//         console.log(response.text)
//         // expect(details.book.title).toBe("The Church")
//         // expect(response.text.author).toBe("Ajayi Emmanuel")
//     })

//     it("DELETE /books works", async () => {
//         const response = await supertest(httpServer).delete("/books")
//         expect().toBe()
//         expect().toBe()
//     })

//     // it("PUT /books works", async () => {
//     //     const response = await supertest(httpServer).put("/books")
//     //     expect().toBe()
//     //     expect().toBe()
//     // })

//     // it("POST /loanBook works", async () => {
//     //     const response = await supertest(httpServer).post("/loanBook")
//     //     expect().toBe()
//     //     expect().toBe()
//     // })

//     // it("POST /returnBook works", async () => {
//     //     const response = await supertest(httpServer).delete("/returnBook")
//     //     expect().toBe()
//     //     expect().toBe()
//     // })
// })