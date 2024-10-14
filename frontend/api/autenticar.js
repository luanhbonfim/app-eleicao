export default function Autenticar(req, res) {
    const { username, password } = req.body;

    // Autenticação fictícia para um único usuário (exemplo)
    const user = 'admin';
    const pass = '123456';

    if (username === user && password === pass) {
        // Salva o status de autenticação na sessão
        req.session.autenticado = true;
        res.redirect('/private'); // Redireciona para a área privada após o login
    } else {
        // Exibe mensagem de erro e redireciona para o login
        res.send('<h2>Usuário ou senha incorretos. <a href="/login">Tentar novamente</a></h2>');
    }
}

export function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.autenticado) {
        // Se o usuário estiver autenticado, permitir acesso à rota
        return next();
    } else {
        // Se não estiver autenticado, redireciona para a página de login
        res.redirect('/login');
    }
}

export function logout(req, res) {
    // Destroi a sessão e redireciona para a página de login
    req.session.destroy(err => {
        if (err) {
            return res.send('Erro ao fazer logout');
        }
        res.redirect('/login');
    });
}
