import express from 'express';
import cors from 'cors';
import rotaPartido from './Rotas/rotaPartido.js';
import rotaCandidato from './Rotas/rotaCandidato.js';

const app = express();

// Habilitar CORS para todas as rotas
app.use(cors());

const host = '0.0.0.0';
const port = 4000;

app.use(express.json());

app.use('/partidos', rotaPartido);
app.use('/candidatos', rotaCandidato);

app.listen(port, host, () => {
    console.log(`Servidor iniciado em http://${host}:${port}`);
})