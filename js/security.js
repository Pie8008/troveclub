(function() {
    'use strict';
    
    // 安全配置 - 可以根据需要调整
    const SECURITY_CONFIG = {
        enableRightClickProtection: true,      // 启用右键保护
        enableDevToolsProtection: true,        // 启用开发者工具保护
        enableConsoleProtection: true,         // 启用控制台保护
        enableIframeProtection: true,          // 启用iframe保护
        enableDOMMutationProtection: true,     // 启用DOM修改保护
        showSecurityAlerts: false              // 禁用安全警告提示
    };
    
    // 触发计数器 - 初始为0
    let triggerCounter = 0;
    const COUNTER_MAX = 9999; // 计数上限
    
    // GIF图片路径 - 可自定义
    const GIF_PATH = './图片/动图/不死图腾跳舞.gif'; // 默认路径，请根据需要修改
    // 备选方案：如果主GIF不存在，可以设置多个备选
    const FALLBACK_GIFS = [
        '../../图片/动图/不死图腾跳舞.gif',
        '../图片/动图/不死图腾跳舞.gif'
    ];
    
    // 延迟初始化，确保页面完全加载
    setTimeout(() => {
        initializeSecurity();
    }, 100);
    
    /**
     * 增加计数器并检查是否需要跳转
     * 当计数达到11的倍数且不超过上限时打开GIF
     */
    function incrementCounter() {
        // 增加计数，但不超过上限
        if (triggerCounter < COUNTER_MAX) {
            triggerCounter++;
        }
        
        // 检查是否是11的倍数（11, 22, 33, ...）
        if (triggerCounter % 11 === 0 && triggerCounter <= COUNTER_MAX) {
            openGifImage();
        }
    }
    
    /**
     * 打开GIF图片
     * 尝试多种方式打开GIF，确保兼容性
     */
    function openGifImage() {
        try {
            // 方法1: 在当前窗口打开GIF（覆盖当前页面）
            window.location.href = GIF_PATH;
            
        } catch (e) {
            console.warn('打开GIF失败:', e);
            
            // 尝试备选GIF路径
            tryFallbackGifs();
        }
    }
    
    /**
     * 尝试备选GIF路径
     */
    function tryFallbackGifs() {
        for (let gifPath of FALLBACK_GIFS) {
            try {
                window.location.href = gifPath;
                break;
            } catch (e) {
                continue;
            }
        }
    }
    
    function initializeSecurity() {
        // 检查页面是否已正确加载
        if (document.body && document.body.children.length > 0) {
            setupEventListeners();
            setupMutationObserver();
            setupStorageProtection();
            setupIframeProtection();
            setupAntiFrame();
        } else {
            // 如果页面未加载完成，延迟重试
            setTimeout(initializeSecurity, 100);
        }
    }
    
    function setupEventListeners() {
        if (SECURITY_CONFIG.enableRightClickProtection) {
            // 禁用右键菜单（防止检查元素）
            document.addEventListener('contextmenu', function(e) {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    incrementCounter(); // 计数+1，无提示
                    return false;
                }
            }, { passive: false });
        }
        
        if (SECURITY_CONFIG.enableDevToolsProtection) {
            // 禁用F12键
            document.addEventListener('keydown', function(e) {
                // F12键
                if (e.key === 'F12' || e.keyCode === 123) {
                    e.preventDefault();
                    incrementCounter(); // 计数+1，无提示
                    return false;
                }
                
                // Ctrl+Shift+I (Chrome开发者工具)
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.preventDefault();
                    incrementCounter(); // 计数+1，无提示
                    return false;
                }
                
                // Ctrl+Shift+J (Chrome JavaScript控制台)
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                    e.preventDefault();
                    incrementCounter(); // 计数+1，无提示
                    return false;
                }
                
                // Ctrl+U (查看源代码)
                if (e.ctrlKey && e.key === 'u') {
                    e.preventDefault();
                    incrementCounter(); // 计数+1，无提示
                    return false;
                }
                
                // Ctrl+Shift+C (元素检查)
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    incrementCounter(); // 计数+1，无提示
                    return false;
                }
            }, { passive: false });
        }
    }
    
    function setupMutationObserver() {
        if (!SECURITY_CONFIG.enableDOMMutationProtection) return;
        
        // 防止修改DOM - 使用更温和的方式
        const observer = new MutationObserver(function(mutations) {
            let shouldPrevent = false;
            
            mutations.forEach(function(mutation) {
                // 主要检查是否有人试图删除整个body
                if (mutation.removedNodes.length > 0) {
                    for (let node of mutation.removedNodes) {
                        if (node === document.body || node === document.documentElement) {
                            shouldPrevent = true;
                            break;
                        }
                    }
                }
                
                // 检查是否有人试图清空整个页面
                if (mutation.target === document.body && 
                    mutation.type === 'childList' && 
                    mutation.removedNodes.length > 5) {
                    shouldPrevent = true;
                }
            });
            
            if (shouldPrevent) {
                incrementCounter(); // 计数+1，无提示
                // 重新加载页面而不是阻止操作
                // location.reload();
            }
        });
        
        // 只监听body的子元素变化，不监听所有DOM
        observer.observe(document.body, {
            childList: true,
            subtree: false  // 不监听子树，减少性能影响
        });
    }
    
    function setupStorageProtection() {
        // 保护本地存储数据 - 使用代理模式
        try {
            const protectedKeys = ['token', 'secret', 'password', 'auth_key', 'api_key'];
            
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                // 检查是否是敏感键
                const isProtected = protectedKeys.some(protectedKey => 
                    key.toLowerCase().includes(protectedKey)
                );
                
                if (isProtected) {
                    incrementCounter(); // 计数+1，无提示
                    // 可以选择记录日志但不阻止
                    // console.warn(`安全警告: 尝试设置受保护的键: ${key}`);
                }
                
                return originalSetItem.call(this, key, value);
            };
            
            // 同样保护sessionStorage
            const originalSessionSetItem = sessionStorage.setItem;
            sessionStorage.setItem = function(key, value) {
                const isProtected = protectedKeys.some(protectedKey => 
                    key.toLowerCase().includes(protectedKey)
                );
                
                if (isProtected) {
                    incrementCounter(); // 计数+1，无提示
                }
                
                return originalSessionSetItem.call(this, key, value);
            };
            
        } catch (e) {
            console.warn('存储初始化失败:', e);
        }
    }
    
    function setupIframeProtection() {
        if (!SECURITY_CONFIG.enableIframeProtection) return;
        
        // 防止iframe被恶意操作
        document.addEventListener('DOMContentLoaded', function() {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    // 设置sandbox属性增强安全性
                    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
                    
                    // 添加加载事件监听
                    iframe.addEventListener('load', function() {
                        try {
                            // 尝试添加基本的同源策略保护
                            if (iframe.contentWindow) {
                                // 这里可以添加额外的iframe保护逻辑
                            }
                        } catch (e) {
                            // 跨域iframe无法访问
                        }
                    });
                } catch (e) {
                    // 安全设置失败，不影响主流程
                }
            });
        });
    }
    
    function setupAntiFrame() {
        // 防止页面被嵌入到iframe中
        try {
            if (window.top !== window.self) {
                // 检查是否是我们自己的iframe
                const isOwnIframe = window.location.hostname === window.top.location.hostname;
                
                if (!isOwnIframe) {
                    // 如果不是自己的iframe，阻止嵌入
                    window.top.location = window.self.location;
                    incrementCounter(); // 计数+1，无提示
                }
            }
        } catch (e) {
            // 跨域访问被阻止，这是正常的
        }
    }
    
    function setupConsoleProtection() {
        if (!SECURITY_CONFIG.enableConsoleProtection) return;
        
        // 防止控制台输出敏感信息 - 使用装饰器模式
        try {
            const originalConsole = {
                log: console.log,
                warn: console.warn,
                error: console.error,
                info: console.info
            };
            
            // 定义要过滤的关键词
            const sensitivePatterns = [
                /password=([^&]*)/gi,
                /token=([^&]*)/gi,
                /secret=([^&]*)/gi,
                /auth=([^&]*)/gi,
                /api[_-]?key=([^&]*)/gi,
                /(?:secret|private|confidential):\s*["']?([^"'\s]+)["']?/gi
            ];
            
            // 安全包装函数
            function safeString(str) {
                let result = str;
                sensitivePatterns.forEach(pattern => {
                    result = result.replace(pattern, (match) => {
                        const parts = match.split('=');
                        if (parts.length === 2) {
                            return `${parts[0]}=***`;
                        }
                        return '***';
                    });
                });
                return result;
            }
            
            // 检查字符串是否包含敏感信息
            function containsSensitiveInfo(str) {
                if (typeof str !== 'string') return false;
                
                for (let pattern of sensitivePatterns) {
                    pattern.lastIndex = 0; // 重置正则表达式状态
                    if (pattern.test(str)) {
                        return true;
                    }
                }
                return false;
            }
            
            // 包装console方法
            console.log = function(...args) {
                // 检查是否包含敏感信息
                let hasSensitive = false;
                args.forEach(arg => {
                    if (containsSensitiveInfo(arg)) {
                        hasSensitive = true;
                    }
                });
                
                if (hasSensitive) {
                    incrementCounter(); // 计数+1，无提示
                }
                
                const safeArgs = args.map(arg => {
                    if (typeof arg === 'string') {
                        return safeString(arg);
                    }
                    return arg;
                });
                originalConsole.log.apply(console, safeArgs);
            };
            
            console.warn = function(...args) {
                // 检查是否包含敏感信息
                let hasSensitive = false;
                args.forEach(arg => {
                    if (containsSensitiveInfo(arg)) {
                        hasSensitive = true;
                    }
                });
                
                if (hasSensitive) {
                    incrementCounter(); // 计数+1，无提示
                }
                
                const safeArgs = args.map(arg => {
                    if (typeof arg === 'string') {
                        return safeString(arg);
                    }
                    return arg;
                });
                originalConsole.warn.apply(console, safeArgs);
            };
            
            console.error = function(...args) {
                // 检查是否包含敏感信息
                let hasSensitive = false;
                args.forEach(arg => {
                    if (containsSensitiveInfo(arg)) {
                        hasSensitive = true;
                    }
                });
                
                if (hasSensitive) {
                    incrementCounter(); // 计数+1，无提示
                }
                
                const safeArgs = args.map(arg => {
                    if (typeof arg === 'string') {
                        return safeString(arg);
                    }
                    return arg;
                });
                originalConsole.error.apply(console, safeArgs);
            };
            
            console.info = function(...args) {
                // 检查是否包含敏感信息
                let hasSensitive = false;
                args.forEach(arg => {
                    if (containsSensitiveInfo(arg)) {
                        hasSensitive = true;
                    }
                });
                
                if (hasSensitive) {
                    incrementCounter(); // 计数+1，无提示
                }
                
                const safeArgs = args.map(arg => {
                    if (typeof arg === 'string') {
                        return safeString(arg);
                    }
                    return arg;
                });
                originalConsole.info.apply(console, safeArgs);
            };
            
        } catch (e) {
            console.warn('护盾初始化失败:', e);
        }
    }
    
    // 页面完全加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupConsoleProtection();
        });
    } else {
        setupConsoleProtection();
    }
    
    // 导出配置和计数器（可选）
    window.SECURITY_CONFIG = SECURITY_CONFIG;
    window.getSecurityCounter = function() {
        return triggerCounter;
    };
    
    // 导出手动触发GIF的方法（方便测试）
    window.testSecurityGif = function() {
        triggerCounter = 10; // 设置为10，下一次触发就是11
        incrementCounter();
    };
    
})();