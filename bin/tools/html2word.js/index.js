const fs = require('fs');
const path = require('path');
const htmlDocx = require('html-docx-js');

// 读取HTML文件内容
const htmlFilePath = path.join(__dirname, './index.html'); // 替换为你的HTML文件路径

// 转换HTML到Word
function exportHTMLToWord(htmlFilePath, outputFilePath) {
    // const converted = htmlDocx.asBlob(htmlContent);
    const buffer = fs.readFileSync(htmlFilePath);
    fs.writeFileSync(outputFilePath, buffer);
}

// 保存Word文件
const outputFilePath = path.join(__dirname, 'output.docx'); // 替换为你希望保存的Word文件路径
exportHTMLToWord(htmlFilePath, outputFilePath);

console.log('Word文档已生成:', outputFilePath);