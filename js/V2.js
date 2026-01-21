document.addEventListener('DOMContentLoaded', function () {
    // 获取所有选项卡按钮
    const tabButtons = document.querySelectorAll('.tab-button');
    // 获取iframe元素
    const contentFrame = document.getElementById('content-frame');

    // 使用全局路径映射或默认值
    const pathMap = typeof PAGE_PATH_MAP !== 'undefined' ? PAGE_PATH_MAP : contentFrame.src = '../mo/加载.html';

    // 初始化函数：设置默认显示的路径
    function initializeDefaultTab() {
        // 获取第一个选项卡按钮
        const firstTabButton = tabButtons[0];

        if (firstTabButton) {
            // 获取第一个按钮的路径数据
            const firstPath = firstTabButton.getAttribute('data-path');

            // 根据第一个路径设置iframe的src
            if (pathMap[firstPath]) {
                contentFrame.src = pathMap[firstPath];
                // 激活第一个选项卡
                firstTabButton.classList.add('active');
            } else {
                contentFrame.src = '../mo/加载.html';
            }
        } else {
            // 如果没有选项卡按钮，显示加载页面
            contentFrame.src = '../mo/加载.html';
        }
    }

    // 为每个选项卡按钮添加点击事件监听器
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 移除所有按钮的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // 为当前点击的按钮添加active类
            this.classList.add('active');

            // 获取当前按钮的路径数据
            const path = this.getAttribute('data-path');

            // 根据路径设置iframe的src
            if (pathMap[path]) {
                contentFrame.src = pathMap[path];
            } else {
                contentFrame.src = '../mo/加载.html';
            }
        });
    });

    // 初始化页面
    initializeDefaultTab();
});