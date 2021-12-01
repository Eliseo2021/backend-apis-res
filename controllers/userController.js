const fs = require('fs')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const usersFile = require('./users.json')
const registerSchema = require('../schemas/user')

function inicio(req, res) {
    res.send('ok puerto 3000')
}

function getAllUsers(req, res) {
    res.send(usersFile)
}

function register(req, res) {
    const { name, email, password } = req.body

    const newUser = {
        name, 
        email,
        password,
    }

    const validRegister = registerSchema.UserRegisterSchema.validate(newUser)

    if (validRegister.error) {
        // msj error 
        res.send(validRegister.error.details)
    }else {
        // 1. hashear el password
    const hashPassword = bcrypt.hashSync(newUser.password, salt);
    console.log(hashPassword)
        //2. pizar el password
    newUser.password = hashPassword
        // 3. agregar al array
    usersFile.push(newUser)
        // 4. guarduar en el JSON
        fs.writeFileSync(__dirname + '/users.json', JSON.stringify(usersFile))
        res.send(newUser)
    }    
}

function login(req, res) {
    const { email, password } = req.body

    const userFount = usersFile.find((user) => {
        const userEmail = user.email
        const userPassword = user.password

        const matchEmail = email === userEmail
        const matchPassword = bcrypt.compareSync(password, userPassword)

        return matchEmail && matchPassword
    })    
    
    if (userFount) {
        res.send(userFount)
    } else {
        res.send('Usuario no encontrado!')
    }
}


module.exports = {
    inicio,
    getAllUsers,
    login,
    register
}