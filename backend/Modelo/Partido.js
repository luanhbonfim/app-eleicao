import PartidoBD from "../Persistencia/PartidoBD.js";

export default class Partido {
    #id;
    #nome;
    #sigla;
    #num_registro;

    constructor(nome, sigla, num_registro) {
        this.#nome = nome;
        this.#sigla = sigla;
        this.#num_registro = num_registro;
    }

    get id() {
        return this.#id;
    }

    set id(novo_id) {
        this.#id = novo_id;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novo_nome) {
        this.#nome = novo_nome;
    }

    get sigla() {
        return this.#sigla;
    }

    set sigla(nova_sigla) {
        this.#sigla = nova_sigla;
    }

    get num_registro() {
        return this.#num_registro;
    }

    set num_registro(novo_num_registro) {
        this.#num_registro = novo_num_registro;
    }

    toString() {
        return `ID: ${this.#id}\n` +
        `Nome: ${this.#nome}\n` +
        `Sigla: ${this.#sigla}\n` +
        `Número de Registro: ${this.#num_registro}`;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            sigla: this.#sigla,
            num_registro: this.#num_registro
        }
    }

    async gravar() {
        const partidoBD = new PartidoBD();
        const num_registro = await partidoBD.gravar(this);
        this.#num_registro = num_registro; 
    }

    async alterar(num_registro) {
        if (!num_registro) {
            throw new Error("O num_registro do partido não está definido.");
        }
        this.#num_registro = num_registro; 
        const partidoBD = new PartidoBD();
        await partidoBD.alterar(this);
    }

    async excluir(num_registro) {
        if (!num_registro) {
            throw new Error("O num_registro do partido não está definido.");
        }
        this.#num_registro = num_registro; // Atribua o ID ao objeto
        const partidoBD = new PartidoBD();
        await partidoBD.excluir(this);
    }

    async consultar(parametro) {
        const partidoBD = new PartidoBD();
        return await partidoBD.consultar(parametro);
    }
}