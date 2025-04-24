const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Certifique-se de que o diretório icons existe
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

console.log('Convertendo ícones para diferentes formatos...');

// Converter para PNG em diferentes tamanhos (você precisa ter o ImageMagick instalado)
const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

for (const size of sizes) {
    const outputFile = path.join('icons', `icon-${size}.png`);
    exec(`convert -background none -resize ${size}x${size} icons/icon.svg ${outputFile}`, (error) => {
        if (error) {
            console.error(`Erro ao converter para ${size}x${size}:`, error.message);
        } else {
            console.log(`Criado ${outputFile}`);
        }
    });
}

// Para Windows: combinar em um único arquivo ICO
exec(`convert icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-64.png icons/icon-128.png icons/icon-256.png icons/icon.ico`, (error) => {
    if (error) {
        console.error('Erro ao criar arquivo ICO:', error.message);
    } else {
        console.log('Criado icons/icon.ico');
    }
});

// Para macOS: converter para formato ICNS
exec(`png2icns icons/icon.icns icons/icon-16.png icons/icon-32.png icons/icon-128.png icons/icon-256.png icons/icon-512.png icons/icon-1024.png`, (error) => {
    if (error) {
        console.error('Erro ao criar arquivo ICNS:', error.message);
        console.log('Nota: Você precisa ter o pacote libicns-utils instalado para criar arquivos ICNS no Linux ou macOS.');
        console.log('No Ubuntu/Debian: sudo apt-get install icnsutils');
        console.log('No macOS: brew install libicns');
    } else {
        console.log('Criado icons/icon.icns');
    }
});

console.log('\nNota importante: Para executar este script corretamente, você precisa ter instalado:');
console.log('1. ImageMagick para conversão de SVG para PNG e criação do arquivo ICO');
console.log('   - No Ubuntu/Debian: sudo apt-get install imagemagick');
console.log('   - No macOS: brew install imagemagick');
console.log('   - No Windows: https://imagemagick.org/script/download.php');
console.log('2. libicns-utils para criar arquivos ICNS (formato macOS)');
console.log('   - No Ubuntu/Debian: sudo apt-get install icnsutils');
console.log('   - No macOS: brew install libicns');
console.log('\nSe alguma das conversões falhar, verifique se você tem os pacotes necessários instalados.\n'); 