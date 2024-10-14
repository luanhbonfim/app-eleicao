import { Router } from "express";
import CandidatoController from "../Controle/controleCandidato.js";

const rotaCandidato = Router();
const controleCandidato = new CandidatoController();

rotaCandidato
    .get('/', controleCandidato.consultar) // Retorna todos os candidatos
    .get('/:id', controleCandidato.consultar) // Retorna candidato por ID
    .post("/", controleCandidato.gravar) // Adiciona um novo candidato
    .put("/:id", controleCandidato.alterar) // Altera um candidato existente
    .patch("/:id", controleCandidato.alterar) // Atualiza parcialmente um candidato
    .delete("/:id", controleCandidato.excluir) // Remove um candidato por ID

export default rotaCandidato;
