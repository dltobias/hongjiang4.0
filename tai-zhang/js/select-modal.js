// 原料选择模态框
function showMaterialSelector(callback) {
    const materials = JSON.parse(localStorage.getItem('ledger_material') || '[]');

    // 创建模态框HTML
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 class="text-lg font-bold text-gray-800">选择原料批次</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 flex-1 overflow-hidden flex flex-col">
                <input type="text" id="materialSearch" placeholder="搜索批次号或名称..." 
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm mb-3 shrink-0">
                <div class="overflow-y-auto space-y-2 flex-1" id="materialList">
                    ${materials.length === 0 ? '<p class="text-center text-gray-400 text-sm py-4">暂无原料数据</p>' : ''}
                    ${materials.map(m => `
                        <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 material-item" 
                            data-id="${m.id || m.batchNo || ''}" 
                            data-name="${m.name || '未知原料'}">
                            <div class="font-medium text-sm text-gray-800">${m.id || m.batchNo || '无批次号'}</div>
                            <div class="text-xs text-gray-500">${m.name || '未知原料'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 搜索功能
    const searchInput = modal.querySelector('#materialSearch');
    const materialItems = modal.querySelectorAll('.material-item');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        materialItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(keyword) ? 'block' : 'none';
        });
    });

    // 选择功能
    materialItems.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const name = item.dataset.name;
            // 可以在这里添加更多数据
            callback({ id, name, quantity: '0' });
            modal.remove();
        });
    });

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 设备选择模态框
function showEquipmentSelector(callback) {
    const equipments = JSON.parse(localStorage.getItem('ledger_equipment') || '[]');

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 class="text-lg font-bold text-gray-800">选择设备</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 flex-1 overflow-hidden flex flex-col">
                <input type="text" id="equipmentSearch" placeholder="搜索设备名称或编号..." 
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm mb-3 shrink-0">
                <div class="overflow-y-auto space-y-2 flex-1" id="equipmentList">
                    ${equipments.length === 0 ? '<p class="text-center text-gray-400 text-sm py-4">暂无设备数据</p>' : ''}
                    ${equipments.map(e => `
                        <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 equipment-item" 
                            data-name="${e.name || e.id || '未知设备'}">
                            <div class="font-medium text-sm text-gray-800">${e.name || e.id || '未知设备'}</div>
                            <div class="text-xs text-gray-500">${e.model || '型号未知'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 搜索功能
    const searchInput = modal.querySelector('#equipmentSearch');
    const equipmentItems = modal.querySelectorAll('.equipment-item');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        equipmentItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(keyword) ? 'block' : 'none';
        });
    });

    // 选择功能
    equipmentItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            callback({ name });
            modal.remove();
        });
    });

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 人员选择模态框
function showPersonnelSelector(callback) {
    // 尝试从存储获取，如果没有则使用默认模拟数据
    let personnel = LedgerUtils.SafeStorage.get('ledger_personnel', []);
    if (personnel.length === 0) {
        // 模拟数据 - 基于 renyuan-GL-list.html
        personnel = [
            { id: 'EMP001', name: '张三', department: '生产部 - 组长' },
            { id: 'EMP002', name: '李四', department: '质检部 - 质检员' },
            { id: 'EMP003', name: '王五', department: '生产部 - 烘焙师' }
        ];
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 class="text-lg font-bold text-gray-800">选择人员</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 flex-1 overflow-hidden flex flex-col">
                <input type="text" id="personnelSearch" placeholder="搜索姓名或工号..." 
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm mb-3 shrink-0">
                <div class="overflow-y-auto space-y-2 flex-1" id="personnelList">
                    ${personnel.map(p => `
                        <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 personnel-item" 
                            data-id="${p.id}" 
                            data-name="${p.name}">
                            <div class="font-medium text-sm text-gray-800">${p.name}</div>
                            <div class="text-xs text-gray-500">${p.id} | ${p.department}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const searchInput = modal.querySelector('#personnelSearch');
    const items = modal.querySelectorAll('.personnel-item');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(keyword) ? 'block' : 'none';
        });
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            callback({ id: item.dataset.id, name: item.dataset.name });
            modal.remove();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 供应商选择模态框
function showSupplierSelector(callback) {
    // 从工厂预设获取供应商列表
    const presets = LedgerUtils.SafeStorage.get('factoryPresets', {});
    let suppliers = presets.suppliers || [];
    
    // 如果没有预设，提供一些默认建议
    if (suppliers.length === 0) {
        suppliers = ['安琪酵母股份有限公司', '中粮面业', '雀巢专业餐饮', '总统黄油'];
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 class="text-lg font-bold text-gray-800">选择供应商</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 flex-1 overflow-hidden flex flex-col">
                <input type="text" id="supplierSearch" placeholder="搜索供应商..." 
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm mb-3 shrink-0">
                <div class="overflow-y-auto space-y-2 flex-1" id="supplierList">
                    ${suppliers.map(s => `
                        <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 supplier-item" 
                            data-name="${typeof s === 'string' ? s : s.name}">
                            <div class="font-medium text-sm text-gray-800">${typeof s === 'string' ? s : s.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const searchInput = modal.querySelector('#supplierSearch');
    const items = modal.querySelectorAll('.supplier-item');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(keyword) ? 'block' : 'none';
        });
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            callback({ name: item.dataset.name });
            modal.remove();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 批次号选择模态框
function showBatchSelector(callback, type = 'all') {
    // type: 'all', 'production', 'material'
    let items = [];
    
    if (type === 'all' || type === 'production') {
        const production = LedgerUtils.SafeStorage.get('ledger_production', []);
        items = items.concat(production.map(p => ({
            id: p.id,
            name: p.productName,
            type: '生产批次',
            date: p.productionDate
        })));
    }
    
    if (type === 'all' || type === 'material') {
        const materials = LedgerUtils.SafeStorage.get('ledger_material', []);
        items = items.concat(materials.map(m => ({
            id: m.id || m.batchNo,
            name: m.name,
            type: '原料批次',
            date: m.date
        })));
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 class="text-lg font-bold text-gray-800">选择批次号</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 flex-1 overflow-hidden flex flex-col">
                <input type="text" id="batchSearch" placeholder="搜索批次号..." 
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm mb-3 shrink-0">
                <div class="overflow-y-auto space-y-2 flex-1" id="batchList">
                    ${items.length === 0 ? '<p class="text-center text-gray-400 text-sm py-4">暂无可用批次</p>' : ''}
                    ${items.map(i => `
                        <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 batch-item" 
                            data-id="${i.id}" 
                            data-name="${i.name}">
                            <div class="flex justify-between items-start">
                                <div class="font-medium text-sm text-gray-800">${i.id}</div>
                                <span class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">${i.type}</span>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">${i.name} | ${i.date || '无日期'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const searchInput = modal.querySelector('#batchSearch');
    const batchItems = modal.querySelectorAll('.batch-item');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        batchItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(keyword) ? 'block' : 'none';
        });
    });

    batchItems.forEach(item => {
        item.addEventListener('click', () => {
            callback({ id: item.dataset.id, name: item.dataset.name });
            modal.remove();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}
