import Partido from "../Modelo/Partido.js";
import Conectar from "./ConexaoBD.js";

export default class PartidoBD {

    constructor () {
        this.init();
    }
    
    async init () {
        try {
            const conexao = await Conectar();
            const query_sql = `
                CREATE TABLE IF NOT EXISTS Partido (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nome VARCHAR(255) NOT NULL,
                    sigla VARCHAR(20) NOT NULL,
                    num_registro INT NOT NULL
                );
            `;
            await conexao.execute(query_sql);
            await globalThis.poolConexoes.releaseConnection(conexao);
            console.log('Banco de dados iniciado com sucesso.')
        } catch (e) {
            console.error('O banco de dados não pode ser iniciado: ', e)
        }
    }

    async gravar(partido) {
        if (partido instanceof Partido) {
            try {
                const conexao = await Conectar();
                const query_sql = `
                    INSERT INTO Partido (nome, sigla, num_registro) VALUES (?, ?, ?);
                `;
                const parametros = [
                    partido.nome,
                    partido.sigla,
                    partido.num_registro
                ];

                const [result] = await conexao.execute(query_sql, parametros);
                await globalThis.poolConexoes.releaseConnection(conexao);
                console.log("Partido inserido com sucesso.");
            } catch (e) {
                console.error("Erro ao gravar partido: ", e);
            }
        } else {
            console.error("O objeto fornecido não é uma instância de Partido");
        }
    }

    async alterar(partido) {
        if (partido instanceof Partido && partido.num_registro) {
            try {
                const conexao = await Conectar();
                const query_sql = `
                    UPDATE Partido
                    SET nome = ?, sigla = ?, num_registro = ?
                    WHERE num_registro = ?    
                `;

                const parametros = [
                    partido.nome,
                    partido.sigla,
                    partido.num_registro
                ];

                await conexao.execute(query_sql, parametros);
                await global.poolConexoes.releaseConnection(conexao);
                console.log("Partido atualizado com sucesso!")
            } catch (e) {
                console.error("Erro ao atualizar o partido: ", e)
            }
        } else {
            console.error("Partido não encontrado para alteração ou número de registro não existe.")
        }
    }

    async excluir(partido) {
        if (partido instanceof Partido && partido.num_registro) {
            try {
                const conexao = await Conectar();
                const query_sql = `DELETE FROM Partido WHERE num_registro = ?;`;
                const parametros = [partido.num_registro];

                await conexao.execute(query_sql, parametros);
                await global.poolConexoes.releaseConnection(conexao);

                console.log("Partido excluído com sucesso.")
            } catch (e) {
                console.error("Erro ao excluir o partido: ", e)
            }
        } else {
            console.error("Partido não encontrado para exclusão ou número de registro não definido.")
        }
    }

    async consultar(parametro = null) {
        try {

            let query_sql, parametros;

            const conexao = await Conectar();
            
            if (parametro) {
                if (typeof parametro === "number") {
                    query_sql = `SELECT * FROM Partido WHERE num_registro = ?;`;
                    parametros = [parametro];
                } else {
                    query_sql = `SELECT * FROM Partido WHERE nome LIKE ?;`;
                    parametros = [`%${parametro}%`]
                }
            } else {
                query_sql = `SELECT * FROM Partido;`;
                parametros = [];
            }

            const [result] = await conexao.execute(query_sql, parametros);
            await global.poolConexoes.releaseConnection(conexao);
            
            if (result.length > 2) {
                
                const partidos = result.map(p => {
                    const partido = new Partido(
                        p.nome,
                        p.sigla,
                        p.num_registro
                    );
                    partido.id = p.id
            
                    return partido;
                });

                return partidos.length === 1 && parametro ? partidos[0] : partidos;
            } else {
                return result[0] 
            }

        } catch (e) {
            console.error("Erro ao consultar o partido: ", e);
            throw e;
        }
    }
}  