class NavigationManager {
            constructor() {
                this.navButtons = document.querySelectorAll('.nav-button');
                this.sidebar = document.getElementById('sidebar');
                this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                this.mobileOverlay = document.getElementById('mobile-overlay');
                this.contentFrame = document.getElementById('content-frame');
                this.topBarTitle = document.querySelector('.top-bar h2');
                this.themeToggle = document.getElementById('theme-toggle');
                this.themeText = document.querySelector('.theme-text');

                // 页面路径配置
                this.pagePaths = PagePaths;

                // 主题配置
                this.themes = ['default', 'light-orange'];
                this.currentThemeIndex = 0;
                this.themeNames = ['黑', '白'];

                this.init();
            }

            init() {
                this.bindEvents();
                this.initializeDefaultNav();
                this.loadTheme();
                this.fixMobileMenuBug();
            }

            fixMobileMenuBug() {
                document.addEventListener('click', (e) => {
                    const isMobile = window.innerWidth <= 968;
                    const isMenuButton = e.target.closest('#mobile-menu-toggle');
                    const isInSidebar = e.target.closest('#sidebar');
                    const isOverlay = e.target.closest('#mobile-overlay');

                    if (isMobile && !isMenuButton && !isInSidebar && isOverlay) {
                        this.toggleMobileMenu();
                    }
                });

                this.sidebar.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            bindEvents() {
                this.navButtons.forEach(button => {
                    button.addEventListener('click', (e) => this.handleNavClick(e));
                });

                this.mobileMenuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMobileMenu();
                });

                this.mobileOverlay.addEventListener('click', () => this.toggleMobileMenu());

                if (this.themeToggle) {
                    this.themeToggle.addEventListener('click', () => this.toggleTheme());
                }

                this.contentFrame.addEventListener('load', () => this.handleIframeLoad());

                window.addEventListener('resize', () => this.handleResize());

                document.addEventListener('keydown', (e) => this.handleKeyPress(e));

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && window.innerWidth <= 968) {
                        this.closeMobileMenu();
                    }
                });
            }

            handleNavClick(event) {
                const button = event.currentTarget;
                this.animateButtonClick(button);
                this.updateActiveButton(button);
                this.updateTitle(button);
                this.loadPage(button);

                if (window.innerWidth <= 968) {
                    this.closeMobileMenu();
                }
            }

            animateButtonClick(button) {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            }

            updateActiveButton(activeButton) {
                this.navButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                activeButton.classList.add('active');
            }

            updateTitle(button) {
                const titleText = button.querySelector('span').textContent;
                this.topBarTitle.textContent = titleText;
                this.topBarTitle.classList.add('updating');
                setTimeout(() => {
                    this.topBarTitle.classList.remove('updating');
                }, 1000);
            }

            loadPage(button) {
                const pageId = button.getAttribute('data-page');
                if (this.pagePaths[pageId]) {
                    this.contentFrame.classList.remove('loaded');
                    this.contentFrame.src = this.pagePaths[pageId];
                    this.animatePageTransition();
                }
            }

            animatePageTransition() {
                const frame = this.contentFrame;
                frame.style.opacity = '0';
                frame.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    frame.style.opacity = '1';
                    frame.style.transform = 'translateY(0)';
                    frame.style.transition = 'all 0.3s ease';
                }, 100);
            }

            handleIframeLoad() {
                this.contentFrame.classList.add('loaded');
            }

            toggleMobileMenu() {
                this.sidebar.classList.toggle('active');
                this.mobileOverlay.classList.toggle('active');
            }

            closeMobileMenu() {
                this.sidebar.classList.remove('active');
                this.mobileOverlay.classList.remove('active');
            }

            handleResize() {
                if (window.innerWidth > 968) {
                    this.closeMobileMenu();
                }
            }

            handleKeyPress(event) {
                if (event.key >= '1' && event.key <= '9') {
                    const index = parseInt(event.key) - 1;
                    if (this.navButtons[index]) {
                        this.navButtons[index].click();
                    }
                }

                if (event.ctrlKey && event.key === 't') {
                    event.preventDefault();
                    this.toggleTheme();
                }
            }

            toggleTheme() {
                this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
                const newTheme = this.themes[this.currentThemeIndex];
                document.body.setAttribute('data-theme', newTheme === 'default' ? '' : newTheme);

                if (this.themeText) {
                    this.themeText.textContent = this.themeNames[this.currentThemeIndex];
                }

                localStorage.setItem('preferred-theme', newTheme);
            }

            loadTheme() {
                const savedTheme = localStorage.getItem('preferred-theme') || 'default';
                const themeIndex = this.themes.indexOf(savedTheme);

                if (themeIndex !== -1) {
                    this.currentThemeIndex = themeIndex;
                    document.body.setAttribute('data-theme', savedTheme === 'default' ? '' : savedTheme);

                    if (this.themeText) {
                        this.themeText.textContent = this.themeNames[this.currentThemeIndex];
                    }
                }
            }

            initializeDefaultNav() {
                const firstNavButton = this.navButtons[0];
                if (firstNavButton) {
                    const firstPageId = firstNavButton.getAttribute('data-page');
                    this.topBarTitle.textContent = firstNavButton.querySelector('span').textContent;

                    if (this.pagePaths[firstPageId]) {
                        this.contentFrame.src = this.pagePaths[firstPageId];
                        firstNavButton.classList.add('active');
                    }
                }
            }
        }

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            new NavigationManager();
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(10px)';
            document.body.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                document.body.style.opacity = '1';
                document.body.style.transform = 'translateY(0)';
            }, 100);
        });