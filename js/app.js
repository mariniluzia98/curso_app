// Navigation Logic
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active class
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show correct section
        const targetId = e.target.getAttribute('data-target');
        switchTab(targetId);
    });
});

function switchTab(sectionId) {
    document.querySelectorAll('.module-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if(targetSection) {
        targetSection.classList.add('active');
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('data-target') === sectionId) {
                l.classList.add('active');
            }
        });
    }
}

// Initialization and Rendering
document.addEventListener('DOMContentLoaded', async () => {
    await renderCursos();
    await renderUsuarios();
    await populateSelects();
    await renderPagamentos();
});

async function populateSelects() {
    // Populate Categorias
    const catSelect = document.getElementById('curso-categoria');
    if(catSelect) {
        catSelect.innerHTML = '<option value="" disabled selected>Selecione uma categoria...</option>';
        const categorias = await db.getAll('categorias');
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.ID_Categoria;
            opt.textContent = cat.Nome;
            catSelect.appendChild(opt);
        });
    }

    // Populate Instrutores
    const instSelect = document.getElementById('curso-instrutor');
    const userSelects = [instSelect, document.getElementById('checkout-usuario')];
    const usuarios = await db.getAll('usuarios');
    userSelects.forEach(select => {
        if(select) {
            select.innerHTML = '<option value="" disabled selected>Selecione um usuário/instrutor...</option>';
            usuarios.forEach(user => {
                const opt = document.createElement('option');
                opt.value = user.ID_Usuario;
                opt.textContent = user.NomeCompleto;
                select.appendChild(opt);
            });
        }
    });

    // Populate Planos
    const planSelect = document.getElementById('checkout-plano');
    if(planSelect) {
        planSelect.innerHTML = '<option value="" disabled selected>Selecione um plano...</option>';
        const planos = await db.getAll('planos');
        planos.forEach(plan => {
            const opt = document.createElement('option');
            opt.value = plan.ID_Plano;
            opt.textContent = `${plan.Nome} - R$ ${plan.Preco.toFixed(2)}`;
            planSelect.appendChild(opt);
        });
    }
}

// Rendering Cursos
async function renderCursos() {
    const list = document.getElementById('cursos-list');
    if(!list) return;
    list.innerHTML = '';

    const cursos = await db.getAll('cursos');
    if (cursos.length === 0) {
        list.innerHTML = `<div class="col-12"><p class="text-muted">Nenhum curso cadastrado.</p></div>`;
        return;
    }

    const categorias = await db.getAll('categorias');

    cursos.forEach(curso => {
        const cat = categorias.find(c => c.ID_Categoria == curso.ID_Categoria);
        list.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <span class="badge badge-custom mb-3">${cat ? cat.Nome : 'Sem Categoria'}</span>
                        <h5 class="card-title fw-bold">${curso.Titulo}</h5>
                        <p class="card-text text-muted small">${curso.Descricao}</p>
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <span class="text-primary fw-bold small"><i class="bi bi-bar-chart me-1"></i>${curso.Nivel}</span>
                            <span class="text-muted small"><i class="bi bi-clock me-1"></i>${curso.TotalHoras}h</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top-0 pb-3">
                        <button class="btn btn-outline-primary btn-sm w-100" onclick="abrirModalModulos(${curso.ID_Curso})">Ver Estrutura (Módulos & Aulas)</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Rendering Usuarios
async function renderUsuarios() {
    const list = document.getElementById('usuarios-list');
    if(!list) return;
    list.innerHTML = '';

    const usuarios = await db.getAll('usuarios');
    usuarios.forEach(user => {
        // user.DataCadastro may be a string from JSON now, so handle that
        const dataCad = new Date(user.DataCadastro);
        const dateStr = dataCad.toLocaleDateString('pt-BR');
        list.innerHTML += `
            <tr>
                <td>#${user.ID_Usuario}</td>
                <td class="fw-bold">${user.NomeCompleto}</td>
                <td>${user.Email}</td>
                <td>${dateStr}</td>
                <td>
                    <button class="btn btn-sm btn-light border"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light border text-danger"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// Rendering Pagamentos
async function renderPagamentos() {
    const list = document.getElementById('pagamentos-list');
    if(!list) return;
    list.innerHTML = '';

    const pagamentos = await db.getAll('pagamentos');
    if(pagamentos.length === 0){
        list.innerHTML = `<p class="text-muted">Nenhum pagamento registrado ainda.</p>`;
        return;
    }

    // Sort by recent
    const sorted = [...pagamentos].reverse();

    sorted.forEach(pag => {
        const dataPag = new Date(pag.DataPagamento);
        list.innerHTML += `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 rounded border">
                <div>
                    <h6 class="mb-1 fw-bold">Transação #${pag.Id_Transacao_Gateway}</h6>
                    <small class="text-muted">Método: ${pag.MetodoPagamento} | ${dataPag.toLocaleDateString()}</small>
                </div>
                <span class="badge bg-success rounded-pill px-3 py-2">R$ ${pag.ValorPago.toFixed(2)}</span>
            </div>
        `;
    });
}

// Form Handlers
document.getElementById('form-curso')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const titulo = document.getElementById('curso-titulo').value;
    const descricao = document.getElementById('curso-descricao').value;
    const nivel = document.getElementById('curso-nivel').value;
    const categoria = parseInt(document.getElementById('curso-categoria').value);
    const instrutor = parseInt(document.getElementById('curso-instrutor').value);

    const novoId = await db.generateId('cursos');
    const novoCurso = new Curso(novoId, titulo, descricao, instrutor, categoria, nivel, 0, 0);
    
    await db.add('cursos', novoCurso);
    await renderCursos();
    bootstrap.Modal.getInstance(document.getElementById('modal-curso')).hide();
    this.reset();
});

document.getElementById('form-usuario')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nome = document.getElementById('usuario-nome').value;
    const email = document.getElementById('usuario-email').value;
    const senha = document.getElementById('usuario-senha').value;

    const novoId = await db.generateId('usuarios');
    const novoUsuario = new Usuario(novoId, nome, email, senha);
    
    await db.add('usuarios', novoUsuario);
    await renderUsuarios();
    await populateSelects(); // update selects in form
    bootstrap.Modal.getInstance(document.getElementById('modal-usuario')).hide();
    this.reset();
});

document.getElementById('form-checkout')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const idUsuario = parseInt(document.getElementById('checkout-usuario').value);
    const idPlano = parseInt(document.getElementById('checkout-plano').value);
    const metodo = document.getElementById('checkout-metodo').value;

    const planos = await db.getAll('planos');
    const plano = planos.find(p => p.ID_Plano === idPlano);
    
    // Create Assinatura
    const idAssinatura = await db.generateId('assinaturas');
    const dataInicio = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + plano.DuracaoMeses);
    
    const novaAssinatura = new Assinatura(idAssinatura, idUsuario, idPlano, dataInicio, dataFim);
    await db.add('assinaturas', novaAssinatura);

    // Create Pagamento
    const idPagamento = await db.generateId('pagamentos');
    const randTx = 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const novoPagamento = new Pagamento(idPagamento, idAssinatura, plano.Preco, metodo, randTx);
    await db.add('pagamentos', novoPagamento);

    await renderPagamentos();
    alert('Assinatura e Pagamento processados com sucesso!');
    this.reset();
});

// Logic for Modules and Classes 
let cursoAtualId = null;

async function abrirModalModulos(idCurso) {
    cursoAtualId = idCurso;
    const cursos = await db.getAll('cursos');
    const curso = cursos.find(c => c.ID_Curso === idCurso);
    document.getElementById('modal-modulos-title').textContent = `Estrutura do Curso: ${curso.Titulo}`;
    
    // Set hidden field
    document.getElementById('modulo-id-curso').value = idCurso;
    
    await renderAccordionModulos(idCurso);
    const modModal = new bootstrap.Modal(document.getElementById('modal-modulos-aulas'));
    modModal.show();
}

async function renderAccordionModulos(idCurso) {
    const accordion = document.getElementById('accordion-modulos');
    accordion.innerHTML = '';

    const allModulos = await db.getAll('modulos');
    const modulos = allModulos.filter(m => m.ID_Curso === idCurso).sort((a,b) => a.Ordem - b.Ordem);
    const aulas = await db.getAll('aulas');

    if (modulos.length === 0) {
        accordion.innerHTML = '<p class="text-muted mt-3 text-center">Nenhum módulo cadastrado para este curso.</p>';
        return;
    }

    modulos.forEach((mod, index) => {
        const idCollapse = `collapse-mod-${mod.ID_Modulo}`;
        const aulasDoModulo = aulas.filter(a => a.ID_Modulo === mod.ID_Modulo).sort((a,b) => a.Ordem - b.Ordem);
        
        let aulasHtml = '';
        if(aulasDoModulo.length === 0) {
            aulasHtml = '<p class="small text-muted mb-0">Nenhuma aula cadastrada neste módulo.</p>';
        } else {
            aulasHtml = `<ul class="list-group list-group-flush mb-0">`;
            aulasDoModulo.forEach(aula => {
                let iconClass = 'bi-play-circle-fill text-danger';
                if(aula.TipoConteudo === 'Texto') iconClass = 'bi-file-earmark-text-fill text-primary';
                if(aula.TipoConteudo === 'Quiz') iconClass = 'bi-patch-question-fill text-success';

                aulasHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <div>
                            <i class="bi ${iconClass} me-2"></i>
                            <strong>${aula.Ordem}.</strong> ${aula.Titulo} <span class="badge bg-secondary ms-2">${aula.DuracaoMinutos} min</span>
                        </div>
                    </li>
                `;
            });
            aulasHtml += `</ul>`;
        }

        const isFirst = index === 0;
        accordion.innerHTML += `
            <div class="accordion-item border-0 mb-2 rounded shadow-sm">
                <h2 class="accordion-header" id="heading-${mod.ID_Modulo}">
                    <button class="accordion-button ${isFirst ? '' : 'collapsed'} fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#${idCollapse}">
                        <span class="text-primary me-2">Módulo ${mod.Ordem}:</span> ${mod.Titulo}
                    </button>
                </h2>
                <div id="${idCollapse}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" data-bs-parent="#accordion-modulos">
                    <div class="accordion-body p-0">
                        ${aulasHtml}
                        <div class="p-3 bg-white border-top text-end">
                            <button class="btn btn-sm btn-outline-primary" onclick="abrirModalNovaAula(${mod.ID_Modulo})">
                                <i class="bi bi-plus-lg"></i> Adicionar Aula
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

window.abrirModalNovoModulo = async function() {
    const allModulos = await db.getAll('modulos');
    const maxOrdem = allModulos
        .filter(m => m.ID_Curso === cursoAtualId)
        .reduce((max, m) => m.Ordem > max ? m.Ordem : max, 0);
    document.getElementById('modulo-ordem').value = maxOrdem + 1;
    document.getElementById('modulo-id-curso').value = cursoAtualId;
    
    // Hide current modal if needed theoretically, but we can stack them using z-index properly. Bootstrap handles stacked modals okay in BS5.
    const newModModal = new bootstrap.Modal(document.getElementById('modal-novo-modulo'));
    newModModal.show();
}

window.abrirModalNovaAula = async function(idModulo) {
    const allAulas = await db.getAll('aulas');
    const maxOrdem = allAulas
        .filter(a => a.ID_Modulo === idModulo)
        .reduce((max, a) => a.Ordem > max ? a.Ordem : max, 0);
        
    document.getElementById('aula-id-modulo').value = idModulo;
    document.getElementById('aula-ordem').value = maxOrdem + 1;

    const newAulaModal = new bootstrap.Modal(document.getElementById('modal-nova-aula'));
    newAulaModal.show();
}

document.getElementById('form-modulo')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const titulo = document.getElementById('modulo-titulo').value;
    const ordem = parseInt(document.getElementById('modulo-ordem').value);
    const idCurso = parseInt(document.getElementById('modulo-id-curso').value);

    const novoId = await db.generateId('modulos');
    const novoModulo = new Modulo(novoId, idCurso, titulo, ordem);
    await db.add('modulos', novoModulo);

    await renderAccordionModulos(idCurso);
    bootstrap.Modal.getInstance(document.getElementById('modal-novo-modulo')).hide();
    this.reset();
});

document.getElementById('form-aula')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const titulo = document.getElementById('aula-titulo').value;
    const tipo = document.getElementById('aula-tipo').value;
    const duracao = parseInt(document.getElementById('aula-duracao').value);
    const url = document.getElementById('aula-url').value;
    const ordem = parseInt(document.getElementById('aula-ordem').value);
    const idModulo = parseInt(document.getElementById('aula-id-modulo').value);

    const novoId = await db.generateId('aulas');
    const novaAula = new Aula(novoId, idModulo, titulo, tipo, url, duracao, ordem);
    await db.add('aulas', novaAula);

    // Get active course from global state
    await renderAccordionModulos(cursoAtualId);
    bootstrap.Modal.getInstance(document.getElementById('modal-nova-aula')).hide();
    this.reset();
});
