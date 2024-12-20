import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// 导入本地数据生成模块
import {
    getCountryData,
    getRegions,
    getCities,
    getStreets,
    getRandomElement,
    generateStreetNumber,
    generatePostalCode,
    generatePhoneNumber
} from './js/address-data.js';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 生成随机地址的函数
async function generateRandomAddress(country) {
    const countryData = await getCountryData(country);
    if (!countryData) {
        throw new Error('不支持的国家代码');
    }

    const regions = await getRegions(country);
    const region = getRandomElement(regions);
    const cities = await getCities(country);
    const city = getRandomElement(cities);
    const streets = await getStreets(country);
    const street = getRandomElement(streets);
    const streetNumber = generateStreetNumber();
    const zipCode = generatePostalCode(country);
    const phone = generatePhoneNumber(country);

    return {
        street: `${streetNumber} ${street}`,
        city,
        state: region.abbreviation || region.abbr || region.name,
        zipCode,
        phone,
        country: country.toUpperCase(),
        timestamp: new Date().toISOString()
    };
}

// 支持的国家列表
const SUPPORTED_COUNTRIES = {
    // 英语国家
    'us': '美国',
    'ca': '加拿大',
    'au': '澳大利亚',
    'nz': '新西兰',
    'ie': '爱尔兰',
    'sg': '新加坡',
    'uk': '英国',
    // 亚洲国家
    'jp': '日本',
    'hk': '香港',
    'tw': '台湾',
    'kr': '韩国',
    'th': '泰国',
    'vn': '越南',
    'my': '马来西亚',
    'ph': '菲律宾',
    'ru': '俄罗斯'
};

// 国家语言映射
const COUNTRY_LANGUAGES = {
    'jp': 'ja',
    'hk': 'zh-HK',
    'tw': 'zh-TW',
    'kr': 'ko',
    'th': 'th',
    'vn': 'vi',
    'my': 'ms',
    'ph': 'tl',
    'ru': 'ru'
};

// 生成落地页内容的函数
async function generateLandingPageContent(country) {
    const countryName = SUPPORTED_COUNTRIES[country];
    const language = COUNTRY_LANGUAGES[country] || 'en';
    
    try {
        // 读取模板文件
        const template = await fs.readFile(path.join(__dirname, 'landing-pages/template.html'), 'utf8');
        
        // 获取国家的示例地址
        const sampleAddress = await generateRandomAddress(country);
        
        // 替换模板中的变量
        let content = template
            .replace(/\{\{COUNTRY_NAME\}\}/g, countryName)
            .replace(/\{\{COUNTRY_CODE\}\}/g, country.toUpperCase())
            .replace(/\{\{LANGUAGE\}\}/g, language)
            .replace(/\{\{SAMPLE_ADDRESS\}\}/g, JSON.stringify(sampleAddress, null, 2));
            
        return content;
    } catch (error) {
        console.error(`生成落地页内容时出错 (${country}):`, error);
        throw error;
    }
}

app.get('/api/countries', (req, res) => {
    res.json({
        countries: Object.entries(SUPPORTED_COUNTRIES).map(([code, name]) => ({
            code: code.toUpperCase(),
            name,
            language: COUNTRY_LANGUAGES[code] || 'en'
        })),
        timestamp: new Date().toISOString()
    });
});

app.post('/api/generate', async (req, res) => {
    try {
        const { country } = req.body;
        if (!country || !SUPPORTED_COUNTRIES[country.toLowerCase()]) {
            return res.status(400).json({ error: '无效的国家代码' });
        }

        const address = await generateRandomAddress(country.toLowerCase());
        res.json(address);
    } catch (error) {
        console.error('生成地址时出错:', error);
        res.status(500).json({ error: '生成地址时出错' });
    }
});

app.get('/api/address/:country', async (req, res) => {
    const country = req.params.country.toLowerCase();
    
    if (!SUPPORTED_COUNTRIES[country]) {
        return res.status(400).json({ 
            error: '不支持的国家代码',
            supportedCountries: Object.keys(SUPPORTED_COUNTRIES).map(code => code.toUpperCase()),
            timestamp: new Date().toISOString() 
        });
    }

    try {
        const addressData = await generateRandomAddress(country);
        console.log('生成的地址数据:', addressData);
        res.json(addressData);
    } catch (error) {
        console.error('生成地址失败:', error);
        res.status(500).json({ 
            error: '生成地址失败', 
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 美国免税州数据
const TAX_FREE_STATES = [
    {
        name: 'Alaska',
        code: 'AK',
        description: 'Alaska has no state sales tax, though some municipalities may levy local sales taxes.'
    },
    {
        name: 'Delaware',
        code: 'DE',
        description: 'Delaware has no state or local sales tax.'
    },
    {
        name: 'Montana',
        code: 'MT',
        description: 'Montana has no general sales tax, but does tax some luxury items and tourist purchases.'
    },
    {
        name: 'New Hampshire',
        code: 'NH',
        description: 'New Hampshire has no general sales tax, but does have some specific taxes on meals, rentals, and telecommunications.'
    },
    {
        name: 'Oregon',
        code: 'OR',
        description: 'Oregon has no state sales tax. Some local governments charge sales tax on specific items.'
    }
];

app.get('/api/tax-free-states', (req, res) => {
    console.log('Sending tax-free states:', TAX_FREE_STATES);
    res.json({
        states: TAX_FREE_STATES,
        timestamp: new Date().toISOString()
    });
});

// 落地页路由
app.get('/:country', async (req, res, next) => {
    const country = req.params.country.toLowerCase();
    
    // 如果是静态资源或API路由，跳过处理
    if (country.startsWith('api') || country.startsWith('css') || country.startsWith('js')) {
        return next();
    }
    
    // 移除.html后缀（如果有）
    const cleanCountry = country.replace(/\.html$/, '');
    
    if (SUPPORTED_COUNTRIES[cleanCountry]) {
        // 如果URL不包含.html后缀，进行301永久重定向
        if (!country.endsWith('.html')) {
            return res.redirect(301, `/${cleanCountry}.html`);
        }
        res.send(await generateLandingPageContent(cleanCountry));
    } else {
        // 返回404状态码而不是重定向
        res.status(404).send('Page Not Found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('支持的国家:', Object.entries(SUPPORTED_COUNTRIES)
        .map(([code, name]) => `${code.toUpperCase()}: ${name}`)
        .join(', '));
});
