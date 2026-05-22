const express = require("express")
const bcrypt = require("bcrypt")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let usuarios = []
let id = 1

// Criar usuário
app.post('/usuarios', async (request, response) => {
    const { name, email, password } = request.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return response.status(400).json({ erro: "Todos os campos são obrigatórios" })
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
        return response.status(400).json({ erro: "Nome deve conter apenas letras" })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return response.status(400).json({ erro: "Email inválido" })
    }

    const senhaCriptografada = await bcrypt.hash(password, 10)

    const user = {
        id: id++,
        name,
        email,
        password: senhaCriptografada,
        criadoEm: new Date(),
    }

    usuarios.push(user)
    response.status(201).json(user)
})

// Listar usuários
app.get('/usuarios', (request, response) => {
    response.status(200).json(usuarios)
})

// Editar usuário
app.put('/usuarios/:id', async (request, response) => {
    const userId = parseInt(request.params.id)
    const { name, email, password } = request.body

    const index = usuarios.findIndex(u => u.id === userId)

    if (index === -1) {
        return response.status(404).json({ erro: "Usuário não encontrado" })
    }

    if (name?.trim() && !/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
        return response.status(400).json({ erro: "Nome deve conter apenas letras" })
    }

    if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return response.status(400).json({ erro: "Email inválido" })
    }

    if (name?.trim()) usuarios[index].name = name
    if (email?.trim()) usuarios[index].email = email
    if (password?.trim()) usuarios[index].password = await bcrypt.hash(password, 10)

    response.status(200).json(usuarios[index])
})

// Deletar usuário
app.delete('/usuarios/:id', (request, response) => {
    const userId = parseInt(request.params.id)

    const index = usuarios.findIndex(u => u.id === userId)

    if (index === -1) {
        return response.status(404).json({ erro: "Usuário não encontrado" })
    }

    usuarios.splice(index, 1)
    response.status(200).json({ mensagem: "Usuário deletado com sucesso" })
})

// Servidor
app.listen(3333, () => {
    console.log("Servidor funcionando na porta 3333")
})