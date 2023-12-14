const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JSON_FOLDER_PATH = path.join(__dirname, 'json'); 
const LOCALES_JSON_FOLDER_PATH = path.join(__dirname, 'json/locales'); 

function transformKeysToLowerCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(value => transformKeysToLowerCase(value));
    }
    
    let newObj = {};
    for (let key in obj) {
        newObj[key.toLowerCase()] = transformKeysToLowerCase(obj[key]);
    }
    
    return newObj;
}

// 获取locales目录下的特定的 JSON 文件
app.get('/json-files/locales/:filename', (req, res) => {
    const filePath = path.join(LOCALES_JSON_FOLDER_PATH, req.params.filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found.');
            }
            return res.status(500).send('Server error.');
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(transformKeysToLowerCase(jsonData));
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
