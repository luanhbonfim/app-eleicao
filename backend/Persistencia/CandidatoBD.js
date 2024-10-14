import Candidato from "../Modelo/Candidato.js";
import Conectar from "./ConexaoBD.js";

export default class CandidatoBD {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await Conectar();
            const query_sql = `
                CREATE TABLE IF NOT EXISTS Candidato (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nome VARCHAR(255) NOT NULL,
                    numero_candidato INT NOT NULL,
                    partido_id INT,
                    FOREIGN KEY (partido_id) REFERENCES Partido(id)
                );
            `;
            await conexao.execute(query_sql);
            await globalThis.poolConexoes.releaseConnection(conexao);
            console.log('Tabela Candidato criada com sucesso.');
        } catch (e) {
            console.error('Erro ao criar a tabela de candidatos: ', e);
        }
    }

    async gravar(candidato) {
        if (candidato instanceof Candidato) {
            try {
                // Verifique os parâmetros que vão para a consulta SQL
                console.log("Dados para gravar no banco de dados:", {
                    nome: candidato.nome,
                    numero_candidato: candidato.numero_candidato,
                    partido: candidato.partido
                });

                const conexao = await Conectar();
                const query_sql = `
                    INSERT INTO Candidato (nome, numero_candidato, partido_id) 
                    VALUES (?, ?, ?);
                `;
                const parametros = [
                    candidato.nome,
                    candidato.numero_candidato,
                    candidato.partido.id // Certifique-se de que está passando o id do partido
                ];

                // Verifique se algum parâmetro é undefined
                if (parametros.includes(undefined)) {
                    throw new Error("Parâmetros de inserção inválidos.");
                }

                await conexao.execute(query_sql, parametros);
                await global.poolConexoes.releaseConnection(conexao);
                console.log("Candidato inserido com sucesso.");
            } catch (e) {
                console.error("Erro ao gravar candidato: ", e.message);
                throw e;  // Propague o erro para o controller
            }
        } else {
            console.error("Objeto fornecido não é uma instância de Candidato");
            throw new Error("Objeto fornecido não é uma instância de Candidato");
        }
    }

    async alterar(candidato) {
        if (candidato instanceof Candidato && candidato.id) {
            try {
                const conexao = await Conectar();
                const query_sql = `
                    UPDATE Candidato
                    SET nome = ?, numero_candidato = ?, partido_id = ?
                    WHERE id = ?;
                `;
                const parametros = [
                    candidato.nome,
                    candidato.numero_candidato,
                    candidato.partido.id, // Acessa o ID do partido
                    candidato.id
                ];

                await conexao.execute(query_sql, parametros);
                await globalThis.poolConexoes.releaseConnection(conexao);
                console.log("Candidato atualizado com sucesso.");
            } catch (e) {
                console.error("Erro ao atualizar o candidato: ", e);
            }
        } else {
            console.error("Candidato não encontrado para alteração ou ID não definido.");
        }
    }

    async excluir(candidato) {
        if (candidato instanceof Candidato && candidato.id) {
            try {
                const conexao = await Conectar();
                const query_sql = `DELETE FROM Candidato WHERE id = ?;`;
                const parametros = [candidato.id];

                await conexao.execute(query_sql, parametros);
                await globalThis.poolConexoes.releaseConnection(conexao);
                console.log("Candidato excluído com sucesso.");
            } catch (e) {
                console.error("Erro ao excluir o candidato: ", e);
            }
        } else {
            console.error("Candidato não encontrado para exclusão ou ID não definido.");
        }
    }

    async consultar(parametro = null) {
        try {
            let query_sql, parametros;
    
            const conexao = await Conectar(); // Conecta ao banco
    
            // Define a query principal com base no parâmetro
            if (parametro) {
                if (typeof parametro === "number") {
                    query_sql = `SELECT * FROM Candidato WHERE id = ?;`;
                    parametros = [parametro];
                } else {
                    query_sql = `SELECT * FROM Candidato WHERE nome LIKE ?;`;
                    parametros = [`%${parametro}%`];
                }
            } else {
                query_sql = `SELECT * FROM Candidato;`;
                parametros = [];
            }
    
            const [result] = await conexao.execute(query_sql, parametros); // Executa a consulta
            // Aqui, você ainda mantém a conexão aberta para reutilizar
    
            // Mapeia os candidatos e consulta o partido associado
            const candidatos = await Promise.all(result.map(async c => {
                const candidato = new Candidato(
                    c.nome,
                    c.numero_candidato,
                    { id: c.partido_id } // Referencia ao ID do partido
                );
                candidato.id = c.id;
    
                // Se houver um ID de partido, consulta o nome e sigla do partido
                if (c.partido_id) {
                    query_sql = `SELECT nome, sigla FROM Partido WHERE id = ?;`;
                    parametros = [c.partido_id];
    
                    const [partidoResult] = await conexao.execute(query_sql, parametros); // Consulta partido
    
                    if (partidoResult.length > 0) {
                        const partido = partidoResult[0];
                        candidato.partido = { nome: partido.nome, sigla: partido.sigla }; // Adiciona dados do partido
                    }
                }
    
                return candidato; // Retorna o candidato com ou sem partido
            }));
    
            await globalThis.poolConexoes.releaseConnection(conexao); // Libera a conexão ao final
    
            // Retorna um único candidato se tiver passado um parâmetro, ou todos
            return candidatos.length === 1 && parametro ? candidatos[0] : candidatos;
    
        } catch (e) {
            console.error("Erro ao consultar o(s) candidato(s): ", e);
            throw e;
        }
    }
}    
