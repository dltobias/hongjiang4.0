/**
 * 全局错误处理器
 * 统一管理所有JavaScript错误和异常处理
 */

// 错误类型枚举
const ErrorTypes = {
    ELEMENT_NOT_FOUND: 'ELEMENT_NOT_FOUND',
    FUNCTION_NOT_EXIST: 'FUNCTION_NOT_EXIST',
    DATA_PARSE_ERROR: 'DATA_PARSE_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PERMISSION_ERROR: 'PERMISSION_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// 错误级别枚举
const ErrorLevels = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

// 全局错误处理器类
class GlobalErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.isDebugMode = false;
        this.init();
    }

    init() {
        // 监听全局错误
        window.addEventListener('error', (event) => {
            this.handleError({
                type: ErrorTypes.UNKNOWN_ERROR,
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error,
                level: ErrorLevels.HIGH
            });
        });

        // 监听Promise未捕获的错误
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: ErrorTypes.UNKNOWN_ERROR,
                message: event.reason?.message || 'Promise rejection',
                error: event.reason,
                level: ErrorLevels.MEDIUM
            });
        });
    }

    /**
     * 处理错误
     * @param {Object} errorInfo - 错误信息对象
     */
    handleError(errorInfo) {
        const timestamp = new Date().toISOString();
        const errorRecord = {
            ...errorInfo,
            timestamp,
            id: this.generateErrorId()
        };

        // 添加到错误日志
        this.addToLog(errorRecord);

        // 根据错误级别决定处理方式
        switch (errorInfo.level) {
            case ErrorLevels.CRITICAL:
                this.handleCriticalError(errorRecord);
                break;
            case ErrorLevels.HIGH:
                this.handleHighError(errorRecord);
                break;
            case ErrorLevels.MEDIUM:
                this.handleMediumError(errorRecord);
                break;
            case ErrorLevels.LOW:
                this.handleLowError(errorRecord);
                break;
        }

        // 开发模式下输出详细信息
        if (this.isDebugMode) {
            console.group(`🚨 Error [${errorInfo.level.toUpperCase()}]`);
            console.error('Message:', errorInfo.message);
            console.error('Type:', errorInfo.type);
            console.error('Timestamp:', timestamp);
            if (errorInfo.source) console.error('Source:', errorInfo.source);
            if (errorInfo.line) console.error('Line:', errorInfo.line);
            if (errorInfo.error) console.error('Stack:', errorInfo.error.stack);
            console.groupEnd();
        }
    }

    /**
     * 处理关键错误
     */
    handleCriticalError(errorRecord) {
        // 显示错误模态框
        this.showErrorModal({
            title: '系统错误',
            message: '系统遇到严重错误，请刷新页面重试',
            type: 'critical',
            actions: [
                {
                    text: '刷新页面',
                    action: () => window.location.reload(),
                    primary: true
                },
                {
                    text: '报告问题',
                    action: () => this.reportError(errorRecord)
                }
            ]
        });
    }

    /**
     * 处理高级错误
     */
    handleHighError(errorRecord) {
        this.showToast({
            message: '操作失败，请重试',
            type: 'error',
            duration: 5000
        });
    }

    /**
     * 处理中级错误
     */
    handleMediumError(errorRecord) {
        this.showToast({
            message: '操作遇到问题',
            type: 'warning',
            duration: 3000
        });
    }

    /**
     * 处理低级错误
     */
    handleLowError(errorRecord) {
        // 仅记录日志，不显示用户提示
        if (this.isDebugMode) {
            console.warn('Low level error:', errorRecord.message);
        }
    }

    /**
     * 显示Toast提示
     */
    showToast({ message, type = 'info', duration = 3000 }) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => toast.classList.add('show'), 10);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    }

    /**
     * 显示错误模态框
     */
    showErrorModal({ title, message, type, actions = [] }) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const content = document.createElement('div');
        content.className = 'bg-white rounded-lg p-6 max-w-md mx-4';
        
        content.innerHTML = `
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <i class="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            </div>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex space-x-3 justify-end">
                ${actions.map(action => `
                    <button class="px-4 py-2 rounded-lg ${action.primary ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition-opacity">
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 绑定按钮事件
        const buttons = content.querySelectorAll('button');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                actions[index].action();
                document.body.removeChild(modal);
            });
        });
    }

    /**
     * 添加到错误日志
     */
    addToLog(errorRecord) {
        this.errorLog.unshift(errorRecord);
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }
    }

    /**
     * 生成错误ID
     */
    generateErrorId() {
        return 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 报告错误
     */
    reportError(errorRecord) {
        // 这里可以实现错误上报逻辑
        console.log('Reporting error:', errorRecord);
        this.showToast({
            message: '错误报告已发送',
            type: 'success'
        });
    }

    /**
     * 获取错误日志
     */
    getErrorLog() {
        return this.errorLog;
    }

    /**
     * 清空错误日志
     */
    clearErrorLog() {
        this.errorLog = [];
    }

    /**
     * 设置调试模式
     */
    setDebugMode(enabled) {
        this.isDebugMode = enabled;
    }
}

// 创建全局实例
const globalErrorHandler = new GlobalErrorHandler();

// 便捷的错误处理函数
window.handleError = function(type, message, level = ErrorLevels.MEDIUM, additionalInfo = {}) {
    globalErrorHandler.handleError({
        type,
        message,
        level,
        ...additionalInfo
    });
};

// 便捷的元素查找函数（带错误处理）
window.safeGetElement = function(id, required = true) {
    const element = document.getElementById(id);
    if (!element && required) {
        handleError(
            ErrorTypes.ELEMENT_NOT_FOUND,
            `找不到元素: ${id}`,
            ErrorLevels.MEDIUM
        );
    }
    return element;
};

// 便捷的函数调用（带错误处理）
window.safeCall = function(func, ...args) {
    try {
        if (typeof func === 'function') {
            return func(...args);
        } else {
            handleError(
                ErrorTypes.FUNCTION_NOT_EXIST,
                `函数不存在或不是函数类型`,
                ErrorLevels.MEDIUM
            );
        }
    } catch (error) {
        handleError(
            ErrorTypes.UNKNOWN_ERROR,
            `函数调用失败: ${error.message}`,
            ErrorLevels.MEDIUM,
            { error }
        );
    }
};

// 导出错误处理器（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GlobalErrorHandler, ErrorTypes, ErrorLevels };
}