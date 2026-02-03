document.addEventListener('DOMContentLoaded', function () {
    const navButtons = document.querySelectorAll('.nav-button');
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const userInfo = document.getElementById('user-info');
    const clickAudio = document.getElementById('click-audio');

    // 页面路径 - 统一跳转到二级菜单页
    const pagePaths = {
        'A': './页面/A主页/简介V3.html',
        'B': './公共页/二级菜单页.html?config=tools',
        'C': './公共页/二级菜单页.html?config=guides',
        'D': './公共页/二级菜单页.html?config=more',
        'E': './公共页/二级菜单页.html?config=records',
        'F': './页面/F数据页/物品数据.html',
        'G': './公共页/二级菜单页.html?config=games'
    };

    // 点击计数器
    let clickCount = 0;
    const CLICK_THRESHOLD = 11;

    // 移动端菜单切换
    function toggleMobileMenu() {
        sidebar.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
    }

    // 初始化函数：设置默认显示的导航项
    function initializeDefaultNav() {
        const firstNavButton = navButtons[0];

        if (firstNavButton) {
            const firstPageId = firstNavButton.getAttribute('data-page');
            const config = firstNavButton.getAttribute('data-config');
            
            // 更新顶部标题
            const topBarTitle = document.querySelector('.top-bar h2');
            topBarTitle.textContent = firstNavButton.querySelector('span').textContent;

            // 根据配置加载页面
            if (pagePaths[firstPageId]) {
                document.getElementById('content-frame').src = pagePaths[firstPageId];
                firstNavButton.classList.add('active');
            } else {
                document.getElementById('content-frame').src = './公共页/加载.html';
            }
        } else {
            document.getElementById('content-frame').src = './公共页/加载.html';
        }
    }

    // 为每个导航按钮添加点击事件监听器
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 移除所有按钮的active类
            navButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');

            // 更新变动标题文本内容
            const topBarTitle = document.querySelector('.top-bar h2');
            topBarTitle.textContent = this.querySelector('span').textContent;

            // 获取当前按钮对应的页面标识和配置
            const pageId = this.getAttribute('data-page');
            const config = this.getAttribute('data-config');

            // 切换iframe的src路径
            if (pagePaths[pageId]) {
                document.getElementById('content-frame').src = pagePaths[pageId];
            } else {
                document.getElementById('content-frame').src = './公共页/加载.html';
            }

            // 在移动端点击导航项后关闭菜单
            if (window.innerWidth <= 968) {
                toggleMobileMenu();
            }
        });
    });

    // 用户信息区域点击事件
    userInfo.addEventListener('click', function () {
        clickCount++;

        try {
            if (!clickAudio.paused) {
                clickAudio.pause();
                clickAudio.currentTime = 0;
            }
            clickAudio.play().catch(function (error) {
                console.log('音频播放失败:', error);
            });
        } catch (error) {
            console.log('音频播放出错:', error);
        }

        if (clickCount >= CLICK_THRESHOLD) {
            window.open('./html/SSS/yuqi.html', '_blank');
            clickCount = 0;
        }
    });

    // 移动端菜单按钮点击事件
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', toggleMobileMenu);

    // 初始化页面
    initializeDefaultNav();

    // 监听窗口大小变化
    window.addEventListener('resize', function () {
        if (window.innerWidth > 968) {
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
        }
    });
});