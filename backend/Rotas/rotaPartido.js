import { Router } from "express";
import PartidoController from "../Controle/controlePartido.js";

const rotaPartido = Router();
const controlePartido = new PartidoController();

rotaPartido
    .get('/', controlePartido.consultar) 
    .get('/:num_registro', controlePartido.consultar) 
    .post("/", controlePartido.gravar)
    .put("/:num_registro", controlePartido.alterar)
    .patch("/:num_registro", controlePartido.alterar)
    .delete("/:num_registro", controlePartido.excluir) 

export default rotaPartido;
