class Usuario {
    constructor(id, nomeCompleto, email, senhaHash) {
        this.ID_Usuario = id;
        this.NomeCompleto = nomeCompleto;
        this.Email = email;
        this.SenhaHash = senhaHash;
        this.DataCadastro = new Date();
    }
}

class Categoria {
    constructor(id, nome, descricao) {
        this.ID_Categoria = id;
        this.Nome = nome;
        this.Descricao = descricao;
    }
}

class Curso {
    constructor(id, titulo, descricao, idInstrutor, idCategoria, nivel, totalAulas = 0, totalHoras = 0) {
        this.ID_Curso = id;
        this.Titulo = titulo;
        this.Descricao = descricao;
        this.ID_Instrutor = idInstrutor;
        this.ID_Categoria = idCategoria;
        this.Nivel = nivel;
        this.DataPublicacao = new Date();
        this.TotalAulas = totalAulas;
        this.TotalHoras = totalHoras;
    }
}

class Modulo {
    constructor(id, idCurso, titulo, ordem) {
        this.ID_Modulo = id;
        this.ID_Curso = idCurso;
        this.Titulo = titulo;
        this.Ordem = ordem;
    }
}

class Aula {
    constructor(id, idModulo, titulo, tipoConteudo, urlConteudo, duracaoMinutos, ordem) {
        this.ID_Aula = id;
        this.ID_Modulo = idModulo;
        this.Titulo = titulo;
        this.TipoConteudo = tipoConteudo;
        this.URL_Conteudo = urlConteudo;
        this.DuracaoMinutos = duracaoMinutos;
        this.Ordem = ordem;
    }
}

class Matricula {
    constructor(id, idUsuario, idCurso) {
        this.ID_Matricula = id;
        this.ID_Usuario = idUsuario;
        this.ID_Curso = idCurso;
        this.DataMatricula = new Date();
        this.DataConclusao = null;
    }
}

class ProgressoAula {
    constructor(idUsuario, idAula, status = 'Concluído') {
        this.ID_Usuario = idUsuario;
        this.ID_Aula = idAula;
        this.DataConclusao = new Date();
        this.Status = status;
    }
}

class Avaliacao {
    constructor(id, idUsuario, idCurso, nota, comentario = null) {
        this.ID_Avaliacao = id;
        this.ID_Usuario = idUsuario;
        this.ID_Curso = idCurso;
        this.Nota = nota;
        this.Comentario = comentario;
        this.DataAvaliacao = new Date();
    }
}

class Trilha {
    constructor(id, titulo, descricao, idCategoria) {
        this.ID_Trilha = id;
        this.Titulo = titulo;
        this.Descricao = descricao;
        this.ID_Categoria = idCategoria;
    }
}

class TrilhaCurso {
    constructor(idTrilha, idCurso, ordem) {
        this.ID_Trilha = idTrilha;
        this.ID_Curso = idCurso;
        this.Ordem = ordem;
    }
}

class Certificado {
    constructor(id, idUsuario, idCurso, idTrilha = null) {
        this.ID_Certificado = id;
        this.ID_Usuario = idUsuario;
        this.ID_Curso = idCurso;
        this.ID_Trilha = idTrilha;
        this.CodigoVerificacao = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.DataEmissao = new Date();
    }
}

class Plano {
    constructor(id, nome, descricao, preco, duracaoMeses) {
        this.ID_Plano = id;
        this.Nome = nome;
        this.Descricao = descricao;
        this.Preco = preco;
        this.DuracaoMeses = duracaoMeses;
    }
}

class Assinatura {
    constructor(id, idUsuario, idPlano, dataInicio, dataFim) {
        this.ID_Assinatura = id;
        this.ID_Usuario = idUsuario;
        this.ID_Plano = idPlano;
        this.DataInicio = dataInicio;
        this.DataFim = dataFim;
    }
}

class Pagamento {
    constructor(id, idAssinatura, valorPago, metodoPagamento, idTransacaoGateway) {
        this.ID_Pagamento = id;
        this.ID_Assinatura = idAssinatura;
        this.ValorPago = valorPago;
        this.DataPagamento = new Date();
        this.MetodoPagamento = metodoPagamento;
        this.Id_Transacao_Gateway = idTransacaoGateway;
    }
}
