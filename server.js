import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 代理 API 请求
app.get('/api/address/:country', async (req, res) => {
    const country = req.params.country;
    const apiUrls = {
        'us': 'https://www.meiguodizhi.com/api/v1/dz/us',
        'gb': 'https://www.meiguodizhi.com/api/v1/dz/uk'
    };

    const apiUrl = apiUrls[country.toLowerCase()];
    if (!apiUrl) {
        return res.status(400).json({ error: '不支持的国家代码' });
    }

    try {
        console.log('正在请求地址:', apiUrl);
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const text = await response.text();
        console.log('API原始响应:', text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // 如果不是JSON，尝试解析HTML响应
            const addressMatch = text.match(/<div[^>]*>([^<]+)<\/div>/);
            if (addressMatch) {
                data = { address: addressMatch[1].trim() };
            } else {
                throw new Error('无法解析返回的数据');
            }
        }

        if (!data || (!data.address && !data.dz)) {
            throw new Error('返回的数据格式无效');
        }

        // 标准化响应格式
        const formattedData = {
            address: data.dz || data.address || '',
            country: country.toUpperCase(),
            timestamp: new Date().toISOString()
        };

        console.log('发送给客户端的数据:', formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('API请求失败:', error);
        res.status(500).json({ 
            error: '获取地址数据失败', 
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
