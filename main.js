import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// 配置 API 地址
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 地址生成按钮事件
    document.getElementById('generateBtn')?.addEventListener('click', async () => {
        const countrySelect = document.getElementById('countrySelect');
        const countryCode = countrySelect.value;
        const resultDiv = document.getElementById('addressResult');
        
        try {
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = '<p class="text-gray-600">正在生成地址...</p>';
            
            const response = await fetch(`${API_BASE_URL}/address/${countryCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const address = await response.json();
            resultDiv.innerHTML = `
                <div class="space-y-2">
                    <p class="font-semibold">生成的地址：</p>
                    <div class="bg-gray-50 p-4 rounded">
                        <p>${address.street}</p>
                        <p>${address.city}, ${address.state} ${address.zipCode}</p>
                        <p>${address.country}</p>
                    </div>
                    <button class="btn-secondary w-full mt-4" onclick="copyAddress(this)">
                        复制地址
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p class="text-red-600">生成地址时出错，请稍后重试</p>';
        }
    });

    // 免税州按钮事件
    document.getElementById('taxFreeBtn')?.addEventListener('click', async () => {
        const resultDiv = document.getElementById('taxFreeResult');
        
        try {
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = '<p class="text-gray-600">正在加载免税州信息...</p>';
            
            const response = await fetch(`${API_BASE_URL}/tax-free-states`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            resultDiv.innerHTML = `
                <div class="space-y-4">
                    <h3 class="font-semibold">美国免税州列表：</h3>
                    <ul class="list-disc pl-5 space-y-2">
                        ${data.states.map(state => `
                            <li>
                                <strong>${state.name}</strong>
                                <p class="text-sm text-gray-600">${state.description}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p class="text-red-600">加载免税州信息时出错，请稍后重试</p>';
        }
    });
});

// 复制地址功能
window.copyAddress = function(button) {
    const addressDiv = button.previousElementSibling;
    const text = addressDiv.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = '已复制';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerText = originalText;
            button.disabled = false;
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
