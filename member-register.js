(function () {
    const API_BASE = 'http://127.0.0.1:3000';
    const STYLE_ID = 'memberRegisterStyles';
    const MODAL_ID = 'registerModal';
    const FORM_ID = 'registerForm';
    const OPEN_BUTTON_ID = 'openRegisterModalBtn';
    const CLOSE_BUTTON_ID = 'closeRegisterModalBtn';
    const LOGIN_TAB_ID = 'loginTab';
    const REGISTER_TAB_ID = 'registerTab';
    const LOGIN_FORM_ID = 'loginForm';
    const LOGIN_USERNAME_ID = 'loginUsername';
    const LOGIN_PASSWORD_ID = 'loginPassword';
    const AUTH_STATUS_ID = 'authStatus';

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            .auth-modal {
                position: fixed;
                inset: 0;
                background: rgba(3, 3, 5, 0.72);
                display: grid;
                place-items: center;
                padding: 1rem;
                z-index: 3000;
            }

            .auth-modal[hidden] {
                display: none;
            }

            .auth-card {
                width: min(420px, 100%);
                background: rgba(18, 18, 22, 0.98);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 18px;
                padding: 1.25rem;
                box-shadow: 0 20px 50px rgba(0,0,0,0.45);
            }

            .auth-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .auth-header h2 {
                margin: 0;
                font-size: 1.2rem;
            }

            .auth-close {
                border: 1px solid rgba(255,255,255,0.16);
                background: transparent;
                color: #fff;
                border-radius: 10px;
                width: 2rem;
                height: 2rem;
                cursor: pointer;
            }

            .auth-form {
                display: grid;
                gap: 0.9rem;
            }

            .auth-tabs {
                display: flex;
                gap: 0.6rem;
                margin-bottom: 0.7rem;
            }

            .auth-tab {
                border: 1px solid rgba(255,255,255,0.14);
                background: rgba(255,255,255,0.06);
                color: #fff;
                border-radius: 999px;
                padding: 0.45rem 0.8rem;
                cursor: pointer;
            }

            .auth-tab.active {
                background: linear-gradient(135deg, #e50914, #b20710);
            }

            .auth-form label {
                display: grid;
                gap: 0.45rem;
                color: #e4e4e4;
                font-size: 0.92rem;
            }

            .auth-form input {
                width: 100%;
                min-height: 44px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.16);
                background: rgba(255,255,255,0.06);
                color: #fff;
                padding: 0.75rem 0.9rem;
                font: inherit;
                outline: none;
            }

            .auth-form input:focus {
                border-color: rgba(229,9,20,0.8);
                background: rgba(255,255,255,0.1);
            }

            .auth-submit {
                min-height: 46px;
                border: none;
                border-radius: 999px;
                cursor: pointer;
                background: linear-gradient(135deg, #e50914, #b20710);
                color: #fff;
                font-weight: 700;
            }

            .auth-submit:hover {
                filter: brightness(1.05);
            }

            .auth-tip {
                color: #a3a3a3;
                font-size: 0.82rem;
                line-height: 1.5;
            }

            .auth-status {
                color: #ffd7d7;
                font-size: 0.85rem;
                min-height: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }

    function getStoredToken() {
        return localStorage.getItem('memberAuthToken');
    }

    function setStoredToken(token) {
        if (token) localStorage.setItem('memberAuthToken', token);
        else localStorage.removeItem('memberAuthToken');
    }

    async function requestJson(path, options = {}) {
        const response = await fetch(`${API_BASE}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || '请求失败');
        }
        return data;
    }

    function showToast(message) {
        const toast = document.getElementById('shareToast') || document.getElementById('memberToast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            window.clearTimeout(window.memberToastTimer);
            window.memberToastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
            return;
        }
        window.alert(message);
    }

    function openRegisterModal() {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;
        modal.hidden = false;
        document.body.classList.add('modal-open');
        const username = document.getElementById('registerUsername');
        requestAnimationFrame(() => username?.focus());
    }

    function closeRegisterModal() {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const username = document.getElementById('registerUsername')?.value.trim();
        const password = document.getElementById('registerPassword')?.value.trim();

        if (!username || !password) {
            showToast('请输入用户名和密码。');
            return;
        }

        if (username.length < 3) {
            showToast('用户名至少3个字符。');
            return;
        }

        if (password.length < 6) {
            showToast('密码至少6个字符。');
            return;
        }

        try {
            const data = await requestJson('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            setStoredToken(data.token);
            form.reset();
            closeRegisterModal();
            showToast(`会员注册成功：${data.user.username} 已加入。`);
            updateAuthStatus();
        } catch (error) {
            showToast(error.message || '注册失败');
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        const username = document.getElementById(LOGIN_USERNAME_ID)?.value.trim();
        const password = document.getElementById(LOGIN_PASSWORD_ID)?.value.trim();

        if (!username || !password) {
            showToast('请输入用户名和密码。');
            return;
        }

        try {
            const data = await requestJson('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            setStoredToken(data.token);
            document.getElementById(LOGIN_FORM_ID)?.reset();
            closeRegisterModal();
            showToast(`欢迎回来，${data.user.username}。`);
            updateAuthStatus();
        } catch (error) {
            showToast(error.message || '登录失败');
        }
    }

    function updateAuthStatus() {
        const status = document.getElementById(AUTH_STATUS_ID);
        if (!status) return;
        const token = getStoredToken();
        if (!token) {
            status.textContent = '尚未登录';
            return;
        }
        status.textContent = '已登录，欢迎使用会员功能';
    }

    function switchTab(target) {
        const loginPanel = document.getElementById('loginPanel');
        const registerPanel = document.getElementById('registerPanel');
        const loginTab = document.getElementById(LOGIN_TAB_ID);
        const registerTab = document.getElementById(REGISTER_TAB_ID);
        if (!loginPanel || !registerPanel || !loginTab || !registerTab) return;
        const isLogin = target === 'login';
        loginPanel.hidden = !isLogin;
        registerPanel.hidden = isLogin;
        loginTab.classList.toggle('active', isLogin);
        registerTab.classList.toggle('active', !isLogin);
    }

    function bindModalEvents() {
        const openButton = document.getElementById(OPEN_BUTTON_ID);
        const closeButton = document.getElementById(CLOSE_BUTTON_ID);
        const modal = document.getElementById(MODAL_ID);
        const form = document.getElementById(FORM_ID);
        const loginForm = document.getElementById(LOGIN_FORM_ID);
        const loginTab = document.getElementById(LOGIN_TAB_ID);
        const registerTab = document.getElementById(REGISTER_TAB_ID);

        if (openButton) {
            openButton.addEventListener('click', openRegisterModal);
        }

        if (closeButton) {
            closeButton.addEventListener('click', closeRegisterModal);
        }

        if (modal) {
            modal.addEventListener('click', event => {
                if (event.target === modal) closeRegisterModal();
            });
        }

        if (form) {
            form.addEventListener('submit', handleRegisterSubmit);
        }

        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }

        if (loginTab) {
            loginTab.addEventListener('click', () => switchTab('login'));
        }

        if (registerTab) {
            registerTab.addEventListener('click', () => switchTab('register'));
        }
    }

    injectStyles();
    bindModalEvents();
    updateAuthStatus();
    switchTab('login');
})();
