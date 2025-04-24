const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer process (janela do navegador)
contextBridge.exposeInMainWorld('electronAPI', {
    // Métodos de manipulação de arquivos
    salvarCalculo: (callback) => ipcRenderer.on('salvar-calculo', callback),
    carregarCalculo: (callback) => ipcRenderer.on('carregar-calculo', callback),
    salvarDados: (dados, caminhoArquivo) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke('salvar-dados', dados, caminhoArquivo)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    },
    
    // Info do sistema
    getVersion: () => {
        return process.env.npm_package_version || '1.0.0';
    },
    getPlatform: () => {
        return process.platform;
    }
}); 