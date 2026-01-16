/**
 * 主题管理器 - 烘焙应用主题系统
 * 支持多主题切换、暗色模式、用户偏好保存
 */

class ThemeManager {
    constructor() {
        this.themes = {
            classic: {
                name: '经典烘焙',
                description: '温暖的橙棕色调，营造传统烘焙氛围',
                colors: {
                    primary: '#DE6005',
                    secondary: '#D97706',
                    accent: '#B26018'
                }
            },
            modern: {
                name: '现代简约',
                description: '清新的蓝紫色调，现代简洁设计',
                colors: {
                    primary: '#6B73FF',
                    secondary: '#9BA3FF',
                    accent: '#5A61E6'
                }
            },
            natural: {
                name: '温馨自然',
                description: '清新的绿色调，自然温馨感受',
                colors: {
                    primary: '#8FBC8F',
                    secondary: '#B8D4B8',
                    accent: '#7AA67A'
                }
            }
        };
        
        this.currentTheme = 'classic';
        this.isDarkMode = false;
        this.isHighContrast = false;
        this.isReducedMotion = false;
        
        this.init();
    }
    
    /**
     * 初始化主题管理器
     */
    init() {
        this.loadUserPreferences();
        this.detectSystemPreferences();
        this.applyTheme();
        this.setupEventListeners();
        this.createThemeControls();
    }
    
    /**
     * 加载用户偏好设置
     */
    loadUserPreferences() {
        try {
            const savedTheme = localStorage.getItem('baking-theme');
            const savedDarkMode = localStorage.getItem('baking-dark-mode');
            const savedHighContrast = localStorage.getItem('baking-high-contrast');
            const savedReducedMotion = localStorage.getItem('baking-reduced-motion');
            
            if (savedTheme && this.themes[savedTheme]) {
                this.currentTheme = savedTheme;
            }
            
            if (savedDarkMode !== null) {
                this.isDarkMode = savedDarkMode === 'true';
            }
            
            if (savedHighContrast !== null) {
                this.isHighContrast = savedHighContrast === 'true';
            }
            
            if (savedReducedMotion !== null) {
                this.isReducedMotion = savedReducedMotion === 'true';
            }
        } catch (error) {
            console.warn('无法加载主题偏好设置:', error);
        }
    }
    
    /**
     * 检测系统偏好设置
     */
    detectSystemPreferences() {
        // 检测暗色模式偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDarkMode = localStorage.getItem('baking-dark-mode') === null ? true : this.isDarkMode;
        }
        
        // 检测高对比度偏好
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            this.isHighContrast = localStorage.getItem('baking-high-contrast') === null ? true : this.isHighContrast;
        }
        
        // 检测减少动画偏好
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isReducedMotion = localStorage.getItem('baking-reduced-motion') === null ? true : this.isReducedMotion;
        }
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 监听系统主题变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (localStorage.getItem('baking-dark-mode') === null) {
                    this.isDarkMode = e.matches;
                    this.applyTheme();
                }
            });
            
            window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
                if (localStorage.getItem('baking-high-contrast') === null) {
                    this.isHighContrast = e.matches;
                    this.applyTheme();
                }
            });
            
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                if (localStorage.getItem('baking-reduced-motion') === null) {
                    this.isReducedMotion = e.matches;
                    this.applyTheme();
                }
            });
        }
        
        // 监听键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'd':
                        e.preventDefault();
                        this.toggleDarkMode();
                        break;
                    case 't':
                        e.preventDefault();
                        this.showThemeSelector();
                        break;
                }
            }
        });
    }
    
    /**
     * 应用主题
     */
    applyTheme() {
        const root = document.documentElement;
        
        // 移除所有主题类
        Object.keys(this.themes).forEach(theme => {
            root.classList.remove(`theme-${theme}`);
        });
        
        // 应用当前主题
        root.classList.add(`theme-${this.currentTheme}`);
        
        // 应用暗色模式
        if (this.isDarkMode) {
            root.classList.add('dark-mode');
        } else {
            root.classList.remove('dark-mode');
        }
        
        // 应用高对比度
        if (this.isHighContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        
        // 应用减少动画
        if (this.isReducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
        
        // 更新CSS自定义属性
        this.updateCSSVariables();
        
        // 触发主题变化事件
        this.dispatchThemeChangeEvent();
    }
    
    /**
     * 更新CSS自定义属性
     */
    updateCSSVariables() {
        const root = document.documentElement;
        const theme = this.themes[this.currentTheme];
        
        if (theme && theme.colors) {
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(`--theme-${key}`, value);
            });
        }
    }
    
    /**
     * 切换主题
     */
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.saveUserPreferences();
            this.applyTheme();
            return true;
        }
        return false;
    }
    
    /**
     * 切换暗色模式
     */
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.saveUserPreferences();
        this.applyTheme();
    }
    
    /**
     * 切换高对比度模式
     */
    toggleHighContrast() {
        this.isHighContrast = !this.isHighContrast;
        this.saveUserPreferences();
        this.applyTheme();
    }
    
    /**
     * 切换减少动画模式
     */
    toggleReducedMotion() {
        this.isReducedMotion = !this.isReducedMotion;
        this.saveUserPreferences();
        this.applyTheme();
    }
    
    /**
     * 保存用户偏好设置
     */
    saveUserPreferences() {
        try {
            localStorage.setItem('baking-theme', this.currentTheme);
            localStorage.setItem('baking-dark-mode', this.isDarkMode.toString());
            localStorage.setItem('baking-high-contrast', this.isHighContrast.toString());
            localStorage.setItem('baking-reduced-motion', this.isReducedMotion.toString());
        } catch (error) {
            console.warn('无法保存主题偏好设置:', error);
        }
    }
    
    /**
     * 触发主题变化事件
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: this.currentTheme,
                isDarkMode: this.isDarkMode,
                isHighContrast: this.isHighContrast,
                isReducedMotion: this.isReducedMotion
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * 创建主题控制界面
     */
    createThemeControls() {
        // 检查是否已存在主题控制器
        if (document.getElementById('theme-controls')) {
            return;
        }
        
        const controls = document.createElement('div');
        controls.id = 'theme-controls';
        controls.className = 'theme-controls';
        controls.innerHTML = `
            <div class="theme-controls-content">
                <h3>主题设置</h3>
                
                <div class="theme-section">
                    <label>主题选择</label>
                    <div class="theme-options">
                        ${Object.entries(this.themes).map(([key, theme]) => `
                            <button class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                                    data-theme="${key}">
                                <div class="theme-preview" style="background: ${theme.colors.primary}"></div>
                                <span>${theme.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="theme-section">
                    <label class="theme-toggle">
                        <input type="checkbox" ${this.isDarkMode ? 'checked' : ''} data-toggle="dark">
                        <span>暗色模式</span>
                    </label>
                </div>
                
                <div class="theme-section">
                    <label class="theme-toggle">
                        <input type="checkbox" ${this.isHighContrast ? 'checked' : ''} data-toggle="contrast">
                        <span>高对比度</span>
                    </label>
                </div>
                
                <div class="theme-section">
                    <label class="theme-toggle">
                        <input type="checkbox" ${this.isReducedMotion ? 'checked' : ''} data-toggle="motion">
                        <span>减少动画</span>
                    </label>
                </div>
                
                <div class="theme-actions">
                    <button class="btn btn-secondary" data-action="reset">重置为默认</button>
                    <button class="btn btn-primary" data-action="close">关闭</button>
                </div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .theme-controls {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--color-bg-overlay);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .theme-controls.show {
                display: flex;
            }
            
            .theme-controls-content {
                background: var(--color-bg-primary);
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 40px var(--color-shadow-heavy);
            }
            
            .theme-controls h3 {
                margin: 0 0 20px 0;
                color: var(--color-text-primary);
                font-size: 18px;
                font-weight: 600;
            }
            
            .theme-section {
                margin-bottom: 20px;
            }
            
            .theme-section label {
                display: block;
                margin-bottom: 8px;
                color: var(--color-text-secondary);
                font-weight: 500;
            }
            
            .theme-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 12px;
            }
            
            .theme-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px;
                border: 2px solid var(--color-border-secondary);
                border-radius: 8px;
                background: var(--color-bg-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .theme-option:hover {
                border-color: var(--color-primary);
                transform: translateY(-2px);
            }
            
            .theme-option.active {
                border-color: var(--color-primary);
                background: var(--baking-primary-50);
            }
            
            .theme-preview {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                margin-bottom: 8px;
            }
            
            .theme-toggle {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .theme-toggle input {
                margin-right: 8px;
            }
            
            .theme-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(controls);
        
        // 绑定事件
        this.bindControlEvents(controls);
    }
    
    /**
     * 绑定控制界面事件
     */
    bindControlEvents(controls) {
        controls.addEventListener('click', (e) => {
            const target = e.target;
            
            // 主题选择
            if (target.closest('.theme-option')) {
                const theme = target.closest('.theme-option').dataset.theme;
                this.setTheme(theme);
                this.updateControlsUI();
            }
            
            // 切换开关
            if (target.dataset.toggle) {
                switch (target.dataset.toggle) {
                    case 'dark':
                        this.toggleDarkMode();
                        break;
                    case 'contrast':
                        this.toggleHighContrast();
                        break;
                    case 'motion':
                        this.toggleReducedMotion();
                        break;
                }
            }
            
            // 操作按钮
            if (target.dataset.action) {
                switch (target.dataset.action) {
                    case 'reset':
                        this.resetToDefaults();
                        this.updateControlsUI();
                        break;
                    case 'close':
                        this.hideThemeSelector();
                        break;
                }
            }
        });
        
        // 点击背景关闭
        controls.addEventListener('click', (e) => {
            if (e.target === controls) {
                this.hideThemeSelector();
            }
        });
    }
    
    /**
     * 更新控制界面UI
     */
    updateControlsUI() {
        const controls = document.getElementById('theme-controls');
        if (!controls) return;
        
        // 更新主题选择
        controls.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
        
        // 更新切换开关
        controls.querySelector('[data-toggle="dark"]').checked = this.isDarkMode;
        controls.querySelector('[data-toggle="contrast"]').checked = this.isHighContrast;
        controls.querySelector('[data-toggle="motion"]').checked = this.isReducedMotion;
    }
    
    /**
     * 显示主题选择器
     */
    showThemeSelector() {
        const controls = document.getElementById('theme-controls');
        if (controls) {
            controls.classList.add('show');
            this.updateControlsUI();
        }
    }
    
    /**
     * 隐藏主题选择器
     */
    hideThemeSelector() {
        const controls = document.getElementById('theme-controls');
        if (controls) {
            controls.classList.remove('show');
        }
    }
    
    /**
     * 重置为默认设置
     */
    resetToDefaults() {
        this.currentTheme = 'classic';
        this.isDarkMode = false;
        this.isHighContrast = false;
        this.isReducedMotion = false;
        this.saveUserPreferences();
        this.applyTheme();
    }
    
    /**
     * 获取当前主题信息
     */
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            theme: this.themes[this.currentTheme],
            isDarkMode: this.isDarkMode,
            isHighContrast: this.isHighContrast,
            isReducedMotion: this.isReducedMotion
        };
    }
    
    /**
     * 添加自定义主题
     */
    addCustomTheme(name, themeConfig) {
        if (name && themeConfig) {
            this.themes[name] = themeConfig;
            return true;
        }
        return false;
    }
    
    /**
     * 导出主题配置
     */
    exportThemeConfig() {
        return {
            themes: this.themes,
            currentTheme: this.currentTheme,
            preferences: {
                isDarkMode: this.isDarkMode,
                isHighContrast: this.isHighContrast,
                isReducedMotion: this.isReducedMotion
            }
        };
    }
    
    /**
     * 导入主题配置
     */
    importThemeConfig(config) {
        try {
            if (config.themes) {
                this.themes = { ...this.themes, ...config.themes };
            }
            
            if (config.currentTheme && this.themes[config.currentTheme]) {
                this.currentTheme = config.currentTheme;
            }
            
            if (config.preferences) {
                this.isDarkMode = config.preferences.isDarkMode || false;
                this.isHighContrast = config.preferences.isHighContrast || false;
                this.isReducedMotion = config.preferences.isReducedMotion || false;
            }
            
            this.saveUserPreferences();
            this.applyTheme();
            return true;
        } catch (error) {
            console.error('导入主题配置失败:', error);
            return false;
        }
    }
}

// 全局主题管理器实例
window.themeManager = new ThemeManager();

// 导出主题管理器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}