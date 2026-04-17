const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend files (html, css, js) from the current root
app.use(express.static(path.join(__dirname, '.')));

// ----------------------------------------------------
// BANCO DE DADOS EM MEMÓRIA
// ----------------------------------------------------
const db = {
    usuarios: [],
    categorias: [],
    cursos: [],
    modulos: [],
    aulas: [],
    matriculas: [],
    progressoAulas: [],
    avaliacoes: [],
    trilhas: [],
    trilhasCursos: [],
    certificados: [],
    planos: [],
    assinaturas: [],
    pagamentos: []
};

// Initial Demo Data
db.usuarios.push({ ID_Usuario: 1, NomeCompleto: 'Admin', Email: 'admin@plataforma.com', SenhaHash: 'hashexample', DataCadastro: new Date() });
db.categorias.push({ ID_Categoria: 1, Nome: 'Programação', Descricao: 'Cursos de tecnologia e desenvolvimento de software' });
db.categorias.push({ ID_Categoria: 2, Nome: 'Design', Descricao: 'Cursos de UI/UX, Web Design e ferramentas gráficas' });
db.cursos.push({ ID_Curso: 1, Titulo: 'JavaScript do Zero', Descricao: 'Aprenda JS do básico ao avançado.', ID_Instrutor: 1, ID_Categoria: 1, Nivel: 'Iniciante', TotalAulas: 2, TotalHoras: 5, DataPublicacao: new Date() });
db.cursos.push({ ID_Curso: 2, Titulo: 'Mastering UI/UX', Descricao: 'Torne-se um mestre em design de interfaces.', ID_Instrutor: 1, ID_Categoria: 2, Nivel: 'Intermediário', TotalAulas: 1, TotalHoras: 3, DataPublicacao: new Date() });
db.modulos.push({ ID_Modulo: 1, ID_Curso: 1, Titulo: 'Introdução', Ordem: 1 });
db.modulos.push({ ID_Modulo: 2, ID_Curso: 1, Titulo: 'Funções Avançadas', Ordem: 2 });
db.modulos.push({ ID_Modulo: 3, ID_Curso: 2, Titulo: 'Figma Básico', Ordem: 1 });
db.aulas.push({ ID_Aula: 1, ID_Modulo: 1, Titulo: 'O que é JS?', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://video.url', DuracaoMinutos: 15, Ordem: 1 });
db.aulas.push({ ID_Aula: 2, ID_Modulo: 1, Titulo: 'Variáveis e Tipos', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://video.url', DuracaoMinutos: 30, Ordem: 2 });
db.aulas.push({ ID_Aula: 3, ID_Modulo: 3, Titulo: 'Interface do Figma', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://video.url', DuracaoMinutos: 25, Ordem: 1 });
db.planos.push({ ID_Plano: 1, Nome: 'Plano Mensal', Descricao: 'Acesso completo por 1 mês', Preco: 49.90, DuracaoMeses: 1 });
db.planos.push({ ID_Plano: 2, Nome: 'Plano Anual', Descricao: 'Acesso completo por 12 meses', Preco: 399.90, DuracaoMeses: 12 });

// Generic router for REST
app.get('/api/:colName', (req, res) => {
    const colName = req.params.colName;
    if (db[colName]) {
        res.json(db[colName]);
    } else {
        res.status(404).json({ error: 'Collection not found' });
    }
});

app.post('/api/:colName', (req, res) => {
    const colName = req.params.colName;
    if (db[colName]) {
        const item = req.body;
        db[colName].push(item);
        res.status(201).json(item);
    } else {
        res.status(404).json({ error: 'Collection not found' });
    }
});

// For any other route that doesn't match API and static files, send the index.html (SPA support if needed)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Backend simplificado rodando na porta ${port}`);
});
