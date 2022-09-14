const path = require("path");
const fs = require("fs");

const userFilePath = path.join(__dirname, "db", "users.json")


function getAllUsers(req, res){
    return new Promise ((resolve, reject) => {
        fs.readFile(userFilePath, 'utf-8', (err,users)=> {
            if(err){
                reject(err)
            }
            resolve(JSON.parse(users))
        })
    })
}

function AuthenticateUser(req, res, roles){
    return new Promise ((resolve, reject) => {
        const body = []

        req.on('data', (chunk) => {
            body.push(chunk)
        })

        req.on('end', async () => {
            const parsedBody = Buffer.concat(body).toString()
            if(!parsedBody){
                reject("Please Enter your Username and Password")
            }
            const { user: loginDetails, book } = JSON.parse(parsedBody);
    
            const users = await getAllUsers()
            
            const userFound = users.find((user)=> {
                return user.username === loginDetails.username
            })
            
            if(!userFound){
                reject("User not Found, pls sign up!")
            }

            if(userFound.password !== loginDetails.password){
                reject("Invalid Username Or Paaword")
            }

            if(!roles.includes(userFound.role)){
                reject("You don't not have access to this feature")
            }
            resolve(book)

        })
    })

}

// const AuthenticateUser = function (req, res){
//     const body = []

//     req.on('data', (chunk) => {
//         body.push(chunk)
//     })

//     req.on('end', () => {
//         const parsedBody = Buffer.concat(body).toString()
//         if (!parsedBody){
//             res.writeHead(404)
//             res.end(JSON.stringify({
//                 message: "No Username or Password Provided"
//             }))
//         }
//         const loginDetails = JSON.parse(parsedBody);
//         let userFound = usersDb.find((user) => {
//             return user.username == loginDetails.username;
//         })
//         if (!userFound){
//             res.writeHead(404)
//             res.end(JSON.stringify({
//                 error: "Invalid Username or Password" 
//             })) 
//         }
//         res.writeHead(200);
//         res.end(`Welcome ${userFound.username}, you are ${userFound.role}`);
        
//     })
// }


module.exports = {
    AuthenticateUser
}