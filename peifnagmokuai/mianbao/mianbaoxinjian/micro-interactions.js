/**
 * 微交互管理器
 * 提供丰富的用户交互体验和动效
 */

class MicroInteractions {
    constructor() {
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    /**
     * 初始化微交互系统
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeAfterDOMReady();
            });
        } else {
            this.initializeAfterDOMReady();
        }
    }

    /**
     * DOM准备好后初始化
     */
    initializeAfterDOMReady() {
        this.setupScrollReveal();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupFormInteractions();
        this.setupImageLazyLoading();
        this.setupTooltips();
        this.setupProgressAnimations();
        this.setupParallaxEffects();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
    }

    /**
     * 设置滚动显示动画
     */
    setupScrollReveal() {
        if (this.isReducedMotion) return;

        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // 添加延迟效果
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.style.transitionDelay = '0ms';
                    }, delay);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el, index) => {
            // 添加渐进延迟
            el.style.transitionDelay = `${index * 100}ms`;
            observer.observe(el);
        });

        this.observers.set('scrollReveal', observer);
    }

    /**
     * 设置悬停效果
     */
    setupHoverEffects() {
        // 卡片悬停效果
        const cards = document.querySelectorAll('.card, .card-interactive');
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });

        // 按钮悬停效果
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.handleButtonHover.bind(this));
            button.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
        });

        // 图片悬停效果
        const images = document.querySelectorAll('.hover-zoom');
        images.forEach(img => {
            img.addEventListener('mouseenter', this.handleImageHover.bind(this));
            img.addEventListener('mouseleave', this.handleImageLeave.bind(this));
        });
    }

    /**
     * 设置点击效果
     */
    setupClickEffects() {
        // 波纹效果
        const rippleElements = document.querySelectorAll('.btn, .card-interactive');
        rippleElements.forEach(element => {
            element.addEventListener('click', this.createRippleEffect.bind(this));
        });

        // 微弹跳效果
        const bounceElements = document.querySelectorAll('.micro-bounce');
        bounceElements.forEach(element => {
            element.addEventListener('click', this.handleMicroBounce.bind(this));
        });
    }

    /**
     * 设置表单交互
     */
    setupFormInteractions() {
        // 输入框焦点效果
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', this.handleInputFocus.bind(this));
            input.addEventListener('blur', this.handleInputBlur.bind(this));
            input.addEventListener('input', this.handleInputChange.bind(this));
        });

        // 表单验证动画
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }

    /**
     * 设置图片懒加载
     */
    setupImageLazyLoading() {
        const lazyImages = document.querySelectorAll('.image-lazy');
        
        if (lazyImages.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
        this.observers.set('imageLoading', imageObserver);
    }

    /**
     * 设置工具提示
     */
    setupTooltips() {
        const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
        
        tooltipTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', this.showTooltip.bind(this));
            trigger.addEventListener('mouseleave', this.hideTooltip.bind(this));
            trigger.addEventListener('focus', this.showTooltip.bind(this));
            trigger.addEventListener('blur', this.hideTooltip.bind(this));
        });
    }

    /**
     * 设置进度动画
     */
    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.dataset.progress || 0;
                    this.animateProgress(progressBar, progress);
                    progressObserver.unobserve(progressBar);
                }
            });
        });

        progressBars.forEach(bar => progressObserver.observe(bar));
        this.observers.set('progress', progressObserver);
    }

    /**
     * 设置视差效果
     */
    setupParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        // 使用节流优化性能
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
    }

    /**
     * 设置平滑滚动
     */
    setupSmoothScrolling() {
        const smoothLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * 设置键盘导航
     */
    setupKeyboardNavigation() {
        // Tab键导航高亮
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // 回车键激活
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('btn')) {
                e.target.click();
            }
        });
    }

    /**
     * 卡片悬停处理
     */
    handleCardHover(e) {
        if (this.isReducedMotion) return;
        
        const card = e.currentTarget;
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = 'var(--shadow-hover)';
    }

    /**
     * 卡片离开处理
     */
    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    /**
     * 按钮悬停处理
     */
    handleButtonHover(e) {
        if (this.isReducedMotion) return;
        
        const button = e.currentTarget;
        button.style.transform = 'translateY(-2px)';
    }

    /**
     * 按钮离开处理
     */
    handleButtonLeave(e) {
        const button = e.currentTarget;
        button.style.transform = '';
    }

    /**
     * 图片悬停处理
     */
    handleImageHover(e) {
        if (this.isReducedMotion) return;
        
        const img = e.currentTarget;
        img.style.transform = 'scale(1.05)';
    }

    /**
     * 图片离开处理
     */
    handleImageLeave(e) {
        const img = e.currentTarget;
        img.style.transform = '';
    }

    /**
     * 创建波纹效果
     */
    createRippleEffect(e) {
        if (this.isReducedMotion) return;
        
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * 微弹跳处理
     */
    handleMicroBounce(e) {
        if (this.isReducedMotion) return;
        
        const element = e.currentTarget;
        element.style.animation = 'microBounce 0.15s ease-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 150);
    }

    /**
     * 输入框焦点处理
     */
    handleInputFocus(e) {
        const input = e.currentTarget;
        const container = input.closest('.input-container') || input.parentElement;
        container.classList.add('focused');
    }

    /**
     * 输入框失焦处理
     */
    handleInputBlur(e) {
        const input = e.currentTarget;
        const container = input.closest('.input-container') || input.parentElement;
        container.classList.remove('focused');
        
        // 验证输入
        this.validateInput(input);
    }

    /**
     * 输入变化处理
     */
    handleInputChange(e) {
        const input = e.currentTarget;
        const container = input.closest('.input-container') || input.parentElement;
        
        if (input.value) {
            container.classList.add('has-value');
        } else {
            container.classList.remove('has-value');
        }
    }

    /**
     * 表单提交处理
     */
    handleFormSubmit(e) {
        const form = e.currentTarget;
        const inputs = form.querySelectorAll('input, textarea, select');
        let hasErrors = false;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                hasErrors = true;
            }
        });
        
        if (hasErrors) {
            e.preventDefault();
            this.showFormErrors(form);
        }
    }

    /**
     * 验证输入
     */
    validateInput(input) {
        const value = input.value.trim();
        const required = input.hasAttribute('required');
        const type = input.type;
        let isValid = true;
        
        // 必填验证
        if (required && !value) {
            isValid = false;
        }
        
        // 邮箱验证
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        // 更新UI
        const container = input.closest('.input-container') || input.parentElement;
        if (isValid) {
            container.classList.remove('error');
            input.classList.remove('error');
        } else {
            container.classList.add('error');
            input.classList.add('error');
        }
        
        return isValid;
    }

    /**
     * 显示表单错误
     */
    showFormErrors(form) {
        const firstError = form.querySelector('.error input, .error textarea, .error select');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * 显示工具提示
     */
    showTooltip(e) {
        const trigger = e.currentTarget;
        const text = trigger.dataset.tooltip;
        
        if (!text) return;
        
        // 移除现有提示
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip show';
        tooltip.textContent = text;
        tooltip.id = 'active-tooltip';
        
        document.body.appendChild(tooltip);
        
        // 定位提示
        const rect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;
        
        // 边界检查
        if (left < 8) left = 8;
        if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        if (top < 8) {
            top = rect.bottom + 8;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    /**
     * 隐藏工具提示
     */
    hideTooltip() {
        const tooltip = document.getElementById('active-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 150);
        }
    }

    /**
     * 动画进度条
     */
    animateProgress(progressBar, targetProgress) {
        const fill = progressBar.querySelector('.progress-fill') || progressBar;
        let currentProgress = 0;
        const increment = targetProgress / 60; // 60帧动画
        
        const animate = () => {
            currentProgress += increment;
            if (currentProgress >= targetProgress) {
                currentProgress = targetProgress;
            }
            
            fill.style.width = `${currentProgress}%`;
            
            if (currentProgress < targetProgress) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * 添加CSS动画样式
     */
    addAnimationStyles() {
        if (document.getElementById('micro-interactions-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'micro-interactions-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .keyboard-navigation *:focus {
                outline: 2px solid var(--baking-primary-400);
                outline-offset: 2px;
            }
            
            .input-container.focused {
                transform: scale(1.02);
            }
            
            .input-container.error {
                animation: shake 0.5s ease-in-out;
            }
            
            .tooltip {
                position: fixed;
                background: var(--baking-neutral-800);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 10000;
                pointer-events: none;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * 销毁观察者
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// 创建全局实例
let microInteractions;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        microInteractions = new MicroInteractions();
    });
} else {
    microInteractions = new MicroInteractions();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MicroInteractions;
}

// 全局访问
window.microInteractions = microInteractions;