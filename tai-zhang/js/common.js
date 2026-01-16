const LedgerUtils = {
    // 日期处理
    getLocalDateStr(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // 格式化日期
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    },

    // Toast 提示
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const bgClass = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        toast.className = `fixed top-20 left-1/2 transform -translate-x-1/2 ${bgClass} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    // 确认对话框
    showConfirm({ title, message, type = 'danger' }) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 fade-in';
            
            const content = document.createElement('div');
            content.className = 'bg-white rounded-xl p-6 w-80 shadow-xl transform transition-all scale-100';
            
            const titleColor = type === 'danger' ? 'text-red-600' : (type === 'info' ? 'text-blue-600' : 'text-gray-800');
            
            content.innerHTML = `
                <h3 class="text-lg font-bold ${titleColor} mb-2">${title}</h3>
                <p class="text-gray-600 text-sm mb-6 whitespace-pre-line">${message}</p>
                <div class="flex gap-3">
                    <button class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors" id="confirm-cancel">取消</button>
                    <button class="flex-1 py-2 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg font-medium transition-colors" id="confirm-ok">确定</button>
                </div>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            const cleanup = () => {
                modal.remove();
            };
            
            modal.querySelector('#confirm-cancel').onclick = () => {
                cleanup();
                resolve(false);
            };
            
            modal.querySelector('#confirm-ok').onclick = () => {
                cleanup();
                resolve(true);
            };
        });
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 安全存储
    SafeStorage: {
        get(key, defaultValue = []) {
            try {
                const data = localStorage.getItem(key);
                if (!data) return defaultValue;
                return JSON.parse(data);
            } catch (e) {
                console.error(`Failed to parse ${key}:`, e);
                return defaultValue;
            }
        },
        
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error(`Failed to save ${key}:`, e);
                LedgerUtils.showToast('保存失败，存储空间可能已满', 'error');
                return false;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error(`Failed to remove ${key}:`, e);
                return false;
            }
        }
    },

    // 空状态组件
    EmptyState: {
        show(container, message = '暂无数据', icon = 'fa-inbox') {
            if (!container) return;
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas ${icon} text-2xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-500 text-sm font-medium">${message}</p>
                </div>
            `;
        }
    },

    // 错误处理
    ErrorHandler: {
        handle(error, context = '') {
            console.error(`Error in ${context}:`, error);
            LedgerUtils.showToast('操作失败，请重试', 'error');
        },
        
        showToast(message, type = 'error') {
            LedgerUtils.showToast(message, type);
        }
    },

    // 输入历史记录
    InputHistory: {
        save(field, value) {
            if (!value) return;
            const key = `input_history_${field}`;
            let history = LedgerUtils.SafeStorage.get(key, []);
            // 移除重复项，添加到开头
            history = history.filter(h => h !== value);
            history.unshift(value);
            // 只保留最近10条
            if (history.length > 10) history = history.slice(0, 10);
            LedgerUtils.SafeStorage.set(key, history);
        },
        
        get(field) {
            return LedgerUtils.SafeStorage.get(`input_history_${field}`, []);
        }
    },

    // 智能填充 (Phase 2.2)
    SmartFill: {
        // 根据产品名称自动填充常用值
        fillByProduct(productName) {
            if (!productName || typeof productName !== 'string') {
                return null;
            }
            
            try {
                const history = LedgerUtils.SafeStorage.get('ledger_production', []);
                const sameProduct = history.filter(p => p && p.productName === productName);
                
                if (sameProduct.length === 0) {
                    return null;
                }
                
                // 统计最常用的值
                const operators = {};
                const planAmounts = [];
                
                sameProduct.forEach(p => {
                    if (p.operator) {
                        operators[p.operator] = (operators[p.operator] || 0) + 1;
                    }
                    if (p.planAmount) {
                        planAmounts.push(parseFloat(p.planAmount) || 0);
                    }
                });
                
                // 返回建议值
                let topOperator = null;
                if (Object.keys(operators).length > 0) {
                    topOperator = Object.keys(operators).reduce((a, b) => 
                        operators[a] > operators[b] ? a : b);
                }
                    
                return {
                    operator: topOperator,
                    planAmount: planAmounts.length > 0 ? 
                        Math.round(planAmounts.reduce((a, b) => a + b, 0) / planAmounts.length) : null
                };
            } catch (e) {
                console.error('SmartFill error:', e);
                return null;
            }
        },
        
        // 根据操作人员自动填充常用设备
        fillByOperator(operator) {
            const history = LedgerUtils.SafeStorage.get('ledger_production', []);
            const sameOperator = history.filter(p => p.operator === operator);
            
            if (sameOperator.length > 0) {
                const equipmentCount = {};
                sameOperator.forEach(p => {
                    if (p.equipment) {
                        p.equipment.forEach(e => {
                            equipmentCount[e.name] = (equipmentCount[e.name] || 0) + 1;
                        });
                    }
                });
                
                // 返回最常用的设备
                return Object.keys(equipmentCount)
                    .sort((a, b) => equipmentCount[b] - equipmentCount[a])
                    .slice(0, 3);
            }
            return [];
        }
    },

    // 生成批次号
    generateBatchId(prefix = 'BATCH') {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
        // 简单的随机数后缀，实际应用中应该查库获取最大序列号
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${dateStr}${random}`;
    },

    // 数据验证
    validateLedgerData(data) {
        if (!Array.isArray(data)) {
            console.warn('数据格式错误：期望数组');
            return [];
        }
        
        return data.filter(item => {
            if (!item.id && !item.batchNo) {
                console.warn('缺少批次号', item);
                return false;
            }
            return true;
        });
    },

    // 验证原料批次是否存在
    validateMaterialBatch(batchId) {
        const materials = JSON.parse(localStorage.getItem('ledger_material') || '[]');
        return materials.some(m => (m.id === batchId) || (m.batchNo === batchId));
    },

    // 验证设备是否存在
    validateEquipment(equipmentName) {
        const equipments = JSON.parse(localStorage.getItem('ledger_equipment') || '[]');
        return equipments.some(e => (e.name === equipmentName) || (e.id === equipmentName));
    },

    // 验证生产记录数据完整性
    validateProductionRecord(record) {
        const errors = [];
        
        if (!record.productName) errors.push('产品名称不能为空');
        if (!record.productionDate) errors.push('生产日期不能为空');
        if (!record.operator) errors.push('操作人员不能为空');
        
        // 验证关联的原料批次是否存在
        if (record.materials && record.materials.length > 0) {
            record.materials.forEach(m => {
                if (m.id && !this.validateMaterialBatch(m.id)) {
                    errors.push(`原料批次 ${m.id} 不存在`);
                }
            });
        }
        
        // 验证关联的设备是否存在
        if (record.equipment && record.equipment.length > 0) {
            record.equipment.forEach(e => {
                if (e.name && !this.validateEquipment(e.name)) {
                    errors.push(`设备 ${e.name} 不存在`);
                }
            });
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // 验证质检记录
    validateQualityRecord(record) {
        const errors = [];
        if (!record.name) errors.push('名称不能为空');
        if (!record.batch) errors.push('关联批次号不能为空');
        if (!record.inspector) errors.push('检验员不能为空');
        
        if (record.status === 'unqualified' && (!record.detail || record.detail.includes('原因: '))) {
             // detail contains "原因: ..." so we check if the reason part is empty?
             // Actually detail is set as `原因: ${reason}`. 
             // Let's rely on the form required attribute for reason field.
             // But logic check:
             const reason = record.detail.replace('原因: ', '').trim();
             if (record.status === 'unqualified' && !reason) {
                 errors.push('不合格原因不能为空');
             }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // 验证原料记录
    validateMaterialRecord(record) {
        const errors = [];
        if (!record.materialName) errors.push('原料名称不能为空');
        if (!record.supplier) errors.push('供应商不能为空');
        
        // Parse amount to check if positive
        const amountVal = parseFloat(record.amount);
        if (isNaN(amountVal) || amountVal <= 0) {
            errors.push('入库数量必须大于0');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // 获取 URL 参数
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    // 导出 Excel
    exportToExcel(data, filename, headerMap) {
        if (typeof XLSX === 'undefined') {
            this.showToast('导出功能组件未加载', 'error');
            return;
        }

        if (!data || data.length === 0) {
            this.showToast('没有可导出的数据', 'error');
            return;
        }

        try {
            // Transform data based on headerMap
            const exportData = data.map(item => {
                const row = {};
                for (const [key, header] of Object.entries(headerMap)) {
                    // Handle nested properties if needed, but keeping it simple for now
                    // Or custom value transformation
                    row[header] = item[key] || '';
                }
                return row;
            });

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            
            // Generate file
            XLSX.writeFile(wb, `${filename}_${this.getLocalDateStr()}.xlsx`);
            this.showToast('导出成功');
        } catch (e) {
            console.error('Export failed:', e);
            this.showToast('导出失败', 'error');
        }
    },

    // 自动保存草稿功能
    AutoSave: {
        init(formId, storageKey) {
            const form = document.getElementById(formId);
            if (!form) return;

            // Restore
            this.restore(form, storageKey);

            // Listen for changes
            form.addEventListener('input', this.debounce(() => {
                this.save(form, storageKey);
            }, 1000));
            
            form.addEventListener('change', () => {
                this.save(form, storageKey);
            });
        },

        save(form, storageKey) {
            const data = {};
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            // Handle special fields manually if needed (like checkboxes not in FormData if unchecked)
            localStorage.setItem(storageKey, JSON.stringify(data));
            // Optional: Show "Saved" indicator
        },

        restore(form, storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (!saved) return;

            try {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const field = form.elements[key];
                    if (field) {
                        if (field.type === 'checkbox' || field.type === 'radio') {
                            if (field.value === data[key]) field.checked = true;
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                LedgerUtils.showToast('已恢复上次未保存的草稿', 'success');
            } catch (e) {
                console.error('Failed to restore draft', e);
            }
        },
        
        clear(storageKey) {
            localStorage.removeItem(storageKey);
        },

        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    },

    // 骨架屏组件
    Skeleton: {
        // 列表项骨架屏
        createListItem() {
            return `
                <div class="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div class="flex-1">
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            `;
        },

        // 卡片骨架屏
        createCard() {
            return `
                <div class="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                    <div class="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div class="space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-full"></div>
                        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            `;
        },

        // 显示骨架屏
        show(container, count = 3, type = 'list') {
            if (!container) return;
            const skeleton = type === 'list' ? this.createListItem() : this.createCard();
            container.innerHTML = skeleton.repeat(count);
        }
    },

    // 表单验证
    FormValidator: {
        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const required = field.hasAttribute('required');
            
            // 清除之前的错误提示
            this.clearError(field);
            
            // 必填验证
            if (required && !value) {
                this.showError(field, '此字段为必填项');
                return false;
            }
            
            // 邮箱验证
            if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                this.showError(field, '请输入有效的邮箱地址');
                return false;
            }
            
            // 数字验证
            if (type === 'number' && value && isNaN(value)) {
                this.showError(field, '请输入有效的数字');
                return false;
            }
            
            return true;
        },
        
        showError(field, message) {
            field.classList.add('border-red-500');
            const errorEl = document.createElement('div');
            errorEl.className = 'text-red-500 text-xs mt-1 error-msg';
            errorEl.textContent = message;
            field.parentElement.appendChild(errorEl);
        },
        
        clearError(field) {
            field.classList.remove('border-red-500');
            const errorEl = field.parentElement.querySelector('.error-msg');
            if (errorEl) errorEl.remove();
        },

        init(formId) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    },

    // 搜索历史
    SearchHistory: {
        save(keyword, type) {
            if (!keyword || !keyword.trim()) return;
            const key = `search_history_${type}`;
            let history = this.get(type);
            
            // Remove if exists to move to top
            history = history.filter(k => k !== keyword);
            history.unshift(keyword);
            
            if (history.length > 10) history.pop();
            LedgerUtils.SafeStorage.set(key, history);
        },
        
        get(type) {
            const key = `search_history_${type}`;
            return LedgerUtils.SafeStorage.get(key, []);
        },
        
        clear(type) {
            const key = `search_history_${type}`;
            LedgerUtils.SafeStorage.remove(key);
        }
    }
};

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', error);
    if (LedgerUtils && typeof LedgerUtils.showToast === 'function') {
        LedgerUtils.showToast('系统发生错误，请刷新重试', 'error');
    }
    return false;
};
