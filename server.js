const express = require("express")
const { use } = require("react")
const app = express()

app.use(express.json())

let usuarios = []
let id = 1

//rota na qual o front end ira acessar\ http://local.host:3333/usuarios/ "response= resposta"
app.post('/usuarios', (request, response) => {

    const {name, email, telefone } = request.body

    const user = {
        id: id ++,
        name: name,
        email: email,
        telefone: telefone,
        criadoEm: new Date(),
        
    }
    usuarios.push(user)

    response.status(200).send(user)

})
//visualizaçao dos usuarios
app.get('/usuarios', (request, response) => {
    response.status(200).send(usuarios)
})

//servidor localizado na porta 3333
app.listen(3333, () => {
    console.log("Servidor Funcionando")
})
