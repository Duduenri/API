import express from 'express';
import routesHoteis from './routes/hoteis'; // Importando as rotas dos hotéis

const app = express();
const port = 3001;

// Middleware para interpretar JSON
app.use(express.json());

// Rota principal para gerenciar hotéis
app.use("/hoteis", routesHoteis);

// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('API de Gerenciamento de Hotéis');
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
