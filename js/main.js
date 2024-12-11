// API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', () => {
    // 检查当前页面是否是工具页面
    const isToolsPage = window.location.pathname.includes('tools.html');
    const isLandingPage = window.location.pathname.length > 1;
    
    if (isToolsPage) {
        initializeGeneratorPage();
    } else if (isLandingPage) {
        initializeLandingPage();
    }
});

function initializeLandingPage() {
    const generateBtn = document.getElementById('generateBtn');
    const result = document.getElementById('result');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            try {
                generateBtn.disabled = true;
                const loadingSpan = document.createElement('span');
                loadingSpan.className = 'loading';
                generateBtn.appendChild(loadingSpan);
                
                // 从URL路径获取国家代码
                const country = window.location.pathname.substring(1);
                const response = await fetch(`${API_BASE_URL}/address/${country}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || '生成地址失败');
                }
                
                // 显示结果
                result.style.display = 'block';
                const address = `${data.street}, ${data.city}, ${data.state} ${data.zipCode}`;
                result.innerHTML = `
                    <div class="address-result">
                        <p class="mb-2">${address}</p>
                        <button class="copy-button" onclick="copyToClipboard('${address}')">
                            复制地址
                        </button>
                    </div>
                `;
            } catch (error) {
                console.error('Error:', error);
                result.style.display = 'block';
                result.innerHTML = `<p class="error">${error.message || '生成地址时发生错误，请稍后重试。'}</p>`;
            } finally {
                generateBtn.disabled = false;
                const loadingSpan = generateBtn.querySelector('.loading');
                if (loadingSpan) {
                    loadingSpan.remove();
                }
            }
        });
    }
}

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
            console.log('Tax-free states response:', data);
            
            if (!response.ok) {
                if (data.error && data.error.includes('rate limit exceeded')) {
                    throw new Error('速率限制：请等待一小时后再试');
                }
                throw new Error(data.error || '获取免税州信息失败');
            }
            
            // 检查数据格式
            if (!data || !Array.isArray(data.states)) {
                throw new Error('无效的免税州数据格式');
            }
            
            displayTaxFreeStates(data.states);
        } catch (error) {
            console.error('Error:', error);
            showError(taxFreeResult, error.message || '获取免税州信息时发生错误，请稍后重试。');
        } finally {
            taxFreeBtn.disabled = false;
            taxFreeBtn.textContent = '查看免税州列表';
        }
    }

    // Display Functions
    function displayAddress(data) {
        // 检查是否有地址数据
        if (!data) {
            showError(addressResult, '无效的地址数据');
            return;
        }

        const address = `${data.street}, ${data.city}, ${data.state} ${data.zipCode}`;
        const html = `
            <div class="space-y-4">
                <div>
                    <p class="result-label">地址信息</p>
                    <p class="result-value whitespace-pre-line">${address}</p>
                    <button class="copy-button" onclick="copyToClipboard('${address}')">
                        复制地址
                    </button>
                </div>
            </div>
        `;
        
        addressResult.innerHTML = html;
        addressResult.classList.remove('hidden');
    }

    function displayTaxFreeStates(states) {
        if (!Array.isArray(states) || states.length === 0) {
            showError(taxFreeResult, '无效的免税州数据');
            return;
        }

        const html = `
            <div class="space-y-6">
                <h2 class="text-xl font-bold mb-4">美国免税州列表</h2>
                ${states.map(state => `
                    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${state.name} (${state.code})</h3>
                        <p class="text-gray-600">${state.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        taxFreeResult.innerHTML = html;
        taxFreeResult.classList.remove('hidden');
    }

    function showError(element, message) {
        element.innerHTML = `<p class="error">${message}</p>`;
        element.classList.remove('hidden');
    }

    // Event Listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAddress);
    }
    if (taxFreeBtn) {
        taxFreeBtn.addEventListener('click', getTaxFreeStates);
    }
}

// Utility Functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('地址已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
