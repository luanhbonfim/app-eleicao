import Candidato from "../Modelo/Candidato.js";
import Partido from "../Modelo/Partido.js"; // Para associar o partido ao candidato
import CandidatoBD from "../Persistencia/CandidatoBD.js";
import PartidoBD from "../Persistencia/PartidoBD.js";

export default class CandidatoController {

    // GRAVAR - POST
    async gravar(req, res) {
        if (req.method === 'POST' && req.is("application/json")) {
            const { nome, numero_candidato, partido } = req.body;

            // Verificar se os parâmetros necessários estão presentes
            if (nome && numero_candidato && partido) {
                try {
                    // Validação do Partido
                    const partidoBD = new PartidoBD();
                    const partido_id = await partidoBD.consultar(101);
                    const partido = JSON.stringify(partido_id);
                    

                    // Verifique se o partido foi encontrado
                    if (!partido || partido.length === 0) {
                        return res.status(404).json({ status: false, mensagem: "Partido não encontrado." });
                    }
                    
                    // Como partidoBD.consultar pode retornar um array, precisamos pegar o primeiro item (caso seja um único partido)
                    const partidoEncontrado = JSON.parse(partido);
                    console.log(partidoEncontrado)
                    // Criar o objeto Candidato com os dados obtidos
                    const candidato = new Candidato(nome, numero_candidato, partidoEncontrado);

                    // Verifique se os dados do candidato estão corretos
                    if (!candidato.nome || !candidato.numero_candidato || !candidato.partido) {
                        return res.status(400).json({ status: false, mensagem: "Dados do candidato incompletos." });
                    }

                    // Log para verificar os dados do candidato antes de gravar
                    console.log("Candidato a ser gravado:", candidato);

                    // Gravar o candidato no banco de dados
                    const candidatoBD = new CandidatoBD();
                    await candidatoBD.gravar(candidato); // Usando o CandidatoBD para gravar o candidato
                    res.status(201).json({ status: true, mensagem: "Candidato cadastrado com sucesso." });

                } catch (err) {
                    console.error("Erro ao cadastrar o candidato: ", err.message);
                    res.status(500).json({ status: false, mensagem: "Erro ao cadastrar o candidato: " + err.message });
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
            const { nome, numero_candidato, partido } = req.body;

            if (nome && numero_candidato && partido) {
                try {
                    const partidoBD = new PartidoBD();
                    const partido_id = await partidoBD.consultar(101);
                    const partido = JSON.stringify(partido_id);

                    if (partido) {
                        const partidoEncontrado = JSON.parse(partido);
                        console.log(partidoEncontrado)
                        // Criar o objeto Candidato com os dados obtidos
                        const candidato = new Candidato(nome, numero_candidato, partidoEncontrado);

                        await candidato.alterar(id); // Supondo que a classe Candidato tenha um método 'alterar'
                        res.status(200).json({ status: true, mensagem: "Candidato alterado com sucesso." });
                    } else {
                        res.status(404).json({ status: false, mensagem: "Partido não encontrado." });
                    }
                } catch (err) {
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar o candidato: " + err.message });
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
                    const candidato = new Candidato();
                    await candidato.excluir(id); // Supondo que a classe Candidato tenha um método 'excluir'
                    res.status(200).json({ status: true, mensagem: "Candidato excluído com sucesso." });
                } catch (err) {
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir o candidato: " + err.message });
                }
            } else {
                res.status(400).json({ status: false, mensagem: "ID do candidato não fornecido." });
            }
        } else {
            res.status(405).json({ status: false, mensagem: "Método não permitido." });
        }
    }

    // CONSULTAR - GET
    async consultar(req, res) {
        if (req.method === 'GET') {
            const { numero_candidato } = req.params;

            try {
                const candidato = new Candidato();
                let resultado;

                if (numero_candidato) {
                    resultado = await candidato.consultar(parseInt(numero_candidato)); // Supondo que a classe Candidato tenha um método 'consultar'
                    if (resultado) {
                        res.status(200).json({ status: true, candidato: resultado });
                    } else {
                        res.status(404).json({ status: false, mensagem: "Candidato não encontrado." });
                    }
                } else {
                    resultado = await candidato.consultar();
                    res.status(200).json({ status: true, candidatos: resultado});
                }
            } catch (err) {
                res.status(500).json({ status: false, mensagem: "Erro ao consultar o(s) candidato(s): " + err.message });
            }
        } else {
            res.status(405).json({ status: false, mensagem: "Método não permitido." });
        }
    }
}
