const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    // Criar a janela do navegador
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icons/icon.png')
    });

    // Carregar o arquivo HTML da aplicação
    mainWindow.loadFile('index.html');

    // Menu da aplicação
    const template = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Salvar Cálculo',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => salvarCalculo()
                },
                {
                    label: 'Carregar Cálculo',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => carregarCalculo()
                },
                { type: 'separator' },
                {
                    label: 'Sair',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'Visualização',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => showAboutDialog()
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Redimensionar janela para o tamanho do conteúdo
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle('Calculadora Financeira');
    });

    // Evento quando a janela é fechada
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// Função para mostrar o diálogo "Sobre"
function showAboutDialog() {
    dialog.showMessageBox(mainWindow, {
        title: 'Sobre a Calculadora Financeira',
        message: 'Calculadora Financeira',
        detail: 'Versão 1.0.0\n\nUma ferramenta para projeções financeiras e cálculos de patrimônio e retiradas em múltiplas moedas.',
        buttons: ['OK'],
        icon: path.join(__dirname, 'icons/icon.png')
    });
}

// Função para salvar cálculo
function salvarCalculo() {
    dialog.showSaveDialog(mainWindow, {
        title: 'Salvar Cálculo',
        defaultPath: path.join(app.getPath('documents'), 'calculo.json'),
        filters: [
            { name: 'Arquivos JSON', extensions: ['json'] }
        ]
    }).then(result => {
        if (!result.canceled) {
            mainWindow.webContents.send('salvar-calculo', result.filePath);
        }
    }).catch(err => console.error(err));
}

// Função para carregar cálculo
function carregarCalculo() {
    dialog.showOpenDialog(mainWindow, {
        title: 'Carregar Cálculo',
        defaultPath: app.getPath('documents'),
        filters: [
            { name: 'Arquivos JSON', extensions: ['json'] }
        ],
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            try {
                const data = fs.readFileSync(result.filePaths[0], 'utf8');
                mainWindow.webContents.send('carregar-calculo', data);
            } catch (err) {
                console.error('Erro ao ler o arquivo:', err);
                dialog.showErrorBox(
                    'Erro ao carregar arquivo',
                    'Não foi possível carregar o arquivo selecionado.'
                );
            }
        }
    }).catch(err => console.error(err));
}

// Função para salvar dados diretamente
ipcMain.handle('salvar-dados', async (event, dados, caminhoArquivo) => {
    try {
        fs.writeFileSync(caminhoArquivo, dados, 'utf8');
        return { success: true };
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return { success: false, error: error.message };
    }
});

// Criar a janela quando o Electron estiver pronto
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Sair da aplicação quando todas as janelas estiverem fechadas (exceto no macOS)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
}); 