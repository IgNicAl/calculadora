document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcular');
    let grafico = null;

    // Verificar se estamos rodando no Electron
    const isElectron = typeof window.electronAPI !== 'undefined';
    
    // Se estiver no Electron, configurar os manipuladores de eventos para salvar/carregar
    if (isElectron) {
        // Ouvir eventos de salvamento de cálculo
        window.electronAPI.salvarCalculo((event, filePath) => {
            salvarCalculoParaArquivo(filePath);
        });
        
        // Ouvir eventos de carregamento de cálculo
        window.electronAPI.carregarCalculo((event, data) => {
            carregarCalculoDeArquivo(data);
        });
    }
    
    // Função para salvar o cálculo atual para um arquivo
    function salvarCalculoParaArquivo(filePath) {
        try {
            // Coletar todos os valores de input
            const calculoData = {
                valorInicial: document.getElementById('valorInicial').value,
                moedaValorInicial: document.getElementById('moedaValorInicial').value,
                aporteMensal: document.getElementById('aporteMensal').value,
                moedaAporteMensal: document.getElementById('moedaAporteMensal').value,
                taxaCambio: document.getElementById('taxaCambio').value,
                taxaCambioEuro: document.getElementById('taxaCambioEuro').value,
                juros: document.getElementById('juros').value,
                periodoJuros: document.getElementById('periodoJuros').value,
                inicioRetirada: document.getElementById('inicioRetirada').value,
                tipoRetirada: document.getElementById('tipoRetirada').value,
                habilitarRetiradaBRL: document.getElementById('habilitarRetiradaBRL').checked,
                habilitarRetiradaUSD: document.getElementById('habilitarRetiradaUSD').checked,
                habilitarRetiradaEUR: document.getElementById('habilitarRetiradaEUR').checked,
                retiradaMensalBRL: document.getElementById('retiradaMensalBRL').value,
                retiradaMensalUSD: document.getElementById('retiradaMensalUSD').value,
                retiradaMensalEUR: document.getElementById('retiradaMensalEUR').value,
                percentualLucroBRL: document.getElementById('percentualLucroBRL').value,
                percentualLucroUSD: document.getElementById('percentualLucroUSD').value,
                percentualLucroEUR: document.getElementById('percentualLucroEUR').value,
                aumentoRetirada: document.getElementById('aumentoRetirada').checked,
                periodoAumento: document.getElementById('periodoAumento').value,
                valorAumento: document.getElementById('valorAumento').value,
                periodoProjecao: document.getElementById('periodoProjecao').value,
                versaoApp: isElectron ? window.electronAPI.getVersion() : '1.0.0',
                dataCalculo: new Date().toISOString()
            };
            
            // Usar a API do Electron para salvar os dados
            if (isElectron) {
                const fs = require('fs');
                fs.writeFileSync(filePath, JSON.stringify(calculoData, null, 2), 'utf8');
                exibirAlerta(`Cálculo salvo com sucesso em: ${filePath}`);
            } else {
                // Fallback para navegadores: download do arquivo
                const blob = new Blob([JSON.stringify(calculoData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'calculo-financeiro.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                exibirAlerta('Cálculo salvo como download');
            }
        } catch (error) {
            console.error('Erro ao salvar cálculo:', error);
            exibirAlerta('Erro ao salvar cálculo: ' + error.message);
        }
    }
    
    // Função para carregar cálculo de um arquivo
    function carregarCalculoDeArquivo(jsonData) {
        try {
            const calculoData = JSON.parse(jsonData);
            
            // Preencher os campos com os dados carregados
            if (calculoData.valorInicial) document.getElementById('valorInicial').value = calculoData.valorInicial;
            if (calculoData.moedaValorInicial) document.getElementById('moedaValorInicial').value = calculoData.moedaValorInicial;
            if (calculoData.aporteMensal) document.getElementById('aporteMensal').value = calculoData.aporteMensal;
            if (calculoData.moedaAporteMensal) document.getElementById('moedaAporteMensal').value = calculoData.moedaAporteMensal;
            if (calculoData.taxaCambio) document.getElementById('taxaCambio').value = calculoData.taxaCambio;
            if (calculoData.taxaCambioEuro) document.getElementById('taxaCambioEuro').value = calculoData.taxaCambioEuro;
            if (calculoData.juros) document.getElementById('juros').value = calculoData.juros;
            if (calculoData.periodoJuros) document.getElementById('periodoJuros').value = calculoData.periodoJuros;
            if (calculoData.inicioRetirada) document.getElementById('inicioRetirada').value = calculoData.inicioRetirada;
            if (calculoData.tipoRetirada) document.getElementById('tipoRetirada').value = calculoData.tipoRetirada;
            
            if (calculoData.hasOwnProperty('habilitarRetiradaBRL')) 
                document.getElementById('habilitarRetiradaBRL').checked = calculoData.habilitarRetiradaBRL;
            if (calculoData.hasOwnProperty('habilitarRetiradaUSD')) 
                document.getElementById('habilitarRetiradaUSD').checked = calculoData.habilitarRetiradaUSD;
            if (calculoData.hasOwnProperty('habilitarRetiradaEUR')) 
                document.getElementById('habilitarRetiradaEUR').checked = calculoData.habilitarRetiradaEUR;
                
            if (calculoData.retiradaMensalBRL) document.getElementById('retiradaMensalBRL').value = calculoData.retiradaMensalBRL;
            if (calculoData.retiradaMensalUSD) document.getElementById('retiradaMensalUSD').value = calculoData.retiradaMensalUSD;
            if (calculoData.retiradaMensalEUR) document.getElementById('retiradaMensalEUR').value = calculoData.retiradaMensalEUR;
            if (calculoData.percentualLucroBRL) document.getElementById('percentualLucroBRL').value = calculoData.percentualLucroBRL;
            if (calculoData.percentualLucroUSD) document.getElementById('percentualLucroUSD').value = calculoData.percentualLucroUSD;
            if (calculoData.percentualLucroEUR) document.getElementById('percentualLucroEUR').value = calculoData.percentualLucroEUR;
            
            if (calculoData.hasOwnProperty('aumentoRetirada')) 
                document.getElementById('aumentoRetirada').checked = calculoData.aumentoRetirada;
            if (calculoData.periodoAumento) document.getElementById('periodoAumento').value = calculoData.periodoAumento;
            if (calculoData.valorAumento) document.getElementById('valorAumento').value = calculoData.valorAumento;
            if (calculoData.periodoProjecao) document.getElementById('periodoProjecao').value = calculoData.periodoProjecao;
            
            // Atualizar a exibição dos campos de acordo com as opções
            document.querySelectorAll('input[type="text"].input-number').forEach(input => {
                const extensoElement = document.getElementById(`${input.id}Extenso`);
                if (extensoElement) {
                    if (input.id === 'valorInicial' || input.id === 'aporteMensal' || 
                        input.id.startsWith('retiradaMensal')) {
                        const seletorMoeda = document.getElementById(`moeda${input.id.charAt(0).toUpperCase() + input.id.slice(1)}`);
                        if (seletorMoeda) {
                            const tipoMoeda = seletorMoeda.value === 'BRL' ? 'real' : 
                                             (seletorMoeda.value === 'USD' ? 'dolar' : 'euro');
                            atualizarExtenso(input.value, extensoElement, 'monetario', tipoMoeda);
                        } else {
                            atualizarExtenso(input.value, extensoElement, 'monetario');
                        }
                    } else if (input.id.includes('percentual') || input.id === 'juros' || input.id === 'valorAumento') {
                        atualizarExtenso(input.value, extensoElement, 'percentual');
                    } else {
                        atualizarExtenso(input.value, extensoElement, 'monetario');
                    }
                }
            });
            
            // Disparar eventos de change nos campos importantes para atualizar a UI
            const tipoRetiradaSelect = document.getElementById('tipoRetirada');
            tipoRetiradaSelect.dispatchEvent(new Event('change'));
            
            document.getElementById('habilitarRetiradaBRL').dispatchEvent(new Event('change'));
            document.getElementById('habilitarRetiradaUSD').dispatchEvent(new Event('change'));
            document.getElementById('habilitarRetiradaEUR').dispatchEvent(new Event('change'));
            
            // Executar o cálculo com os novos valores
            calcularProjecao();
            
            exibirAlerta('Cálculo carregado com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar cálculo:', error);
            exibirAlerta('Erro ao carregar cálculo: ' + error.message);
        }
    }
    
    // Adicionar funcionalidade para botões de upload/download se não estivermos no Electron
    if (!isElectron) {
        // Adicionar botões de salvar/carregar na interface se não estiver no Electron
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        actionButtons.innerHTML = `
            <button id="btnSalvar" class="btn-action">Salvar Cálculo</button>
            <button id="btnCarregar" class="btn-action">Carregar Cálculo</button>
            <input type="file" id="fileInput" accept=".json" style="display: none;">
        `;
        
        // Inserir após o botão de calcular
        calcularBtn.parentNode.insertBefore(actionButtons, calcularBtn.nextSibling);
        
        // Configurar eventos para os botões
        document.getElementById('btnSalvar').addEventListener('click', () => {
            salvarCalculoParaArquivo();
        });
        
        document.getElementById('btnCarregar').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    carregarCalculoDeArquivo(event.target.result);
                };
                reader.readAsText(file);
            }
        });
    }
    
    // Resto do código existente...
    // Configurar alternância entre tipos de retirada
    const tipoRetiradaSelect = document.getElementById('tipoRetirada');
    
    // Elementos para retiradas em múltiplas moedas
    const retiradaMoedas = [
        {
            moeda: 'BRL',
            simbolo: 'R$',
            nome: 'real',
            nomePlural: 'reais',
            checkboxId: 'habilitarRetiradaBRL',
            grupoId: 'retiradaBRLGroup',
            grupoFixoId: 'retiradaFixaGroupBRL',
            grupoPercentualId: 'retiradaPercentualGroupBRL',
            inputFixoId: 'retiradaMensalBRL',
            inputPercentualId: 'percentualLucroBRL',
            extensoFixoId: 'retiradaMensalBRLExtenso',
            extensoPercentualId: 'percentualLucroBRLExtenso'
        },
        {
            moeda: 'USD',
            simbolo: 'US$',
            nome: 'dolar',
            nomePlural: 'dólares',
            checkboxId: 'habilitarRetiradaUSD',
            grupoId: 'retiradaUSDGroup',
            grupoFixoId: 'retiradaFixaGroupUSD',
            grupoPercentualId: 'retiradaPercentualGroupUSD',
            inputFixoId: 'retiradaMensalUSD',
            inputPercentualId: 'percentualLucroUSD',
            extensoFixoId: 'retiradaMensalUSDExtenso',
            extensoPercentualId: 'percentualLucroUSDExtenso'
        },
        {
            moeda: 'EUR',
            simbolo: '€',
            nome: 'euro',
            nomePlural: 'euros',
            checkboxId: 'habilitarRetiradaEUR',
            grupoId: 'retiradaEURGroup',
            grupoFixoId: 'retiradaFixaGroupEUR',
            grupoPercentualId: 'retiradaPercentualGroupEUR',
            inputFixoId: 'retiradaMensalEUR',
            inputPercentualId: 'percentualLucroEUR',
            extensoFixoId: 'retiradaMensalEURExtenso',
            extensoPercentualId: 'percentualLucroEURExtenso'
        }
    ];
    
    // Verificar se todos os elementos existem no DOM
    retiradaMoedas.forEach(config => {
        console.log(`Verificando elementos para ${config.moeda}:`);
        console.log(`  Checkbox: ${!!document.getElementById(config.checkboxId)}`);
        console.log(`  Grupo: ${!!document.getElementById(config.grupoId)}`);
        console.log(`  Grupo Fixo: ${!!document.getElementById(config.grupoFixoId)}`);
        console.log(`  Grupo Percentual: ${!!document.getElementById(config.grupoPercentualId)}`);
        console.log(`  Input Fixo: ${!!document.getElementById(config.inputFixoId)}`);
        console.log(`  Input Percentual: ${!!document.getElementById(config.inputPercentualId)}`);
    });
    
    // Configurar eventos para cada moeda
    retiradaMoedas.forEach(moedaConfig => {
        const checkbox = document.getElementById(moedaConfig.checkboxId);
        const grupo = document.getElementById(moedaConfig.grupoId);
        const grupoFixo = document.getElementById(moedaConfig.grupoFixoId);
        const grupoPercentual = document.getElementById(moedaConfig.grupoPercentualId);
        
        // Evento para mostrar/ocultar o grupo de retirada baseado no checkbox
        if (checkbox && grupo) {
            checkbox.addEventListener('change', () => {
                grupo.style.display = checkbox.checked ? 'block' : 'none';
            });
        }
    });
    
    // Manipulação dos seletores de moeda para valor inicial e aportes
    const moedaValorInicial = document.getElementById('moedaValorInicial');
    const moedaAporteMensal = document.getElementById('moedaAporteMensal');
    
    // Atualizar rótulo da moeda quando o seletor mudar
    function atualizarRotuloMoeda(seletorMoeda, elementoLabel) {
        const label = document.querySelector(`label[for="${elementoLabel}"]`);
        if (label) {
            let moeda = 'R$';
            if (seletorMoeda.value === 'USD') {
                moeda = 'US$';
            } else if (seletorMoeda.value === 'EUR') {
                moeda = '€';
            }
            
            // Manter texto atual do label, apenas substituindo a moeda se já existir
            const textoAtual = label.textContent;
            if (textoAtual.includes('R$') || textoAtual.includes('US$') || textoAtual.includes('€')) {
                label.textContent = textoAtual.replace(/(R\$|US\$|€)/, moeda);
            } else {
                label.textContent = `${textoAtual.replace(/\:$/, '')} (${moeda}):`;
            }
        }
    }
    
    // Configurar eventos para atualizar rótulos quando mudar a moeda
    moedaValorInicial.addEventListener('change', () => {
        atualizarRotuloMoeda(moedaValorInicial, 'valorInicial');
        atualizarExtensoComMoeda('valorInicial');
    });
    
    moedaAporteMensal.addEventListener('change', () => {
        atualizarRotuloMoeda(moedaAporteMensal, 'aporteMensal');
        atualizarExtensoComMoeda('aporteMensal');
    });
    
    // Inicializar rótulos de moeda
    atualizarRotuloMoeda(moedaValorInicial, 'valorInicial');
    atualizarRotuloMoeda(moedaAporteMensal, 'aporteMensal');
    
    // Atualizar o valor por extenso com a moeda correta
    function atualizarExtensoComMoeda(campoId) {
        const input = document.getElementById(campoId);
        const extensoElement = document.getElementById(`${campoId}Extenso`);
        const seletorMoeda = document.getElementById(`moeda${campoId.charAt(0).toUpperCase() + campoId.slice(1)}`);
        
        // Se o elemento extenso ou o seletor não existe, retornar
        if (!extensoElement || !seletorMoeda) return;
        
        const valor = input.value;
        const tipoMoeda = seletorMoeda.value === 'BRL' ? 'real' : 
                         (seletorMoeda.value === 'USD' ? 'dolar' : 'euro');
        
        atualizarExtenso(valor, extensoElement, 'monetario', tipoMoeda);
    }
    
    // Alterna visibilidade dos campos de retirada conforme o tipo selecionado
    tipoRetiradaSelect.addEventListener('change', () => {
        const tipoRetirada = tipoRetiradaSelect.value;
        console.log(`Tipo de retirada alterado para: ${tipoRetirada}`);
        
        retiradaMoedas.forEach(moedaConfig => {
            const grupoFixo = document.getElementById(moedaConfig.grupoFixoId);
            const grupoPercentual = document.getElementById(moedaConfig.grupoPercentualId);
            
            if (grupoFixo && grupoPercentual) {
                console.log(`Configurando grupos para ${moedaConfig.moeda} - fixo: ${!!grupoFixo}, percentual: ${!!grupoPercentual}`);
                
                if (tipoRetirada === 'fixo') {
                    grupoFixo.style.display = 'block';
                    grupoPercentual.style.display = 'none';
                } else {
                    grupoFixo.style.display = 'none';
                    grupoPercentual.style.display = 'block';
                }
            }
        });
        
        // Recalcular após mudança de modo
        calcularProjecao();
    });

    // Adicionar evento de formatação para todos os campos de input numéricos
    const camposNumericos = [
        { id: 'taxaCambio', extensoId: 'taxaCambioExtenso', tipo: 'monetario' },
        { id: 'taxaCambioEuro', extensoId: 'taxaCambioEuroExtenso', tipo: 'monetario' },
        { id: 'valorInicial', extensoId: 'valorInicialExtenso', tipo: 'monetario' },
        { id: 'aporteMensal', extensoId: 'aporteMensalExtenso', tipo: 'monetario' },
        { id: 'retiradaMensalBRL', extensoId: 'retiradaMensalBRLExtenso', tipo: 'monetario' },
        { id: 'retiradaMensalUSD', extensoId: 'retiradaMensalUSDExtenso', tipo: 'monetario' },
        { id: 'retiradaMensalEUR', extensoId: 'retiradaMensalEURExtenso', tipo: 'monetario' },
        { id: 'percentualLucroBRL', extensoId: 'percentualLucroBRLExtenso', tipo: 'percentual' },
        { id: 'percentualLucroUSD', extensoId: 'percentualLucroUSDExtenso', tipo: 'percentual' },
        { id: 'percentualLucroEUR', extensoId: 'percentualLucroEURExtenso', tipo: 'percentual' },
        { id: 'juros', extensoId: 'jurosExtenso', tipo: 'percentual' },
        { id: 'valorAumento', extensoId: 'valorAumentoExtenso', tipo: 'percentual' }
    ];

    // Armazenar os buffers para todos os campos
    const buffers = {};

    camposNumericos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const extensoElement = document.getElementById(campo.extensoId);
        
        // Inicializa o buffer para este campo
        buffers[campo.id] = '';
        
        // Inicializa os valores por extenso na carga da página
        if (campo.id === 'valorInicial' || campo.id === 'aporteMensal' || 
            campo.id === 'retiradaMensalBRL' || campo.id === 'retiradaMensalUSD' || campo.id === 'retiradaMensalEUR') {
            const seletorMoeda = document.getElementById(`moeda${campo.id.charAt(0).toUpperCase() + campo.id.slice(1)}`);
            if (seletorMoeda) {
                const tipoMoeda = seletorMoeda.value === 'BRL' ? 'real' : 
                                 (seletorMoeda.value === 'USD' ? 'dolar' : 'euro');
                atualizarExtenso(input.value, extensoElement, campo.tipo, tipoMoeda);
            } else {
                atualizarExtenso(input.value, extensoElement, campo.tipo);
            }
        } else {
            atualizarExtenso(input.value, extensoElement, campo.tipo);
        }
        
        // Seleciona todo o conteúdo quando o campo recebe foco
        input.addEventListener('focus', (e) => {
            e.target.select();
        });
        
        // Seleciona todo o conteúdo ao clicar
        input.addEventListener('click', (e) => {
            e.target.select();
        });
        
        input.addEventListener('keydown', (e) => {
            // Captura apenas teclas numéricas e controles
            const tecla = e.key;
            
            // Tratar tecla Backspace para remover o último dígito do buffer
            if (tecla === 'Backspace') {
                e.preventDefault(); // Impede o comportamento padrão
                
                // Remove o último dígito do buffer
                if (buffers[campo.id].length > 0) {
                    buffers[campo.id] = buffers[campo.id].slice(0, -1);
                }
                
                // Se o buffer ficou vazio, define valor zero
                if (buffers[campo.id] === '') {
                    input.value = campo.tipo === 'monetario' ? '0,00' : '0,00';
                } else {
                    // Atualiza o valor com o buffer modificado
                    if (campo.tipo === 'monetario') {
                        // Converter buffer para valor monetário
                        const valorCentavos = parseInt(buffers[campo.id], 10);
                        const valorReais = valorCentavos / 100;
                        input.value = formatarNumero(valorReais, 2);
                    } else {
                        // Converter buffer para valor percentual
                        const valorCentesimos = parseInt(buffers[campo.id], 10);
                        const valorPercentual = valorCentesimos / 100;
                        input.value = formatarNumero(valorPercentual, 2);
                    }
                }
                
                // Atualizar o valor por extenso com a moeda adequada
                if (campo.id === 'valorInicial' || campo.id === 'aporteMensal' || 
                    campo.id === 'retiradaMensalBRL' || campo.id === 'retiradaMensalUSD' || campo.id === 'retiradaMensalEUR') {
                    atualizarExtensoComMoeda(campo.id);
                } else {
                    atualizarExtenso(input.value, extensoElement, campo.tipo);
                }
                return;
            }
            
            // Outras teclas de controle que não devem ser processadas
            if (['Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(tecla)) {
                return;
            }
            
            // Se for tecla numérica, processa no modo calculadora
            if (/^\d$/.test(tecla)) {
                e.preventDefault(); // Impede a inserção normal
                
                // Adiciona dígito ao buffer
                buffers[campo.id] += tecla;
                
                // Formata o número conforme o tipo
                if (campo.tipo === 'monetario') {
                    // Converter buffer para valor monetário
                    const valorCentavos = parseInt(buffers[campo.id], 10);
                    const valorReais = valorCentavos / 100;
                    input.value = formatarNumero(valorReais, 2);
                } else {
                    // Converter buffer para valor percentual
                    const valorCentesimos = parseInt(buffers[campo.id], 10);
                    const valorPercentual = valorCentesimos / 100;
                    input.value = formatarNumero(valorPercentual, 2);
                }
                
                // Atualizar o valor por extenso com a moeda adequada
                if (campo.id === 'valorInicial' || campo.id === 'aporteMensal' || 
                    campo.id === 'retiradaMensalBRL' || campo.id === 'retiradaMensalUSD' || campo.id === 'retiradaMensalEUR') {
                    atualizarExtensoComMoeda(campo.id);
                } else {
                    atualizarExtenso(input.value, extensoElement, campo.tipo);
                }
                
                return;
            }
            
            // Limpa o buffer se pressionar escape
            if (tecla === 'Escape') {
                buffers[campo.id] = '';
                input.value = campo.tipo === 'monetario' ? '0,00' : '0,00';
                
                // Atualizar o valor por extenso com a moeda adequada
                if (campo.id === 'valorInicial' || campo.id === 'aporteMensal' || 
                    campo.id === 'retiradaMensalBRL' || campo.id === 'retiradaMensalUSD' || campo.id === 'retiradaMensalEUR') {
                    atualizarExtensoComMoeda(campo.id);
                } else {
                    atualizarExtenso(input.value, extensoElement, campo.tipo);
                }
                
                e.preventDefault();
                return;
            }
        });
        
        // Tratamento para perda de foco - limpa o buffer mas mantém o valor
        input.addEventListener('blur', () => {
            // Captura o valor atual
            const valorAtual = input.value;
            
            // Calcula o novo valor do buffer baseado no valor atual
            if (campo.tipo === 'monetario') {
                // Para valores monetários, multiplica por 100 e converte para string
                const valorCentavos = Math.round(parseFloat(valorAtual.replace(/\./g, '').replace(',', '.')) * 100);
                buffers[campo.id] = valorCentavos.toString();
            } else {
                // Para percentuais, multiplica por 100 e converte para string
                const valorCentesimos = Math.round(parseFloat(valorAtual.replace(/\./g, '').replace(',', '.')) * 100);
                buffers[campo.id] = valorCentesimos.toString();
            }
        });
        
        // Mantém o manipulador de input para quando colar valores, etc.
        input.addEventListener('input', (e) => {
            // Não trata se veio de keydown (já tratado pelo buffer)
            if (e.inputType === 'insertText' && /^\d$/.test(e.data)) {
                return;
            }
            
            // Armazena a posição do cursor antes da alteração
            const cursorPos = e.target.selectionStart;
            const valorOriginal = e.target.value;
            
            // Processamento normal para outros casos (colar, drag and drop, etc)
            // Remove caracteres não numéricos, exceto vírgula e ponto
            let valor = valorOriginal.replace(/[^\d,.]/g, '');
            
            // Substitui ponto por vazio para garantir que apenas vírgula é usada como decimal
            valor = valor.replace(/\./g, '');
            
            // Substitui vírgula por ponto para cálculos
            const valorCalculavel = valor.replace(/,/g, '.');
            
            // Formata o número para exibição
            let valorFormatado;
            if (campo.tipo === 'monetario') {
                valorFormatado = formatarNumero(valorCalculavel, 2);
                
                // Atualiza o buffer
                const valorCentavos = Math.round(parseFloat(valorCalculavel) * 100);
                buffers[campo.id] = valorCentavos.toString();
            } else {
                valorFormatado = formatarNumero(valorCalculavel, 2);
                
                // Atualiza o buffer
                const valorCentesimos = Math.round(parseFloat(valorCalculavel) * 100);
                buffers[campo.id] = valorCentesimos.toString();
            }
            
            // Atualiza o valor no input
            e.target.value = valorFormatado;
            
            // Atualizar o valor por extenso com a moeda adequada
            if (campo.id === 'valorInicial' || campo.id === 'aporteMensal' || 
                campo.id === 'retiradaMensalBRL' || campo.id === 'retiradaMensalUSD' || campo.id === 'retiradaMensalEUR') {
                atualizarExtensoComMoeda(campo.id);
            } else {
                atualizarExtenso(valorFormatado, extensoElement, campo.tipo);
            }
            
            // Ajusta a posição do cursor
            // Calcula a diferença entre o número de pontos antes do cursor original e novo
            const pontosAntesOriginal = (valorOriginal.substring(0, cursorPos).match(/\./g) || []).length;
            const pontosAntesNovo = (valorFormatado.substring(0, cursorPos).match(/\./g) || []).length;
            const diferenca = pontosAntesNovo - pontosAntesOriginal;
            
            let novoPos = cursorPos + diferenca;
            
            // Se havia vírgula no original, mas não no formatado, ajusta a posição
            if (valorOriginal.includes(',') && !valorFormatado.includes(',')) {
                novoPos = valorFormatado.length;
            }
            
            // Garante que a posição do cursor é válida
            novoPos = Math.max(0, Math.min(novoPos, valorFormatado.length));
            
            e.target.setSelectionRange(novoPos, novoPos);
        });
        
        // Inicializa o buffer com o valor atual do campo
        const valorAtual = input.value;
        if (campo.tipo === 'monetario') {
            // Para valores monetários, multiplica por 100 e converte para string
            const valorCentavos = Math.round(parseFloat(valorAtual.replace(/\./g, '').replace(',', '.')) * 100);
            buffers[campo.id] = valorCentavos.toString();
        } else {
            // Para percentuais, multiplica por 100 e converte para string
            const valorCentesimos = Math.round(parseFloat(valorAtual.replace(/\./g, '').replace(',', '.')) * 100);
            buffers[campo.id] = valorCentesimos.toString();
        }
    });

    calcularBtn.addEventListener('click', calcularProjecao);

    // Função para formatar número com separador de milhar e decimal
    function formatarNumero(valor, casasDecimais = 2) {
        const numero = parseFloat(valor);
        
        if (isNaN(numero)) {
            return casasDecimais === 2 ? '0,00' : '0,00';
        }
        
        // Formata o número com separadores
        return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        });
    }

    // Função para atualizar o valor por extenso
    function atualizarExtenso(valor, elementoExtenso, tipo, moeda) {
        if (!valor || !elementoExtenso) return;
        
        // Remove formatação e converte para número
        const numeroStr = valor.replace(/\./g, '').replace(',', '.');
        const numero = parseFloat(numeroStr);
        
        if (isNaN(numero)) {
            elementoExtenso.textContent = '';
            return;
        }
        
        // Função auxiliar para converter números em texto
        const unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
        const dezADezenove = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
        const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
        const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
        
        function converterGrupo(num) {
            let resultado = '';
            
            if (num === 0) {
                return 'zero';
            }
            
            // Centenas
            if (num >= 100) {
                if (num === 100) {
                    return 'cem';
                }
                resultado += centenas[Math.floor(num / 100)] + ' e ';
                num %= 100;
                if (num === 0) {
                    return resultado.slice(0, -3); // Remove o " e " final
                }
            }
            
            // Dezenas e unidades
            if (num >= 10 && num < 20) {
                resultado += dezADezenove[num - 10];
            } else {
                // Dezenas
                if (num >= 20) {
                    resultado += dezenas[Math.floor(num / 10)];
                    num %= 10;
                    if (num > 0) {
                        resultado += ' e ';
                    }
                }
                
                // Unidades
                if (num > 0 && num < 10) {
                    resultado += unidades[num];
                }
            }
            
            return resultado;
        }

        function converterNumeroInteiro(num) {
            if (num === 0) return 'zero';
            
            const trilhoes = Math.floor(num / 1000000000000);
            const bilhoes = Math.floor((num % 1000000000000) / 1000000000);
            const milhoes = Math.floor((num % 1000000000) / 1000000);
            const milhares = Math.floor((num % 1000000) / 1000);
            const restoUnidades = num % 1000;
            
            let resultado = '';
            
            // Trilhões
            if (trilhoes > 0) {
                resultado += converterGrupo(trilhoes) + ' ' + (trilhoes === 1 ? 'trilhão' : 'trilhões');
                if (bilhoes > 0 || milhoes > 0 || milhares > 0 || restoUnidades > 0) {
                    resultado += ' ';
                }
            }
            
            // Bilhões
            if (bilhoes > 0) {
                resultado += converterGrupo(bilhoes) + ' ' + (bilhoes === 1 ? 'bilhão' : 'bilhões');
                if (milhoes > 0 || milhares > 0 || restoUnidades > 0) {
                    resultado += ' ';
                }
            }
            
            // Milhões
            if (milhoes > 0) {
                resultado += converterGrupo(milhoes) + ' ' + (milhoes === 1 ? 'milhão' : 'milhões');
                if (milhares > 0 || restoUnidades > 0) {
                    resultado += ' ';
                }
            }
            
            // Milhares
            if (milhares > 0) {
                if (milhares === 1) {
                    resultado += 'mil';
                } else {
                    resultado += converterGrupo(milhares) + ' mil';
                }
                if (restoUnidades > 0) {
                    if (restoUnidades < 100) {
                        resultado += ' e ';
                    } else {
                        resultado += ' ';
                    }
                }
            }
            
            // Unidades
            if (restoUnidades > 0 || resultado === '') {
                resultado += converterGrupo(restoUnidades);
            }
            
            return resultado;
        }
        
        // Para valores monetários
        let textoExtenso = '';
        if (tipo === 'monetario') {
            // Separa parte inteira e decimal
            const parteInteira = Math.floor(numero);
            // Pega apenas os dois primeiros dígitos da parte decimal
            const parteDecimal = Math.round((numero - parteInteira) * 100);
            
            // Converte a parte inteira para texto
            let textoParteInteira = converterNumeroInteiro(parteInteira);
            
            // Primeira letra maiúscula
            textoParteInteira = textoParteInteira.charAt(0).toUpperCase() + textoParteInteira.slice(1);
            
            // Define o texto para a parte inteira, incluindo plural se necessário
            if (moeda === 'real') {
                if (parteInteira === 0) {
                    textoExtenso = '';
                } else if (parteInteira === 1) {
                    textoExtenso = textoParteInteira + ' real';
                } else {
                    textoExtenso = textoParteInteira + ' reais';
                }
            } else if (moeda === 'dolar') {
                if (parteInteira === 0) {
                    textoExtenso = '';
                } else if (parteInteira === 1) {
                    textoExtenso = textoParteInteira + ' dólar';
                } else {
                    textoExtenso = textoParteInteira + ' dólares';
                }
            } else if (moeda === 'euro') {
                if (parteInteira === 0) {
                    textoExtenso = '';
                } else if (parteInteira === 1) {
                    textoExtenso = textoParteInteira + ' euro';
                } else {
                    textoExtenso = textoParteInteira + ' euros';
                }
            }
            
            // Se houver parte decimal, adiciona ao texto
            if (parteDecimal > 0) {
                let textoParteDecimal = converterNumeroInteiro(parteDecimal);
                
                if (textoExtenso === '') {
                    if (moeda === 'real') {
                        textoExtenso = parteDecimal === 1 ? textoParteDecimal + ' centavo' : textoParteDecimal + ' centavos';
                    } else if (moeda === 'dolar') {
                        textoExtenso = parteDecimal === 1 ? textoParteDecimal + ' cent' : textoParteDecimal + ' cents';
                    } else if (moeda === 'euro') {
                        textoExtenso = parteDecimal === 1 ? textoParteDecimal + ' cêntimo' : textoParteDecimal + ' cêntimos';
                    }
                } else {
                    if (moeda === 'real') {
                        textoExtenso += ' e ' + (parteDecimal === 1 ? textoParteDecimal + ' centavo' : textoParteDecimal + ' centavos');
                    } else if (moeda === 'dolar') {
                        textoExtenso += ' e ' + (parteDecimal === 1 ? textoParteDecimal + ' cent' : textoParteDecimal + ' cents');
                    } else if (moeda === 'euro') {
                        textoExtenso += ' e ' + (parteDecimal === 1 ? textoParteDecimal + ' cêntimo' : textoParteDecimal + ' cêntimos');
                    }
                }
            } else if (textoExtenso === '') {
                // Se tanto a parte inteira quanto a decimal forem zero
                if (moeda === 'real') {
                    textoExtenso = 'Zero reais';
                } else if (moeda === 'dolar') {
                    textoExtenso = 'Zero dólares';
                } else if (moeda === 'euro') {
                    textoExtenso = 'Zero euros';
                }
            }
        } else if (tipo === 'percentual') {
            // Para porcentagens
            // Separa parte inteira e decimal
            const parteInteira = Math.floor(numero);
            // Assumimos uma casa decimal para porcentagens
            const parteDecimal = Math.round((numero - parteInteira) * 10);
            
            // Converte a parte inteira para texto
            let textoParteInteira = converterNumeroInteiro(parteInteira);
            
            // Primeira letra maiúscula
            textoParteInteira = textoParteInteira.charAt(0).toUpperCase() + textoParteInteira.slice(1);
            
            // Define o texto para a parte inteira
            if (parteInteira === 0 && parteDecimal === 0) {
                textoExtenso = 'Zero por cento';
            } else if (parteInteira === 0) {
                textoExtenso = '';
            } else if (parteInteira === 1 && parteDecimal === 0) {
                textoExtenso = 'Um por cento';
            } else {
                textoExtenso = textoParteInteira;
            }
            
            // Se houver parte decimal, adiciona ao texto
            if (parteDecimal > 0) {
                let textoParteDecimal = converterNumeroInteiro(parteDecimal);
                
                if (textoExtenso === '') {
                    textoExtenso = 'Zero vírgula ' + textoParteDecimal;
                } else {
                    textoExtenso += ' vírgula ' + textoParteDecimal;
                }
            }
            
            // Adiciona "por cento" se não for zero
            if ((parteInteira > 0 || parteDecimal > 0) && !textoExtenso.endsWith('por cento')) {
                textoExtenso += ' por cento';
            }
        }
        
        elementoExtenso.textContent = textoExtenso;
    }

    // Função principal para calcular a projeção financeira
    function calcularProjecao() {
        // Obter o valor das taxas de câmbio
        const taxaCambioDolar = parseFloat(document.getElementById('taxaCambio').value.replace(/\./g, '').replace(',', '.')) || 5.0;
        const taxaCambioEuro = parseFloat(document.getElementById('taxaCambioEuro').value.replace(/\./g, '').replace(',', '.')) || 5.5;
        
        // Obter valores de entrada com suas respectivas moedas
        const moedaValorInicial = document.getElementById('moedaValorInicial').value;
        const valorInicialOriginal = parseFloat(document.getElementById('valorInicial').value.replace(/\./g, '').replace(',', '.')) || 0;
        
        // Converter para reais conforme a moeda selecionada
        let valorInicial = valorInicialOriginal;
        if (moedaValorInicial === 'USD') {
            valorInicial *= taxaCambioDolar;
        } else if (moedaValorInicial === 'EUR') {
            valorInicial *= taxaCambioEuro;
        }
        
        // Mesmo processo para aporte mensal
        const moedaAporteMensal = document.getElementById('moedaAporteMensal').value;
        const aporteMensalOriginal = parseFloat(document.getElementById('aporteMensal').value.replace(/\./g, '').replace(',', '.')) || 0;
        
        // Converter para reais conforme a moeda selecionada
        let aporteMensal = aporteMensalOriginal;
        if (moedaAporteMensal === 'USD') {
            aporteMensal *= taxaCambioDolar;
        } else if (moedaAporteMensal === 'EUR') {
            aporteMensal *= taxaCambioEuro;
        }
        
        const tipoRetirada = document.getElementById('tipoRetirada').value;
        console.log(`Tipo de retirada selecionado: ${tipoRetirada}`);
        
        // Estrutura para armazenar informações de retiradas em cada moeda
        const retiradas = {
            BRL: { habilitada: false, valor: 0, percentual: 0, valorOriginal: 0 },
            USD: { habilitada: false, valor: 0, percentual: 0, valorOriginal: 0 },
            EUR: { habilitada: false, valor: 0, percentual: 0, valorOriginal: 0 }
        };
        
        // Obter valores de retirada para cada moeda
        const moedas = ['BRL', 'USD', 'EUR'];
        
        moedas.forEach(moeda => {
            const habilitada = document.getElementById(`habilitarRetirada${moeda}`);
            if (!habilitada) {
                console.log(`Erro: Checkbox para ${moeda} não encontrado`);
                return;
            }
            
            const habilitadaRetirada = habilitada.checked;
            retiradas[moeda].habilitada = habilitadaRetirada;
            
            console.log(`Moeda ${moeda}: checkbox encontrado=${!!habilitada}, habilitada=${habilitadaRetirada}`);
            
            if (habilitadaRetirada) {
                if (tipoRetirada === 'fixo') {
                    const valorRetirada = parseFloat(document.getElementById(`retiradaMensal${moeda}`).value.replace(/\./g, '').replace(',', '.')) || 0;
                    retiradas[moeda].valorOriginal = valorRetirada;
                    
                    // Converter para reais se for outra moeda
                    if (moeda === 'USD') {
                        retiradas[moeda].valor = valorRetirada * taxaCambioDolar;
                    } else if (moeda === 'EUR') {
                        retiradas[moeda].valor = valorRetirada * taxaCambioEuro;
                    } else {
                        retiradas[moeda].valor = valorRetirada;
                    }
                    
                    console.log(`Retirada fixa ${moeda}: ${valorRetirada} (${retiradas[moeda].valor} em BRL)`);
                } else {
                    try {
                        const inputPercentual = document.getElementById(`percentualLucro${moeda}`);
                        if (!inputPercentual) {
                            console.log(`Erro: Input percentual para ${moeda} não encontrado`);
                            return;
                        }
                        
                        const valorInput = inputPercentual.value;
                        console.log(`Valor bruto do input percentual ${moeda}: "${valorInput}"`);
                        
                        const valorLimpo = valorInput.replace(/\./g, '').replace(',', '.');
                        console.log(`Valor limpo do input percentual ${moeda}: "${valorLimpo}"`);
                        
                        const percentualRetirada = parseFloat(valorLimpo) || 0;
                        retiradas[moeda].percentual = percentualRetirada;
                        
                        console.log(`Percentual para ${moeda}: ${percentualRetirada}%`);
                    } catch (e) {
                        console.error(`Erro ao processar percentual para ${moeda}:`, e);
                    }
                }
            }
        });
        
        // Calcular retirada total inicial em reais
        let retiradaTotalInicial = 0;
        
        if (tipoRetirada === 'fixo') {
            Object.values(retiradas).forEach(r => {
                if (r.habilitada) {
                    retiradaTotalInicial += r.valor;
                }
            });
        }
        
        // Obter demais parâmetros
        const juros = parseFloat(document.getElementById('juros').value.replace(/\./g, '').replace(',', '.')) || 0;
        const periodoJuros = document.getElementById('periodoJuros').value;
        const inicioRetirada = parseInt(document.getElementById('inicioRetirada').value) || 0;
        const tempoAumento = parseInt(document.getElementById('tempoAumento').value) || 0;
        const periodoAumento = document.getElementById('periodoAumento').value;
        const valorAumento = parseFloat(document.getElementById('valorAumento').value.replace(/\./g, '').replace(',', '.')) || 0;
        const periodoProjecao = parseInt(document.getElementById('periodoProjecao').value) || 10;

        console.log(`Início das retiradas configurado para o mês: ${inicioRetirada}`);

        // Converter taxa de juros anual para mensal se necessário
        let taxaMensal;
        if (periodoJuros === 'anual') {
            taxaMensal = Math.pow(1 + juros / 100, 1/12) - 1;
        } else {
            taxaMensal = juros / 100;
        }

        // Calcular período total em meses
        const mesesTotais = periodoProjecao * 12;
        
        // Inicializar arrays para armazenar resultados em todas as moedas
        const patrimonioReais = new Array(mesesTotais + 1).fill(0);
        const patrimonioDolares = new Array(mesesTotais + 1).fill(0);
        const patrimonioEuros = new Array(mesesTotais + 1).fill(0);
        
        const jurosAcumulados = new Array(mesesTotais + 1).fill(0);
        const jurosMensais = new Array(mesesTotais + 1).fill(0);
        
        const aportesAcumuladosReais = new Array(mesesTotais + 1).fill(0);
        const aportesAcumuladosDolares = new Array(mesesTotais + 1).fill(0);
        const aportesAcumuladosEuros = new Array(mesesTotais + 1).fill(0);
        
        // Arrays para retiradas acumuladas por moeda
        const retiradasPorMoeda = {
            BRL: { acumuladas: new Array(mesesTotais + 1).fill(0), mensais: new Array(mesesTotais + 1).fill(0) },
            USD: { acumuladas: new Array(mesesTotais + 1).fill(0), mensais: new Array(mesesTotais + 1).fill(0) },
            EUR: { acumuladas: new Array(mesesTotais + 1).fill(0), mensais: new Array(mesesTotais + 1).fill(0) }
        };
        
        // Retiradas totais acumuladas (todas as moedas convertidas para cada moeda)
        const retiradasAcumuladasReais = new Array(mesesTotais + 1).fill(0);
        const retiradasAcumuladasDolares = new Array(mesesTotais + 1).fill(0);
        const retiradasAcumuladasEuros = new Array(mesesTotais + 1).fill(0);
        const retiradasMensaisReais = new Array(mesesTotais + 1).fill(0);
        
        const periodos = [];
        
        // Definir valores iniciais
        patrimonioReais[0] = valorInicial;
        patrimonioDolares[0] = valorInicial / taxaCambioDolar;
        patrimonioEuros[0] = valorInicial / taxaCambioEuro;
        
        aportesAcumuladosReais[0] = valorInicial;
        aportesAcumuladosDolares[0] = valorInicial / taxaCambioDolar;
        aportesAcumuladosEuros[0] = valorInicial / taxaCambioEuro;
        
        // Copiar as retiradas originais para poder aplicar aumentos
        const retiradasAtuais = JSON.parse(JSON.stringify(retiradas));
        
        console.log("Configuração de retiradas:", JSON.stringify(retiradasAtuais, null, 2));
        
        // Calcular valor da retirada para cada período
        const aumentoMeses = periodoAumento === 'anos' ? tempoAumento * 12 : tempoAumento;
        
        // Calcular projeção mês a mês
        for (let mes = 1; mes <= mesesTotais; mes++) {
            periodos.push(`Mês ${mes}`);
            
            // Verificar se é hora de aumentar as retiradas ou percentuais
            if (mes > inicioRetirada && aumentoMeses > 0 && (mes - inicioRetirada) % aumentoMeses === 0) {
                if (tipoRetirada === 'fixo') {
                    // Aumentar valores fixos
                    moedas.forEach(moeda => {
                        if (retiradas[moeda].habilitada) {
                            retiradasAtuais[moeda].valor += (retiradasAtuais[moeda].valor * valorAumento / 100);
                        }
                    });
                } else {
                    // Aumentar percentuais
                    moedas.forEach(moeda => {
                        if (retiradas[moeda].habilitada) {
                            retiradasAtuais[moeda].percentual += (retiradasAtuais[moeda].percentual * valorAumento / 100);
                        }
                    });
                }
            }
            
            // Calcular juros do mês
            const jurosMes = patrimonioReais[mes - 1] * taxaMensal;
            jurosMensais[mes] = jurosMes;
            jurosAcumulados[mes] = jurosAcumulados[mes - 1] + jurosMes;
            
            if (mes < 3) {
                console.log(`Mês ${mes} - Patrimônio: ${patrimonioReais[mes-1]}, Taxa mensal: ${taxaMensal}, Juros gerados: ${jurosMes}`);
            }
            
            // Adicionar aporte
            aportesAcumuladosReais[mes] = aportesAcumuladosReais[mes - 1] + aporteMensal;
            aportesAcumuladosDolares[mes] = aportesAcumuladosReais[mes] / taxaCambioDolar;
            aportesAcumuladosEuros[mes] = aportesAcumuladosReais[mes] / taxaCambioEuro;
            
            // Calcular retiradas totais em reais para este mês
            let retiradaEfetivaTotalReais = 0;
            
            if (mes >= inicioRetirada) {
                if (mes < 3) {
                    console.log(`Mês ${mes} - Processando retiradas`);
                }
                
                moedas.forEach(moeda => {
                    if (retiradas[moeda].habilitada) {
                        let retiradaEfetivaMoeda = 0;
                        
                        if (tipoRetirada === 'fixo') {
                            retiradaEfetivaMoeda = retiradasAtuais[moeda].valor;
                            if (mes < 3) console.log(`Mês ${mes} - Retirada fixa ${moeda}: ${retiradaEfetivaMoeda}`);
                        } else {
                            // Pegar o percentual configurado para esta moeda
                            const percentual = retiradasAtuais[moeda].percentual;
                            // Aplicar este percentual sobre os juros do mês
                            retiradaEfetivaMoeda = jurosMes * (percentual / 100);
                            
                            if (mes < 3) console.log(`Mês ${mes} - Juros: ${jurosMes}, Percentual ${moeda}: ${percentual}%, Retirada: ${retiradaEfetivaMoeda}`);
                        }
                        
                        // Converter para a moeda local e atualizar registros
                        let retiradaEmReais = retiradaEfetivaMoeda;
                        let retiradaNaMoedaOriginal = retiradaEfetivaMoeda;
                        
                        if (moeda === 'USD') {
                            retiradaEmReais = retiradaEfetivaMoeda * taxaCambioDolar;
                            retiradaNaMoedaOriginal = retiradaEfetivaMoeda;
                        } else if (moeda === 'EUR') {
                            retiradaEmReais = retiradaEfetivaMoeda * taxaCambioEuro;
                            retiradaNaMoedaOriginal = retiradaEfetivaMoeda;
                        } else {
                            retiradaEmReais = retiradaEfetivaMoeda;
                            retiradaNaMoedaOriginal = retiradaEfetivaMoeda;
                        }
                        
                        // Atualizar os valores acumulados
                        retiradasPorMoeda[moeda].acumuladas[mes] = 
                            retiradasPorMoeda[moeda].acumuladas[mes - 1] + retiradaNaMoedaOriginal;
                        retiradasPorMoeda[moeda].mensais[mes] = retiradaNaMoedaOriginal;
                        
                        // Adicionar ao total em reais
                        retiradaEfetivaTotalReais += retiradaEmReais;
                    } else {
                        // Manter o valor acumulado anterior
                        retiradasPorMoeda[moeda].acumuladas[mes] = retiradasPorMoeda[moeda].acumuladas[mes - 1];
                        retiradasPorMoeda[moeda].mensais[mes] = 0;
                    }
                });
                
                retiradasMensaisReais[mes] = retiradaEfetivaTotalReais;
                retiradasAcumuladasReais[mes] = retiradasAcumuladasReais[mes - 1] + retiradaEfetivaTotalReais;
                retiradasAcumuladasDolares[mes] = retiradasAcumuladasReais[mes] / taxaCambioDolar;
                retiradasAcumuladasEuros[mes] = retiradasAcumuladasReais[mes] / taxaCambioEuro;
            } else {
                // Manter valores do mês anterior para todas as moedas
                moedas.forEach(moeda => {
                    retiradasPorMoeda[moeda].acumuladas[mes] = retiradasPorMoeda[moeda].acumuladas[mes - 1];
                    retiradasPorMoeda[moeda].mensais[mes] = 0;
                });
                
                retiradasMensaisReais[mes] = 0;
                retiradasAcumuladasReais[mes] = retiradasAcumuladasReais[mes - 1];
                retiradasAcumuladasDolares[mes] = retiradasAcumuladasReais[mes] / taxaCambioDolar;
                retiradasAcumuladasEuros[mes] = retiradasAcumuladasReais[mes] / taxaCambioEuro;
            }
            
            // Calcular patrimônio no final do mês
            patrimonioReais[mes] = patrimonioReais[mes - 1] + jurosMes + aporteMensal - retiradaEfetivaTotalReais;
            patrimonioDolares[mes] = patrimonioReais[mes] / taxaCambioDolar;
            patrimonioEuros[mes] = patrimonioReais[mes] / taxaCambioEuro;
            
            // Verificar se o patrimônio ficou negativo
            if (patrimonioReais[mes] < 0) {
                exibirAlerta(`Atenção: Seu patrimônio ficou negativo no mês ${mes}!`);
                patrimonioReais[mes] = 0;
                patrimonioDolares[mes] = 0;
                patrimonioEuros[mes] = 0;
            }
        }
        
        // Remover o primeiro elemento (valor inicial) para cálculos corretos
        patrimonioReais.shift();
        patrimonioDolares.shift();
        patrimonioEuros.shift();
        
        jurosAcumulados.shift();
        jurosMensais.shift();
        
        aportesAcumuladosReais.shift();
        aportesAcumuladosDolares.shift();
        aportesAcumuladosEuros.shift();
        
        retiradasAcumuladasReais.shift();
        retiradasAcumuladasDolares.shift();
        retiradasAcumuladasEuros.shift();
        retiradasMensaisReais.shift();
        
        moedas.forEach(moeda => {
            retiradasPorMoeda[moeda].acumuladas.shift();
            retiradasPorMoeda[moeda].mensais.shift();
        });
        
        // Exibir resultados
        exibirResultados(
            patrimonioReais, patrimonioDolares, patrimonioEuros,
            jurosAcumulados, jurosMensais,
            aportesAcumuladosReais, aportesAcumuladosDolares, aportesAcumuladosEuros,
            retiradasAcumuladasReais, retiradasAcumuladasDolares, retiradasAcumuladasEuros,
            retiradasMensaisReais, retiradasPorMoeda,
            periodos, tipoRetirada, retiradas,
            taxaCambioDolar, taxaCambioEuro,
            moedaValorInicial, moedaAporteMensal
        );
        
        exibirRetiradasAtuais(
            mesesTotais, 
            retiradasPorMoeda,
            taxaCambioDolar, 
            taxaCambioEuro
        );
        
        criarGrafico(
            patrimonioReais, patrimonioDolares, patrimonioEuros, 
            retiradasMensaisReais, retiradasAcumuladasReais,
            periodos, taxaCambioDolar, taxaCambioEuro
        );
        
        criarTabela(
            patrimonioReais, patrimonioDolares, patrimonioEuros,
            jurosAcumulados, jurosMensais, 
            aportesAcumuladosReais, aportesAcumuladosDolares, aportesAcumuladosEuros,
            retiradasAcumuladasReais, retiradasAcumuladasDolares, retiradasAcumuladasEuros,
            retiradasPorMoeda,
            periodos, tipoRetirada, taxaCambioDolar, taxaCambioEuro
        );
        
        // Configurar o modal de detalhes para a tabela
        configurarModalDetalhes(
            patrimonioReais, patrimonioDolares, patrimonioEuros,
            jurosAcumulados, jurosMensais,
            retiradasPorMoeda, retiradasMensaisReais,
            periodos, taxaCambioDolar, taxaCambioEuro
        );
    }
    
    // Função para exibir os resultados principais
    function exibirResultados(
        patrimonioReais, patrimonioDolares, patrimonioEuros,
        jurosAcumulados, jurosMensais,
        aportesAcumuladosReais, aportesAcumuladosDolares, aportesAcumuladosEuros,
        retiradasAcumuladasReais, retiradasAcumuladasDolares, retiradasAcumuladasEuros,
        retiradasMensaisReais, retiradasPorMoeda,
        periodos, tipoRetirada, retiradas,
        taxaCambioDolar, taxaCambioEuro,
        moedaValorInicial, moedaAporteMensal
    ) {
        // Criar e exibir o gráfico
        criarGrafico(
            patrimonioReais, patrimonioDolares, patrimonioEuros, 
            retiradasMensaisReais, retiradasAcumuladasReais,
            periodos, taxaCambioDolar, taxaCambioEuro
        );
        
        // Adicionar informações de moeda
        const moedaInicial = moedaValorInicial === 'BRL' ? 'Reais' : (moedaValorInicial === 'USD' ? 'Dólares' : 'Euros');
        const moedaAporte = moedaAporteMensal === 'BRL' ? 'Reais' : (moedaAporteMensal === 'USD' ? 'Dólares' : 'Euros');
        
        // Mostrar o montante final
        const ultimoMes = patrimonioReais.length - 1;
        
        document.getElementById('resultadoPatrimonio').innerHTML = `
            <h3>Patrimônio Final</h3>
            <ul>
                <li><strong>Reais:</strong> R$ ${formatarValor(patrimonioReais[ultimoMes])}</li>
                <li><strong>Dólares:</strong> US$ ${formatarValor(patrimonioDolares[ultimoMes])}</li>
                <li><strong>Euros:</strong> € ${formatarValor(patrimonioEuros[ultimoMes])}</li>
            </ul>
        `;
        
        document.getElementById('resultadoInformacoes').innerHTML = `
            <h3>Informações</h3>
            <ul>
                <li><strong>Valor inicial em:</strong> ${moedaInicial}</li>
                <li><strong>Aportes mensais em:</strong> ${moedaAporte}</li>
                <li><strong>Período de projeção:</strong> ${periodos[ultimoMes]}</li>
                <li><strong>Juros acumulados:</strong> R$ ${formatarValor(jurosAcumulados[ultimoMes])}</li>
            </ul>
        `;
        
        // Mostrar retiradas para o mês atual
        exibirRetiradasAtuais(ultimoMes, retiradasPorMoeda, taxaCambioDolar, taxaCambioEuro);
        
        // Criar e exibir a tabela de resultados
        criarTabela(
            patrimonioReais, patrimonioDolares, patrimonioEuros,
            jurosAcumulados, jurosMensais, 
            aportesAcumuladosReais, aportesAcumuladosDolares, aportesAcumuladosEuros,
            retiradasAcumuladasReais, retiradasAcumuladasDolares, retiradasAcumuladasEuros,
            retiradasPorMoeda,
            periodos, tipoRetirada, taxaCambioDolar, taxaCambioEuro
        );
        
        // Adicionar instrução para clicar nas linhas
        const tabelaContainer = document.querySelector('.tabela-container');
        if (!document.getElementById('tabela-info')) {
            const infoDiv = document.createElement('div');
            infoDiv.id = 'tabela-info';
            infoDiv.className = 'tabela-info';
            infoDiv.innerHTML = `
                <span class="info-icon">ℹ️</span> 
                <span class="info-text">Clique em qualquer linha para ver detalhes detalhados do período</span>
            `;
            tabelaContainer.insertBefore(infoDiv, tabelaContainer.firstChild);
        }
        
        // Configurar o modal de detalhes do período
        configurarModalDetalhes(
            patrimonioReais, patrimonioDolares, patrimonioEuros,
            jurosAcumulados, jurosMensais,
            retiradasPorMoeda, retiradasMensaisReais,
            periodos, taxaCambioDolar, taxaCambioEuro
        );
        
        // Mostrar a seção de resultados
        document.getElementById('resultados').style.display = 'block';
        
        // Rolagem suave até os resultados
        window.scrollTo({
            top: document.getElementById('resultados').offsetTop - 20,
            behavior: 'smooth'
        });
    }
    
    // Nova função para exibir retiradas mensais atuais
    function exibirRetiradasAtuais(mesAtual, retiradasPorMoeda, taxaCambioDolar, taxaCambioEuro) {
        const containerRetiradas = document.querySelector('.retiradas-atuais-grid');
        containerRetiradas.innerHTML = '';
        
        // Escolher um mês representativo (último mês ou mês atual)
        const mes = Math.min(mesAtual, retiradasPorMoeda.BRL.mensais.length - 1);
        
        // Adicionar retiradas por moeda
        const moedas = [
            { codigo: 'BRL', simbolo: 'R$', nome: 'Reais' },
            { codigo: 'USD', simbolo: 'US$', nome: 'Dólares' },
            { codigo: 'EUR', simbolo: '€', nome: 'Euros' }
        ];
        
        let temRetirada = false;
        
        moedas.forEach(moeda => {
            // Verificar se há retirada para esta moeda
            if (retiradasPorMoeda[moeda.codigo].mensais[mes] > 0) {
                temRetirada = true;
                
                // Criar elemento para mostrar a retirada mensal
                const retiradaItem = document.createElement('div');
                retiradaItem.className = 'retirada-atual-item';
                
                const valorRetirada = retiradasPorMoeda[moeda.codigo].mensais[mes];
                
                retiradaItem.innerHTML = `
                    <div class="retirada-atual-moeda">${moeda.nome}</div>
                    <div class="retirada-atual-valor">${moeda.simbolo} ${formatarValor(valorRetirada)}</div>
                `;
                
                containerRetiradas.appendChild(retiradaItem);
            }
        });
        
        // Se não houver retiradas, mostrar uma mensagem
        if (!temRetirada) {
            const mensagem = document.createElement('div');
            mensagem.className = 'retirada-atual-item';
            mensagem.innerHTML = '<div class="retirada-atual-valor">Não há retiradas mensais configuradas</div>';
            containerRetiradas.appendChild(mensagem);
        }
        
        // Adicionar o total em cada moeda
        let totalReais = 0;
        moedas.forEach(moeda => {
            if (retiradasPorMoeda[moeda.codigo].mensais[mes] > 0) {
                if (moeda.codigo === 'BRL') {
                    totalReais += retiradasPorMoeda[moeda.codigo].mensais[mes];
                } else if (moeda.codigo === 'USD') {
                    totalReais += retiradasPorMoeda[moeda.codigo].mensais[mes] * taxaCambioDolar;
                } else if (moeda.codigo === 'EUR') {
                    totalReais += retiradasPorMoeda[moeda.codigo].mensais[mes] * taxaCambioEuro;
                }
            }
        });
        
        if (totalReais > 0) {
            // Adicionar totais convertidos para cada moeda
            const totalItem = document.createElement('div');
            totalItem.className = 'retirada-atual-item total';
            totalItem.innerHTML = `
                <div class="retirada-atual-moeda">Total em todas as moedas</div>
                <div class="retirada-atual-valor">
                    R$ ${formatarValor(totalReais)}<br>
                    US$ ${formatarValor(totalReais / taxaCambioDolar)}<br>
                    € ${formatarValor(totalReais / taxaCambioEuro)}
                </div>
            `;
            
            containerRetiradas.appendChild(totalItem);
        }
    }
    
    // Função para criar o gráfico
    function criarGrafico(
        patrimonioReais, patrimonioDolares, patrimonioEuros, 
        retiradasMensaisReais, retiradasAcumuladasReais,
        periodos, taxaCambioDolar, taxaCambioEuro
    ) {
        const ctx = document.getElementById('graficoLucro').getContext('2d');
        
        // Limpar gráfico existente se houver
        if (grafico) {
            grafico.destroy();
        }
        
        // Extrair retiradas mensais em dólar e euro do objeto global
        const retiradasMensaisDolares = [];
        const retiradasMensaisEuros = [];
        
        // Preparar dados para retiradas em dólares e euros
        if (window.dadosRetiradasPorMoeda) {
            for (let i = 0; i < periodos.length; i++) {
                retiradasMensaisDolares[i] = window.dadosRetiradasPorMoeda.USD.mensais[i] || 0;
                retiradasMensaisEuros[i] = window.dadosRetiradasPorMoeda.EUR.mensais[i] || 0;
            }
        }
        
        // Filtrar dados para não sobrecarregar o gráfico (mostrar apenas alguns pontos)
        const dadosFiltrados = filtrarDadosGraficoCompleto(
            patrimonioReais, patrimonioDolares, patrimonioEuros, 
            retiradasMensaisReais, retiradasAcumuladasReais,
            retiradasMensaisDolares, retiradasMensaisEuros,
            periodos
        );
        
        grafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dadosFiltrados.periodos,
                datasets: [
                    {
                        label: 'Patrimônio em Reais (R$)',
                        data: dadosFiltrados.patrimonioReais,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Patrimônio em Dólares (US$)',
                        data: dadosFiltrados.patrimonioDolares,
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.4,
                        yAxisID: 'y',
                        hidden: true // Inicia oculto, usuário pode ativar no gráfico
                    },
                    {
                        label: 'Patrimônio em Euros (€)',
                        data: dadosFiltrados.patrimonioEuros,
                        backgroundColor: 'rgba(155, 89, 182, 0.2)',
                        borderColor: 'rgba(155, 89, 182, 1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.4,
                        yAxisID: 'y',
                        hidden: true // Inicia oculto, usuário pode ativar no gráfico
                    },
                    {
                        label: 'Retiradas Mensais (R$)',
                        data: dadosFiltrados.retiradasMensaisReais,
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Retiradas Mensais (US$)',
                        data: dadosFiltrados.retiradasMensaisDolares,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.4,
                        yAxisID: 'y1',
                        hidden: false
                    },
                    {
                        label: 'Retiradas Mensais (€)',
                        data: dadosFiltrados.retiradasMensaisEuros,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.4,
                        yAxisID: 'y1',
                        hidden: false
                    },
                    {
                        label: 'Retiradas Acumuladas (R$)',
                        data: dadosFiltrados.retiradasAcumuladasReais,
                        backgroundColor: 'rgba(243, 156, 18, 0.2)',
                        borderColor: 'rgba(243, 156, 18, 1)',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.4,
                        yAxisID: 'y',
                        hidden: true // Inicia oculto, usuário pode ativar no gráfico
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Patrimônio e Retiradas Acumuladas'
                        },
                        ticks: {
                            callback: function(value) {
                                // Aqui usamos R$ como padrão para o eixo Y principal
                                // pois ele é usado para Patrimônio e Retiradas Acumuladas em reais
                                return 'R$ ' + formatarValor(value);
                            }
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Retiradas Mensais'
                        },
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                // Não incluímos o símbolo da moeda aqui
                                // pois o eixo Y da direita pode mostrar valores em diferentes moedas
                                return formatarValor(value);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const datasetLabel = context.dataset.label || '';
                                const value = context.raw;
                                
                                // Verificar qual símbolo de moeda usar baseado no label do dataset
                                if (datasetLabel.includes('Reais') || datasetLabel.includes('(R$)')) {
                                    return 'R$ ' + formatarValor(value);
                                } else if (datasetLabel.includes('Dólares') || datasetLabel.includes('(US$)')) {
                                    return 'US$ ' + formatarValor(value);
                                } else if (datasetLabel.includes('Euros') || datasetLabel.includes('(€)')) {
                                    return '€ ' + formatarValor(value);
                                } else {
                                    // Se não conseguir determinar, usar R$ como padrão
                                    return 'R$ ' + formatarValor(value);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Função atualizada para filtrar dados do gráfico com retiradas em múltiplas moedas
    function filtrarDadosGraficoCompleto(
        patrimonioReais, patrimonioDolares, patrimonioEuros, 
        retiradasMensaisReais, retiradasAcumuladasReais,
        retiradasMensaisDolares, retiradasMensaisEuros,
        periodos
    ) {
        const maxPontos = 60; // Número máximo de pontos no gráfico
        
        if (patrimonioReais.length <= maxPontos) {
            return { 
                patrimonioReais, 
                patrimonioDolares,
                patrimonioEuros,
                retiradasMensaisReais,
                retiradasAcumuladasReais,
                retiradasMensaisDolares,
                retiradasMensaisEuros,
                periodos 
            };
        }
        
        const patrimonioReaisFiltrado = [];
        const patrimonioDolaresFiltrado = [];
        const patrimonioEurosFiltrado = [];
        const retiradasMensaisReaisFiltrado = [];
        const retiradasAcumuladasReaisFiltrado = [];
        const retiradasMensaisDolaresFiltrado = [];
        const retiradasMensaisEurosFiltrado = [];
        const periodosFiltrados = [];
        const intervalo = Math.ceil(patrimonioReais.length / maxPontos);
        
        for (let i = 0; i < patrimonioReais.length; i += intervalo) {
            patrimonioReaisFiltrado.push(patrimonioReais[i]);
            patrimonioDolaresFiltrado.push(patrimonioDolares[i]);
            patrimonioEurosFiltrado.push(patrimonioEuros[i]);
            retiradasMensaisReaisFiltrado.push(retiradasMensaisReais[i]);
            retiradasAcumuladasReaisFiltrado.push(retiradasAcumuladasReais[i]);
            retiradasMensaisDolaresFiltrado.push(retiradasMensaisDolares[i]);
            retiradasMensaisEurosFiltrado.push(retiradasMensaisEuros[i]);
            periodosFiltrados.push(periodos[i]);
        }
        
        // Garantir que o último mês está incluído
        if (patrimonioReaisFiltrado[patrimonioReaisFiltrado.length - 1] !== patrimonioReais[patrimonioReais.length - 1]) {
            patrimonioReaisFiltrado.push(patrimonioReais[patrimonioReais.length - 1]);
            patrimonioDolaresFiltrado.push(patrimonioDolares[patrimonioDolares.length - 1]);
            patrimonioEurosFiltrado.push(patrimonioEuros[patrimonioEuros.length - 1]);
            retiradasMensaisReaisFiltrado.push(retiradasMensaisReais[retiradasMensaisReais.length - 1]);
            retiradasAcumuladasReaisFiltrado.push(retiradasAcumuladasReais[retiradasAcumuladasReais.length - 1]);
            retiradasMensaisDolaresFiltrado.push(retiradasMensaisDolares[retiradasMensaisDolares.length - 1]);
            retiradasMensaisEurosFiltrado.push(retiradasMensaisEuros[retiradasMensaisEuros.length - 1]);
            periodosFiltrados.push(periodos[periodos.length - 1]);
        }
        
        return { 
            patrimonioReais: patrimonioReaisFiltrado, 
            patrimonioDolares: patrimonioDolaresFiltrado,
            patrimonioEuros: patrimonioEurosFiltrado,
            retiradasMensaisReais: retiradasMensaisReaisFiltrado,
            retiradasAcumuladasReais: retiradasAcumuladasReaisFiltrado,
            retiradasMensaisDolares: retiradasMensaisDolaresFiltrado,
            retiradasMensaisEuros: retiradasMensaisEurosFiltrado,
            periodos: periodosFiltrados 
        };
    }
    
    // Manter a função original filtrarDadosGrafico para compatibilidade
    function filtrarDadosGrafico(
        patrimonioReais, patrimonioDolares, patrimonioEuros, 
        retiradasMensaisReais, retiradasAcumuladasReais,
        periodos
    ) {
        return filtrarDadosGraficoCompleto(
            patrimonioReais, patrimonioDolares, patrimonioEuros, 
            retiradasMensaisReais, retiradasAcumuladasReais,
            [], [], // Arrays vazios para retiradas em dólar e euro
            periodos
        );
    }
    
    // Função para criar a tabela de resultados
    function criarTabela(
        patrimonioReais, patrimonioDolares, patrimonioEuros,
        jurosAcumulados, jurosMensais, 
        aportesAcumuladosReais, aportesAcumuladosDolares, aportesAcumuladosEuros,
        retiradasAcumuladasReais, retiradasAcumuladasDolares, retiradasAcumuladasEuros,
        retiradasPorMoeda,
        periodos, tipoRetirada, taxaCambioDolar, taxaCambioEuro
    ) {
        const tabela = document.getElementById('tabelaResultados').getElementsByTagName('tbody')[0];
        tabela.innerHTML = '';
        
        // Adicionar cabeçalho para exibir o tipo de retirada
        const headerRow = tabela.insertRow();
        headerRow.className = 'tabela-header';
        headerRow.innerHTML = `
            <td colspan="11" style="text-align: center; font-weight: bold; background-color: #e9e9e9;">
                Tipo de Retirada: ${tipoRetirada === 'fixo' ? 'Valor Fixo' : 'Percentual dos Lucros'} 
                <br class="mobile-break"><span class="taxa-cambio">US$ 1,00 = R$ ${formatarValor(taxaCambioDolar)} | € 1,00 = R$ ${formatarValor(taxaCambioEuro)}</span>
            </td>
        `;
        
        // Colunas da tabela
        const colunasRow = tabela.insertRow();
        colunasRow.className = 'colunas-header';
        colunasRow.innerHTML = `
            <th rowspan="2" class="periodo-col">Período</th>
            <th colspan="3" class="patrimonio-col">Patrimônio</th>
            <th rowspan="2" class="juros-col">Juros (R$)</th>
            <th colspan="3" class="aportes-col">Aportes</th>
            <th colspan="3" class="retiradas-col">Retiradas</th>
        `;
        
        const moedasRow = tabela.insertRow();
        moedasRow.className = 'moedas-header';
        moedasRow.innerHTML = `
            <th class="moeda-col">R$</th>
            <th class="moeda-col">US$</th>
            <th class="moeda-col">€</th>
            <th class="moeda-col">R$</th>
            <th class="moeda-col">US$</th>
            <th class="moeda-col">€</th>
            <th class="moeda-col">R$</th>
            <th class="moeda-col">US$</th>
            <th class="moeda-col">€</th>
        `;
        
        // Filtrar para mostrar apenas resultados de ano em ano e o último mês
        for (let i = 0; i < patrimonioReais.length; i++) {
            // Mostrar apenas resultados anuais (mês 12, 24, 36...) e o último mês
            if ((i + 1) % 12 === 0 || i === patrimonioReais.length - 1) {
                const row = tabela.insertRow();
                
                // Adicionar atributo de data para identificar o período
                row.setAttribute('data-periodo', i);
                
                // Adicionar classe para indicar que é uma linha de ano
                row.className = 'linha-ano linha-resultado';
                
                // Período
                const cellPeriodo = row.insertCell(0);
                const texto = (i + 1) % 12 === 0 ? `Ano ${(i + 1) / 12}` : periodos[i];
                cellPeriodo.textContent = texto;
                cellPeriodo.className = 'periodo-col';
                
                // Patrimônio em Reais
                const cellPatrimonioReais = row.insertCell(1);
                cellPatrimonioReais.textContent = `R$ ${formatarValor(patrimonioReais[i])}`;
                cellPatrimonioReais.className = 'valor-col moeda-brl';
                
                // Patrimônio em Dólares
                const cellPatrimonioDolares = row.insertCell(2);
                cellPatrimonioDolares.textContent = `US$ ${formatarValor(patrimonioDolares[i])}`;
                cellPatrimonioDolares.className = 'valor-col moeda-usd';
                
                // Patrimônio em Euros
                const cellPatrimonioEuros = row.insertCell(3);
                cellPatrimonioEuros.textContent = `€ ${formatarValor(patrimonioEuros[i])}`;
                cellPatrimonioEuros.className = 'valor-col moeda-eur';
                
                // Juros em Reais
                const cellJuros = row.insertCell(4);
                const jurosAno = i >= 12 ? (jurosAcumulados[i] - jurosAcumulados[i - 12]) : jurosAcumulados[i];
                cellJuros.textContent = `R$ ${formatarValor(jurosAno)}`;
                cellJuros.className = 'valor-col juros-col';
                
                // Aportes em Reais
                const cellAportesReais = row.insertCell(5);
                const aportesAnoReais = i >= 12 ? (aportesAcumuladosReais[i] - aportesAcumuladosReais[i - 12]) : aportesAcumuladosReais[i];
                cellAportesReais.textContent = `R$ ${formatarValor(aportesAnoReais)}`;
                cellAportesReais.className = 'valor-col moeda-brl';
                
                // Aportes em Dólares
                const cellAportesDolares = row.insertCell(6);
                const aportesAnoDolares = i >= 12 ? (aportesAcumuladosDolares[i] - aportesAcumuladosDolares[i - 12]) : aportesAcumuladosDolares[i];
                cellAportesDolares.textContent = `US$ ${formatarValor(aportesAnoDolares)}`;
                cellAportesDolares.className = 'valor-col moeda-usd';
                
                // Aportes em Euros
                const cellAportesEuros = row.insertCell(7);
                const aportesAnoEuros = i >= 12 ? (aportesAcumuladosEuros[i] - aportesAcumuladosEuros[i - 12]) : aportesAcumuladosEuros[i];
                cellAportesEuros.textContent = `€ ${formatarValor(aportesAnoEuros)}`;
                cellAportesEuros.className = 'valor-col moeda-eur';
                
                // Retiradas em Reais
                const cellRetiradasReais = row.insertCell(8);
                const retiradasAnoReais = i >= 12 ? (retiradasAcumuladasReais[i] - retiradasAcumuladasReais[i - 12]) : retiradasAcumuladasReais[i];
                cellRetiradasReais.textContent = `R$ ${formatarValor(retiradasAnoReais)}`;
                cellRetiradasReais.className = 'valor-col moeda-brl';
                
                // Retiradas em Dólares
                const cellRetiradasDolares = row.insertCell(9);
                const retiradasAnoDolares = i >= 12 ? (retiradasAcumuladasDolares[i] - retiradasAcumuladasDolares[i - 12]) : retiradasAcumuladasDolares[i];
                cellRetiradasDolares.textContent = `US$ ${formatarValor(retiradasAnoDolares)}`;
                cellRetiradasDolares.className = 'valor-col moeda-usd';
                
                // Retiradas em Euros
                const cellRetiradasEuros = row.insertCell(10);
                const retiradasAnoEuros = i >= 12 ? (retiradasAcumuladasEuros[i] - retiradasAcumuladasEuros[i - 12]) : retiradasAcumuladasEuros[i];
                cellRetiradasEuros.textContent = `€ ${formatarValor(retiradasAnoEuros)}`;
                cellRetiradasEuros.className = 'valor-col moeda-eur';
                
                // Adicionar evento de clique para mostrar detalhes do período
                row.style.cursor = 'pointer';
                row.title = 'Clique para ver detalhes';
                
                row.addEventListener('click', function() {
                    const periodo = parseInt(this.getAttribute('data-periodo'));
                    abrirModalDetalhes(periodo);
                });
            }
        }
    }
    
    // Função para formatar valores monetários no estilo brasileiro
    function formatarValor(valor) {
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    // Função para exibir alertas
    function exibirAlerta(mensagem, tipo = 'sucesso') {
        const container = document.querySelector('.results-container') || document.body;
        
        // Criar elemento de alerta
        const alertaDiv = document.createElement('div');
        alertaDiv.className = tipo === 'erro' ? 'alerta-mensagem alerta-erro' : 'alerta-mensagem';
        alertaDiv.textContent = mensagem;
        
        // Inserir no início do container
        if (container.firstChild) {
            container.insertBefore(alertaDiv, container.firstChild);
        } else {
            container.appendChild(alertaDiv);
        }
        
        // Remover o alerta após alguns segundos
        setTimeout(() => {
            if (alertaDiv.parentNode) {
                alertaDiv.parentNode.removeChild(alertaDiv);
            }
        }, 5000);
    }
    
    // Inicializar calculadora
    calcularProjecao();

    // Função para configurar o modal de detalhes
    function configurarModalDetalhes(
        patrimonioReais, patrimonioDolares, patrimonioEuros,
        jurosAcumulados, jurosMensais,
        retiradasPorMoeda, retiradasMensaisReais,
        periodos, taxaCambioDolar, taxaCambioEuro
    ) {
        // Salvar os dados para referência global
        window.dadosPatrimonioReais = patrimonioReais;
        window.dadosPatrimonioDolares = patrimonioDolares;
        window.dadosPatrimonioEuros = patrimonioEuros;
        window.dadosJurosAcumulados = jurosAcumulados;
        window.dadosJurosMensais = jurosMensais;
        window.dadosRetiradasPorMoeda = retiradasPorMoeda;
        window.dadosTaxaCambioDolar = taxaCambioDolar;
        window.dadosTaxaCambioEuro = taxaCambioEuro;
        
        const modal = document.getElementById('detalhesModal');
        const fecharModalBtn = modal.querySelector('.fechar-modal');
        const tabs = modal.querySelectorAll('.tab-btn');
        
        // Função para fechar o modal
        function fecharModal() {
            modal.style.display = 'none';
        }
        
        // Evento para fechar o modal ao clicar no 'X'
        fecharModalBtn.addEventListener('click', fecharModal);
        
        // Evento para fechar o modal ao clicar fora dele
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                fecharModal();
            }
        });
        
        // Evento para fechar o modal com a tecla ESC
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                fecharModal();
            }
        });
        
        // Configurar abas
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remover a classe 'active' de todas as abas
                tabs.forEach(t => t.classList.remove('active'));
                
                // Adicionar a classe 'active' à aba clicada
                this.classList.add('active');
                
                // Mostrar os detalhes da aba selecionada
                const tabSelecionada = this.getAttribute('data-tab');
                const periodo = parseInt(modal.getAttribute('data-periodo'));
                
                mostrarDetalhesTab(periodo, tabSelecionada);
            });
        });
        
        // Adicionar gesto de deslizar para fechar em dispositivos móveis
        let touchStartY;
        let touchEndY;
        
        modal.addEventListener('touchstart', function(event) {
            touchStartY = event.touches[0].clientY;
        }, false);
        
        modal.addEventListener('touchmove', function(event) {
            touchEndY = event.touches[0].clientY;
        }, false);
        
        modal.addEventListener('touchend', function(event) {
            if (touchStartY && touchEndY && touchEndY - touchStartY > 100) {
                // Deslizou para baixo, fechar o modal
                fecharModal();
            }
            touchStartY = null;
            touchEndY = null;
        }, false);
    }

    // Função para abrir o modal de detalhes de um período específico
    function abrirModalDetalhes(periodo) {
        const modal = document.getElementById('detalhesModal');
        const modalTitulo = document.getElementById('modalTitulo');
        const tabAtiva = modal.querySelector('.tab-btn.active');
        
        // Atualizar título do modal
        const mes = (periodo % 12) + 1;
        const ano = Math.floor(periodo / 12) + 1;
        modalTitulo.textContent = `Detalhes - Mês ${mes}, Ano ${ano}`;
        
        // Guardar o período atual para referência
        modal.setAttribute('data-periodo', periodo);
        
        // Mostrar os detalhes da aba ativa
        const tabAtual = tabAtiva.getAttribute('data-tab');
        
        // Mostrar a aba específica com os detalhes
        mostrarDetalhesTab(periodo, tabAtual);
        
        // Exibir o modal
        modal.style.display = "block";
        
        // Focar no modal para acessibilidade
        setTimeout(() => modalTitulo.focus(), 100);
    }

    // Função global para mostrar a aba de detalhes, acessível a partir de abrirModalDetalhes
    function mostrarDetalhesTab(periodo, tab) {
        const detalhesTabela = document.getElementById('detalhesTabela');
        const patrimonioReais = window.dadosPatrimonioReais;
        const patrimonioDolares = window.dadosPatrimonioDolares;
        const patrimonioEuros = window.dadosPatrimonioEuros;
        const jurosAcumulados = window.dadosJurosAcumulados;
        const jurosMensais = window.dadosJurosMensais;
        const retiradasPorMoeda = window.dadosRetiradasPorMoeda;
        const taxaCambioDolar = window.dadosTaxaCambioDolar;
        const taxaCambioEuro = window.dadosTaxaCambioEuro;
        
        let conteudo = '';
        
        switch(tab) {
            case 'patrimonio':
                // Preparar dados para o gráfico de evolução do patrimônio para os 12 meses anteriores
                let dadosGraficoPatrimonio = prepararDadosGraficoDetalhe(periodo, 'patrimonio');
                
                conteudo = `
                    <div class="grafico-detalhe-container">
                        <h4>Evolução do Patrimônio nos Últimos 12 Meses</h4>
                        <canvas id="graficoDetalhePatrimonio" height="250"></canvas>
                    </div>
                    
                    <div class="tabela-responsiva">
                        <table class="tabela-detalhes">
                            <thead>
                                <tr>
                                    <th>Moeda</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Reais (R$)</td>
                                    <td>R$ ${formatarValor(patrimonioReais[periodo])}</td>
                                </tr>
                                <tr>
                                    <td>Dólares (US$)</td>
                                    <td>US$ ${formatarValor(patrimonioDolares[periodo])}</td>
                                </tr>
                                <tr>
                                    <td>Euros (€)</td>
                                    <td>€ ${formatarValor(patrimonioEuros[periodo])}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                
                detalhesTabela.innerHTML = conteudo;
                
                // Criar o gráfico após renderizar o HTML
                setTimeout(() => {
                    criarGraficoDetalhe('graficoDetalhePatrimonio', dadosGraficoPatrimonio);
                }, 50);
                break;
                
            case 'juros':
                // Preparar dados para o gráfico de juros para os 12 meses anteriores
                let dadosGraficoJuros = prepararDadosGraficoDetalhe(periodo, 'juros');
                
                conteudo = `
                    <div class="grafico-detalhe-container">
                        <h4>Evolução dos Juros nos Últimos 12 Meses</h4>
                        <canvas id="graficoDetalheJuros" height="250"></canvas>
                    </div>
                    
                    <div class="tabela-responsiva">
                        <table class="tabela-detalhes">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor em Reais</th>
                                    <th>Valor em Dólares</th>
                                    <th>Valor em Euros</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Juros no mês</td>
                                    <td>R$ ${formatarValor(jurosMensais[periodo])}</td>
                                    <td>US$ ${formatarValor(jurosMensais[periodo] / taxaCambioDolar)}</td>
                                    <td>€ ${formatarValor(jurosMensais[periodo] / taxaCambioEuro)}</td>
                                </tr>
                                <tr>
                                    <td>Juros acumulados</td>
                                    <td>R$ ${formatarValor(jurosAcumulados[periodo])}</td>
                                    <td>US$ ${formatarValor(jurosAcumulados[periodo] / taxaCambioDolar)}</td>
                                    <td>€ ${formatarValor(jurosAcumulados[periodo] / taxaCambioEuro)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                
                detalhesTabela.innerHTML = conteudo;
                
                // Criar o gráfico após renderizar o HTML
                setTimeout(() => {
                    criarGraficoDetalhe('graficoDetalheJuros', dadosGraficoJuros);
                }, 50);
                break;
                
            case 'retiradas':
                // Preparar dados para o gráfico de retiradas para os 12 meses anteriores
                let dadosGraficoRetiradas = prepararDadosGraficoDetalhe(periodo, 'retiradas');
                
                const moedas = [
                    { codigo: 'BRL', simbolo: 'R$', nome: 'Reais' },
                    { codigo: 'USD', simbolo: 'US$', nome: 'Dólares' },
                    { codigo: 'EUR', simbolo: '€', nome: 'Euros' }
                ];
                
                conteudo = `
                    <div class="grafico-detalhe-container">
                        <h4>Evolução das Retiradas nos Últimos 12 Meses</h4>
                        <canvas id="graficoDetalheRetiradas" height="250"></canvas>
                    </div>
                    
                    <div class="tabela-responsiva">
                        <table class="tabela-detalhes">
                            <thead>
                                <tr>
                                    <th>Moeda</th>
                                    <th>Valor no mês</th>
                                    <th>Valor acumulado</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                moedas.forEach(moeda => {
                    const valorMes = retiradasPorMoeda[moeda.codigo].mensais[periodo] || 0;
                    const valorAcumulado = retiradasPorMoeda[moeda.codigo].acumuladas[periodo] || 0;
                    
                    conteudo += `
                        <tr>
                            <td>${moeda.nome} (${moeda.simbolo})</td>
                            <td>${moeda.simbolo} ${formatarValor(valorMes)}</td>
                            <td>${moeda.simbolo} ${formatarValor(valorAcumulado)}</td>
                        </tr>
                    `;
                });
                
                conteudo += `
                            </tbody>
                        </table>
                    </div>
                `;
                
                detalhesTabela.innerHTML = conteudo;
                
                // Criar o gráfico após renderizar o HTML
                setTimeout(() => {
                    criarGraficoDetalhe('graficoDetalheRetiradas', dadosGraficoRetiradas);
                }, 50);
                break;
        }
    }
    
    // Função para preparar dados para o gráfico de detalhe
    function prepararDadosGraficoDetalhe(periodoAtual, tipo) {
        // Obter meses anteriores (até 12 meses antes)
        const mesesAnteriores = Math.min(periodoAtual, 11);
        const periodoInicial = periodoAtual - mesesAnteriores;
        
        // Arrays para armazenar os dados
        const labels = [];
        const dados = {};
        
        // Preparar rótulos e inicializar arrays de dados
        for (let i = periodoInicial; i <= periodoAtual; i++) {
            // Formatar o rótulo como "Mês N"
            const mes = (i % 12) + 1;
            const ano = Math.floor(i / 12) + 1;
            labels.push(`Mês ${mes}, Ano ${ano}`);
        }
        
        switch (tipo) {
            case 'patrimonio':
                // Dados de patrimônio em diferentes moedas
                dados.patrimonioReais = [];
                dados.patrimonioDolares = [];
                dados.patrimonioEuros = [];
                
                for (let i = periodoInicial; i <= periodoAtual; i++) {
                    dados.patrimonioReais.push(window.dadosPatrimonioReais[i]);
                    dados.patrimonioDolares.push(window.dadosPatrimonioDolares[i]);
                    dados.patrimonioEuros.push(window.dadosPatrimonioEuros[i]);
                }
                break;
                
            case 'juros':
                // Dados de juros mensais e acumulados
                dados.jurosMensais = [];
                dados.jurosAcumulados = [];
                
                for (let i = periodoInicial; i <= periodoAtual; i++) {
                    dados.jurosMensais.push(window.dadosJurosMensais[i]);
                    dados.jurosAcumulados.push(window.dadosJurosAcumulados[i]);
                }
                break;
                
            case 'retiradas':
                // Dados de retiradas em diferentes moedas
                dados.retiradasReais = [];
                dados.retiradasDolares = [];
                dados.retiradasEuros = [];
                
                for (let i = periodoInicial; i <= periodoAtual; i++) {
                    dados.retiradasReais.push(window.dadosRetiradasPorMoeda.BRL.mensais[i] || 0);
                    dados.retiradasDolares.push(window.dadosRetiradasPorMoeda.USD.mensais[i] || 0);
                    dados.retiradasEuros.push(window.dadosRetiradasPorMoeda.EUR.mensais[i] || 0);
                }
                break;
        }
        
        return {
            labels: labels,
            dados: dados,
            tipo: tipo
        };
    }
    
    // Função para criar gráfico de detalhe
    function criarGraficoDetalhe(canvasId, dadosGrafico) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        let datasets = [];
        
        switch (dadosGrafico.tipo) {
            case 'patrimonio':
                datasets = [
                    {
                        label: 'Patrimônio em Reais (R$)',
                        data: dadosGrafico.dados.patrimonioReais,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Patrimônio em Dólares (US$)',
                        data: dadosGrafico.dados.patrimonioDolares,
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Patrimônio em Euros (€)',
                        data: dadosGrafico.dados.patrimonioEuros,
                        backgroundColor: 'rgba(155, 89, 182, 0.2)',
                        borderColor: 'rgba(155, 89, 182, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    }
                ];
                break;
                
            case 'juros':
                datasets = [
                    {
                        label: 'Juros Mensais (R$)',
                        data: dadosGrafico.dados.jurosMensais,
                        backgroundColor: 'rgba(230, 126, 34, 0.2)',
                        borderColor: 'rgba(230, 126, 34, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Juros Acumulados (R$)',
                        data: dadosGrafico.dados.jurosAcumulados,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ];
                break;
                
            case 'retiradas':
                datasets = [
                    {
                        label: 'Retiradas em Reais (R$)',
                        data: dadosGrafico.dados.retiradasReais,
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Retiradas em Dólares (US$)',
                        data: dadosGrafico.dados.retiradasDolares,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Retiradas em Euros (€)',
                        data: dadosGrafico.dados.retiradasEuros,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    }
                ];
                break;
        }
        
        // Configurações específicas para o gráfico de juros
        let scales = {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (dadosGrafico.tipo === 'patrimonio') {
                            // Não incluímos o símbolo da moeda aqui, pois há múltiplas moedas
                            return formatarValor(value);
                        } else if (dadosGrafico.tipo === 'juros') {
                            // Juros são sempre calculados em reais
                            return 'R$ ' + formatarValor(value);
                        } else if (dadosGrafico.tipo === 'retiradas') {
                            // Não incluímos o símbolo da moeda aqui, pois há múltiplas moedas
                            return formatarValor(value);
                        }
                    }
                }
            }
        };
        
        // Para juros, usar dois eixos Y
        if (dadosGrafico.tipo === 'juros') {
            scales.y1 = {
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    callback: function(value) {
                        // Juros acumulados são em reais
                        return 'R$ ' + formatarValor(value);
                    }
                }
            };
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dadosGrafico.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: scales,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const datasetLabel = context.dataset.label || '';
                                const value = context.raw;
                                
                                // Verificar qual símbolo de moeda usar baseado no label do dataset
                                if (datasetLabel.includes('Reais') || datasetLabel.includes('(R$)')) {
                                    return 'R$ ' + formatarValor(value);
                                } else if (datasetLabel.includes('Dólares') || datasetLabel.includes('(US$)')) {
                                    return 'US$ ' + formatarValor(value);
                                } else if (datasetLabel.includes('Euros') || datasetLabel.includes('(€)')) {
                                    return '€ ' + formatarValor(value);
                                } else {
                                    // Se não conseguir determinar, usar R$ como padrão
                                    return 'R$ ' + formatarValor(value);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}); 