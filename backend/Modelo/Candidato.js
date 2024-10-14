import CandidatoBD from "../Persistencia/CandidatoBD.js";
import PartidoBD from "../Persistencia/PartidoBD.js";


export default class Candidato {
    #id;
    #nome;
    #numero_candidato;
    #partido;

    constructor(nome, numero_candidato, partido) {
        this.#nome = nome;
        this.#numero_candidato = numero_candidato;
        this.#partido = partido;
    }

    get id() {
        return this.#id;
    }

    set id (novo_id) {
        this.#id = novo_id;
    }

    get nome () {
        return this.#nome;
    }

    set nome (novo_nome) {
        this.#nome = novo_nome;
    }

    get numero_candidato () {
        return this.#numero_candidato;
    }

    set numero_candidato (novo_numero_candidato) {
        this.#numero_candidato = novo_numero_candidato;
    }

    get partido () {
        return this.#partido;
    }

    set partido (novo_partido) {
        this.#partido = novo_partido;
    }

    toString() {
        return `ID: ${this.#id}\n` +
        `Nome: ${this.#nome}\n` +
        `Numero Candidato: ${this.#numero_candidato}\n` +
        `Partido: ${this.#partido.nome} (${this.#partido.sigla})`;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            numero_candidato: this.#numero_candidato,
            partido: {
                nome: this.#partido.nome,
                sigla: this.#partido.sigla
            }
        };
    }

    // Método para gravar um novo candidato
    async gravar() {
        const candidatoBD = new CandidatoBD();
        const id = await candidatoBD.gravar(this); // Supondo que o BD retorne o ID gerado
        this.#id = id;
    }

    // Método para alterar um candidato existente
    async alterar(id) {
        if (!id) {
            throw new Error("O ID do candidato não está definido.");
        }
        this.#id = id;
        const candidatoBD = new CandidatoBD();
        await candidatoBD.alterar(this); // Supondo que o BD tenha um método alterar
    }

    // Método para excluir um candidato
    async excluir(id) {
        if (!id) {
            throw new Error("O ID do candidato não está definido.");
        }
        this.#id = id;
        const candidatoBD = new CandidatoBD();
        await candidatoBD.excluir(this);
    }

    // Método para consultar candidatos
    async consultar(parametro) {
        const candidatoBD = new CandidatoBD();
        return await candidatoBD.consultar(parametro);
    }
}