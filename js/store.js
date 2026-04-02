class Store {
    constructor() {
        this.usuarios = [];
        this.categorias = [];
        this.cursos = [];
        this.modulos = [];
        this.aulas = [];
        this.matriculas = [];
        this.progressoAulas = [];
        this.avaliacoes = [];
        this.trilhas = [];
        this.trilhasCursos = [];
        this.certificados = [];
        this.planos = [];
        this.assinaturas = [];
        this.pagamentos = [];
        
        this.initDemoData();
    }

    initDemoData() {
        // Initial Admin User
        this.usuarios.push(new Usuario(1, 'Admin', 'admin@plataforma.com', 'hashexample'));

        // Categorias
        this.categorias.push(new Categoria(1, 'Programação', 'Cursos de tecnologia e desenvolvimento de software'));
        this.categorias.push(new Categoria(2, 'Design', 'Cursos de UI/UX, Web Design e ferramentas gráficas'));

        // Cursos
        this.cursos.push(new Curso(1, 'JavaScript do Zero', 'Aprenda JS do básico ao avançado.', 1, 1, 'Iniciante', 2, 5));
        this.cursos.push(new Curso(2, 'Mastering UI/UX', 'Torne-se um mestre em design de interfaces.', 1, 2, 'Intermediário', 1, 3));

        // Modulos (JS course)
        this.modulos.push(new Modulo(1, 1, 'Introdução', 1));
        this.modulos.push(new Modulo(2, 1, 'Funções Avançadas', 2));

        // Modulos (Design course)
        this.modulos.push(new Modulo(3, 2, 'Figma Básico', 1));

        // Aulas
        this.aulas.push(new Aula(1, 1, 'O que é JS?', 'Vídeo', 'https://video.url', 15, 1));
        this.aulas.push(new Aula(2, 1, 'Variáveis e Tipos', 'Vídeo', 'https://video.url', 30, 2));
        this.aulas.push(new Aula(3, 3, 'Interface do Figma', 'Vídeo', 'https://video.url', 25, 1));
        
        // Planos
        this.planos.push(new Plano(1, 'Plano Mensal', 'Acesso completo por 1 mês', 49.90, 1));
        this.planos.push(new Plano(2, 'Plano Anual', 'Acesso completo por 12 meses', 399.90, 12));
    }

    // Generic add
    add(colName, item) {
        if (this[colName]) {
            this[colName].push(item);
        }
    }

    // Generic get
    getAll(colName) {
        return this[colName] || [];
    }

    generateId(colName) {
        if (!this[colName] || this[colName].length === 0) return 1;
        // Assume all objects store their primary key in property corresponding to ID_ClassName
        // We will just generate an incrementing long to be safe, or just max+1
        return this[colName].length + 1; 
    }
}

const db = new Store();
