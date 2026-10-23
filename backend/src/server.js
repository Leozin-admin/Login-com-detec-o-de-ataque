const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const SECRET_KEY = "minha_chave_secreta_muito_obvia"; // VULNERABILIDADE: Chave secreta exposta e fraca

// Simulando um banco de dados de usuários
const users = [
    { id: 1, username: 'admin', password: '123', role: 'admin' }, // VULNERABILIDADE: Senha em texto puro e muito fraca
    { id: 2, username: 'user', password: 'password123', role: 'user' }
];

// Rota de Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Criando o token JWT
        // VULNERABILIDADE: O token contém informações sensíveis e a chave é fraca
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: "Login realizado com sucesso!", token });
    }

    res.status(401).json({ message: "Usuário ou senha incorretos." });
});

// Rota Protegida (Simulando um Painel de Administração)
app.get('/admin/dashboard', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token não fornecido." });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido ou expirado." });

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Acesso negado. Você não é administrador." });
        }

        res.json({ message: `Bem-vindo ao Painel de Admin, usuário ${user.id}! Aqui estão os dados secretos da empresa: 💰💰💰` });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor vulnerável rodando em http://localhost:${PORT}`);
});
