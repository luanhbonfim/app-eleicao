import express from 'express';
import session from 'express-session';
import Autenticar, { verificarAutenticacao, logout } from './api/autenticar.js';

const host = 'localhost';
const port = 3000;

const app = express();

// Middleware para processar o corpo das requisições
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
    secret: 'segredo',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15 // Sessão válida por 15 minutos
    }
}));

// Servir arquivos estáticos (CSS, JS, HTML) da pasta 'frontend/public'
app.use(express.static('./public')); // Para arquivos como CSS, JS e HTML

// Servir arquivos privados somente após autenticação
app.use('/private', verificarAutenticacao, express.static('./private')); // Restrição para '/private'

// Rota de logout
app.get('/logout', logout);

// Rota de login (GET para exibir o formulário de login)
app.get('/login', (req, res) => {
    res.sendFile('./public/login.html', { root: './' });  // Caminho absoluto para o login.html
});

// Rota de login (POST para processar o formulário de login)
app.post('/login', Autenticar);

// Rota privada (após autenticação)
app.get('/private', (req, res) => {
    res.sendFile('./private/index.html', { root: './' });  // Caminho absoluto para o private.html
});

// Iniciar o servidor
app.listen(port, host, () => {
    console.log(`Servidor on-line em http://${host}:${port}`);
});
