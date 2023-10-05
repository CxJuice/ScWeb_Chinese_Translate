const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // <-- 导入 cors 中间件

const app = express();
const PORT = process.env.PORT || 3000;
const JSON_FOLDER_PATH = path.join(__dirname, 'json'); 

app.use(cors()); // <-- 使用 cors 中间件以允许所有来源

// 获取文件夹内的所有 JSON 文件
app.get('/json-files', (req, res) => {
    fs.readdir(JSON_FOLDER_PATH, (err, files) => {
        if (err) {
            return res.status(500).send('Server error.');
        }
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        res.json(jsonFiles);
    });
});

// 获取特定的 JSON 文件
app.get('/json-files/:filename', (req, res) => {
    const filePath = path.join(JSON_FOLDER_PATH, req.params.filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found.');
            }
            return res.status(500).send('Server error.');
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
