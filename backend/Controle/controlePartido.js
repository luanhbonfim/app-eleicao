import Partido from "../Modelo/Partido.js";

export default class PartidoController {

    // GRAVAR - POST
    async gravar(req, res) {
        if (req.method === 'POST' && req.is("application/json")) {
            const { nome, sigla, num_registro } = req.body;

            if (nome && sigla && num_registro) {
                try {
                    const partido = new Partido(nome, sigla, num_registro);
                    await partido.gravar(); // Supondo que a classe Partido tenha um método 'gravar'
                    res.status(201).json({ status: true, mensagem: "Partido cadastrado com sucesso." });
                } catch (err) {
                    res.status(500).json({ status: false, mensagem: "Erro ao cadastrar o partido: " + err.message });
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos." });
            }
        } else {
            res.status(405).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    // ALTERAR - PUT/PATCH
    async alterar(req, res) {
        if ((req.method === 'PATCH' || req.method === 'PUT') && req.is("application/json")) {
            const { id } = req.params;
            const { nome, sigla, num_registro } = req.body;

            if (nome && sigla && num_registro) {
                try {
                    const partido = new Partido(nome, sigla, num_registro);
                    await partido.alterar(id); // Supondo que a classe Partido tenha um método 'alterar'
                    res.status(200).json({ status: true, mensagem: "Partido alterado com sucesso." });
                } catch (err) {
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar o partido: " + err.message });
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos." });
            }
        } else {
            res.status(405).json({ status: false, mensagem: "Requisição inválida." });
        }
    }

    // EXCLUIR - DELETE
    async excluir(req, res) {
        if (req.method === 'DELETE') {
            const { id } = req.params;

            if (id) {
                try {
                    const partido = new Partido();
                    await partido.excluir(id); // Supondo que a classe Partido tenha um método 'excluir'
                    res.status(200).json({ status: true, mensagem: "Partido excluído com sucesso." });
                } catch (err) {
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir o partido: " + err.message });
                }
            } else {
                res.status(400).json({ status: false, mensagem: "ID do partido não fornecido." });
            }
        } else {
            res.status(405).json({ status: false, mensagem: "Método não permitido." });
        }
    }

    // CONSULTAR - GET
    async consultar(req, res) {
        if (req.method === 'GET') {
            const { num_registro } = req.params;

            try {
                const partido = new Partido();
                let resultado;

                if (num_registro) {
                    resultado = await partido.consultar(parseInt(num_registro)); // Supondo que a classe Partido tenha um método 'consultar'
                    if (resultado) {
                        res.status(200).json({ status: true, partido: resultado });
                    } else {
                        res.status(404).json({ status: false, mensagem: "Partido não encontrado." });
                    }
                } else {
                    resultado = await partido.consultar();
                    res.status(200).json({ status: true, partidos: resultado });
                }
            } catch (err) {
                res.status(500).json({ status: false, mensagem: "Erro ao consultar o(s) partido(s): " + err.message });
            }
        } else {
            res.status(405).json({ status: false, mensagem: "Método não permitido." });
        }
    }
}
