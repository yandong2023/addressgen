// API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', () => {
    // 检查当前页面是否是工具页面
    const isToolsPage = window.location.pathname.includes('tools.html');
    
    if (isToolsPage) {
        initializeGeneratorPage();
    }
});

function initializeGeneratorPage() {
    const countrySelect = document.getElementById('countrySelect');
    const generateBtn = document.getElementById('generateBtn');
    const addressResult = document.getElementById('addressResult');
    const taxFreeBtn = document.getElementById('taxFreeBtn');
    const taxFreeResult = document.getElementById('taxFreeResult');

    // Generate Address
    async function generateAddress() {
        const country = countrySelect.value;
        try {
            generateBtn.disabled = true;
            generateBtn.textContent = '生成中...';
            
            const response = await fetch(`${API_BASE_URL}/address/${country}`);
            const data = await response.json();
            
            if (!response.ok) {
                if (data.error && data.error.includes('rate limit exceeded')) {
                    throw new Error('速率限制：请等待一小时后再试');
                }
                throw new Error(data.error || '生成地址失败');
            }
            
            displayAddress(data);
        } catch (error) {
            console.error('Error:', error);
            showError(addressResult, error.message || '生成地址时发生错误，请稍后重试。');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '生成地址';
        }
    }

    // Get Tax-Free States
    async function getTaxFreeStates() {
        try {
            taxFreeBtn.disabled = true;
            taxFreeBtn.textContent = '获取中...';
            
            const response = await fetch(`${API_BASE_URL}/tax-free-states`);
            const data = await response.json();
            
            if (!response.ok) {
                if (data.error && data.error.includes('rate limit exceeded')) {
                    throw new Error('速率限制：请等待一小时后再试');
                }
                throw new Error(data.error || '获取免税州信息失败');
            }
            
            displayTaxFreeStates(data);
        } catch (error) {
            console.error('Error:', error);
            showError(taxFreeResult, error.message || '获取免税州信息时发生错误，请稍后重试。');
        } finally {
            taxFreeBtn.disabled = false;
            taxFreeBtn.textContent = '获取免税州';
        }
    }

    // Display Functions
    function displayAddress(data) {
        // 检查是否有地址数据
        if (!data || !data.address) {
            showError(addressResult, '无效的地址数据');
            return;
        }

        const html = `
            <div class="space-y-4">
                <div>
                    <p class="result-label">地址信息</p>
                    <p class="result-value whitespace-pre-line">${data.address}</p>
                </div>
            </div>
        `;
        
        addressResult.innerHTML = html;
        addressResult.classList.remove('hidden');
    }

    function displayTaxFreeStates(states) {
        const html = `
            <div class="space-y-6">
                ${states.map(state => `
                    <div class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <h3 class="text-lg font-semibold text-gray-900">${state.name} (${state.code})</h3>
                        <p class="mt-2 text-gray-600">${state.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        taxFreeResult.innerHTML = html;
        taxFreeResult.classList.remove('hidden');
    }

    function showError(element, message) {
        element.innerHTML = `<p class="text-red-600">${message}</p>`;
        element.classList.remove('hidden');
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateAddress);
    taxFreeBtn.addEventListener('click', getTaxFreeStates);
}
