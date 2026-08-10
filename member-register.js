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
    const AUTH_NAV_STATUS_ID = 'authNavStatus';
    const LOGOUT_BUTTON_ID = 'logoutBtn';
    const OPEN_BUTTON_LABEL = '会员中心';
    const REGISTER_CONTACT_ID = 'registerContact';
    const REGISTER_CODE_ID = 'registerCode';
    const SEND_CODE_BUTTON_ID = 'sendRegisterCodeBtn';
    const PLAN_CARDS_SELECTOR = '.plan-card';

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            .auth-inline-field {
                display: flex;
                align-items: end;
                gap: 0.7rem;
            }

            .auth-inline-field label {
                flex: 1;
            }

            .auth-secondary {
                min-height: 48px;
                border: 1px solid rgba(255,255,255,0.14);
                border-radius: 12px;
                background: rgba(255,255,255,0.04);
                color: #fff;
                padding: 0.7rem 0.8rem;
                cursor: pointer;
                font-weight: 700;
                white-space: nowrap;
            }

            .auth-secondary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .auth-hero {
                margin-bottom: 1rem;
                padding: 0.9rem 1rem;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 14px;
                background: linear-gradient(135deg, rgba(229,9,20,0.12), rgba(255,255,255,0.02));
            }

            .auth-pretitle {
                color: #ff9aa0;
                font-size: 0.75rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                margin-bottom: 0.45rem;
            }

            .auth-hero h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 800;
            }

            .auth-steps {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0.9rem 0 1rem;
                color: rgba(255,255,255,0.72);
                font-size: 0.76rem;
            }

            .auth-step {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.12);
            }

            .auth-step.active {
                background: linear-gradient(135deg, #ff2a2a, #e50914);
                border-color: transparent;
                color: #fff;
            }

            .auth-benefits {
                display: grid;
                gap: 0.45rem;
                margin: 0 0 1rem;
                padding: 0.9rem 0.95rem;
                border-radius: 12px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.08);
                color: rgba(255,255,255,0.8);
            }

            .auth-benefits-title {
                font-size: 0.78rem;
                letter-spacing: 0.1em;
                color: #ffb3b8;
                text-transform: uppercase;
                margin-bottom: 0.15rem;
            }

            .auth-benefits ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                gap: 0.35rem;
                font-size: 0.84rem;
            }

            .auth-benefits li::before {
                content: "•";
                color: #ff6069;
                margin-right: 0.45rem;
            }

            .auth-check-row {
                display: flex;
                align-items: center;
                gap: 0.6rem;
                color: rgba(255,255,255,0.76);
                font-size: 0.82rem;
                margin-top: 0.25rem;
            }

            .auth-check-row input {
                width: 1rem;
                height: 1rem;
                accent-color: #e50914;
            }

            .auth-modal {
                position: fixed;
                inset: 0;
                display: grid;
                place-items: center;
                padding: 1.25rem;
                background: rgba(2, 2, 4, 0.82);
                backdrop-filter: blur(8px);
                z-index: 3000;
            }

            .auth-modal[hidden] {
                display: none;
            }

            .auth-card {
                position: relative;
                width: min(460px, 100%);
                background: linear-gradient(180deg, rgba(20, 20, 24, 0.98) 0%, rgba(10, 10, 12, 0.98) 100%);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 26px;
                padding: 1.35rem 1.3rem 1.2rem;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.7);
                overflow: hidden;
            }

            .auth-card::before {
                content: "";
                position: absolute;
                inset: -35% auto auto -18%;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(229, 9, 20, 0.38), rgba(229, 9, 20, 0));
                pointer-events: none;
            }

            .auth-header {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .auth-header h2 {
                margin: 0;
                font-size: clamp(1.3rem, 2vw, 1.7rem);
                line-height: 1.2;
                font-weight: 800;
                letter-spacing: -0.03em;
                color: #fff;
            }

            .auth-brand {
                display: inline-flex;
                align-items: center;
                gap: 0.7rem;
            }

            .auth-brand-mark {
                width: 2.15rem;
                height: 2.15rem;
                display: inline-grid;
                place-items: center;
                background: linear-gradient(135deg, #ff2a2a 0%, #e50914 100%);
                border-radius: 10px;
                box-shadow: 0 10px 24px rgba(229, 9, 20, 0.35);
                font-weight: 900;
                font-size: 1rem;
                color: #fff;
            }

            .auth-close {
                width: 2.2rem;
                height: 2.2rem;
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: rgba(255, 255, 255, 0.04);
                color: #fff;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.2s ease;
            }

            .auth-close:hover {
                background: rgba(229, 9, 20, 0.12);
                border-color: rgba(229, 9, 20, 0.5);
            }

            .auth-form {
                position: relative;
                z-index: 1;
                display: grid;
                gap: 0.9rem;
            }

            .auth-tabs {
                position: relative;
                z-index: 1;
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 0.5rem;
                padding: 0.35rem;
                margin-bottom: 1rem;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            .auth-tab {
                border: none;
                background: transparent;
                color: rgba(255, 255, 255, 0.72);
                border-radius: 999px;
                padding: 0.7rem 0.8rem;
                cursor: pointer;
                font-weight: 700;
                letter-spacing: 0.01em;
                transition: all 0.2s ease;
            }

            .auth-tab.active {
                background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
                color: #fff;
                box-shadow: 0 10px 24px rgba(229, 9, 20, 0.3);
            }

            .auth-form label {
                display: grid;
                gap: 0.52rem;
                color: #ececec;
                font-size: 0.9rem;
                font-weight: 600;
            }

            .auth-form input {
                width: 100%;
                min-height: 48px;
                border-radius: 14px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: rgba(18, 18, 22, 0.82);
                color: #fff;
                padding: 0.78rem 0.9rem;
                font: inherit;
                outline: none;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            }

            .auth-form input::placeholder {
                color: rgba(255, 255, 255, 0.42);
            }

            .auth-form input:focus {
                border-color: rgba(229, 9, 20, 0.8);
                background: rgba(255, 255, 255, 0.04);
                box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.14);
            }

            .auth-submit {
                min-height: 48px;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                background: linear-gradient(135deg, #ff2a2a 0%, #e50914 50%, #b20710 100%);
                color: #fff;
                font-weight: 800;
                font-size: 1rem;
                letter-spacing: 0.04em;
                transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
                box-shadow: 0 16px 30px rgba(229, 9, 20, 0.28);
            }

            .auth-submit:hover {
                transform: translateY(-1px);
                filter: brightness(1.05);
            }

            .auth-tip {
                position: relative;
                z-index: 1;
                margin-top: 0.85rem;
                padding-top: 0.8rem;
                border-top: 1px solid rgba(255, 255, 255, 0.08);
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.8rem;
                line-height: 1.6;
            }

            .auth-status {
                position: relative;
                z-index: 1;
                color: #ffd7d7;
                font-size: 0.84rem;
                min-height: 1.2rem;
                margin-top: 0.55rem;
            }

            .auth-nav-status {
                color: #ffd7d7;
                font-size: 0.9rem;
                white-space: nowrap;
            }

            .member-only-hint {
                color: #ffb3b8;
                font-size: 0.9rem;
                margin-top: 0.5rem;
            }

            @media (max-width: 520px) {
                .auth-card {
                    border-radius: 20px;
                    padding: 1.05rem 1rem 1rem;
                }

                .auth-header {
                    margin-bottom: 0.8rem;
                }

                .auth-tab {
                    padding: 0.65rem 0.7rem;
                    font-size: 0.92rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function getStoredToken() {
        return localStorage.getItem('memberAuthToken');
    }

    function getStoredUsername() {
        return localStorage.getItem('memberUsername') || '';
    }

    function setStoredToken(token) {
        if (token) localStorage.setItem('memberAuthToken', token);
        else localStorage.removeItem('memberAuthToken');
    }

    function setStoredUsername(username) {
        if (username) localStorage.setItem('memberUsername', username);
        else localStorage.removeItem('memberUsername');
    }

    async function requestJson(path, options = {}) {
        const token = getStoredToken();
        const response = await fetch(`${API_BASE}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            ...options,
            headers: {
                ...(options.headers || {}),
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
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
        const contact = document.getElementById(REGISTER_CONTACT_ID);
        requestAnimationFrame(() => contact?.focus());
    }

    function closeRegisterModal() {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }

    function normalizeContact(value) {
        return String(value || '').trim();
    }

    function isEmailValue(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isPhoneValue(value) {
        const digits = value.replace(/\D/g, '');
        return /^1\d{10}$/.test(digits);
    }

    function readPendingRegisterCode() {
        try {
            const raw = sessionStorage.getItem('pendingRegisterCode');
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function savePendingRegisterCode(contact, code) {
        sessionStorage.setItem('pendingRegisterCode', JSON.stringify({ contact, code, createdAt: Date.now() }));
    }

    function clearPendingRegisterCode() {
        sessionStorage.removeItem('pendingRegisterCode');
    }

    function getSelectedPlan() {
        const card = document.querySelector(`${PLAN_CARDS_SELECTOR}.active`);
        return card?.dataset.plan || 'standard';
    }

    function syncPlanSelection(planName = 'standard') {
        document.querySelectorAll(PLAN_CARDS_SELECTOR).forEach(card => {
            card.classList.toggle('active', card.dataset.plan === planName);
            card.setAttribute('aria-pressed', String(card.dataset.plan === planName));
        });
    }

    function sendRegisterCode() {
        const contact = normalizeContact(document.getElementById(REGISTER_CONTACT_ID)?.value);
        if (!contact) {
            showToast('请输入邮箱或手机号。');
            return;
        }
        if (!isEmailValue(contact) && !isPhoneValue(contact)) {
            showToast('请输入正确的邮箱或手机号。');
            return;
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));
        savePendingRegisterCode(contact, code);

        const button = document.getElementById(SEND_CODE_BUTTON_ID);
        if (button) {
            button.disabled = true;
            let countdown = 60;
            button.textContent = `${countdown}s`;
            const timer = window.setInterval(() => {
                countdown -= 1;
                if (button) {
                    button.textContent = `${countdown}s`;
                }
                if (countdown <= 0) {
                    window.clearInterval(timer);
                    if (button) {
                        button.disabled = false;
                        button.textContent = '获取验证码';
                    }
                }
            }, 1000);
        }

        showToast(`验证码已发送：${code}（演示用，实际项目中应接入短信或邮件服务）`);
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const contact = normalizeContact(document.getElementById(REGISTER_CONTACT_ID)?.value);
        const verificationCode = document.getElementById(REGISTER_CODE_ID)?.value.trim();
        const password = document.getElementById('registerPassword')?.value.trim();
        const agree = document.getElementById('registerAgree');
        const plan = getSelectedPlan();

        if (!contact || (!isEmailValue(contact) && !isPhoneValue(contact))) {
            showToast('请输入正确的邮箱或手机号。');
            return;
        }

        if (!verificationCode || verificationCode.length !== 6) {
            showToast('请输入6位验证码。');
            return;
        }

        const pending = readPendingRegisterCode();
        if (!pending || pending.contact !== contact || pending.code !== verificationCode) {
            showToast('验证码不正确或已失效，请重新获取。');
            return;
        }

        if (!password || password.length < 6) {
            showToast('密码至少6个字符。');
            return;
        }

        if (!agree || !agree.checked) {
            showToast('请阅读并接受会员服务条款。');
            return;
        }

        try {
            const data = await requestJson('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: contact, password, plan })
            });
            setStoredToken(data.token);
            setStoredUsername(data.user.username);
            clearPendingRegisterCode();
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
            setStoredUsername(data.user.username);
            document.getElementById(LOGIN_FORM_ID)?.reset();
            closeRegisterModal();
            showToast(`欢迎回来，${data.user.username}。`);
            updateAuthStatus();
        } catch (error) {
            showToast(error.message || '登录失败');
        }
    }

    async function restoreSession() {
        const token = getStoredToken();
        const username = getStoredUsername();
        if (!token) {
            updateAuthStatus();
            return;
        }
        try {
            const data = await requestJson('/api/auth/me');
            setStoredUsername(data.user.username);
            updateAuthStatus(data.user.username);
        } catch (error) {
            setStoredToken(null);
            setStoredUsername(null);
            updateAuthStatus();
        }
    }

    async function logout() {
        const token = getStoredToken();
        if (token) {
            try {
                await requestJson('/api/auth/logout', { method: 'POST' });
            } catch (error) {
                // ignore and clear locally
            }
        }
        setStoredToken(null);
        setStoredUsername(null);
        updateAuthStatus();
        showToast('已退出登录。');
    }

    function updateAuthStatus(username = getStoredUsername()) {
        const status = document.getElementById(AUTH_STATUS_ID);
        const navStatus = document.getElementById(AUTH_NAV_STATUS_ID);
        const logoutButton = document.getElementById(LOGOUT_BUTTON_ID);
        const openButton = document.getElementById(OPEN_BUTTON_ID);
        const token = getStoredToken();

        if (status) {
            status.textContent = token && username ? `欢迎，${username}` : '';
        }
        if (navStatus) {
            navStatus.textContent = token && username ? `欢迎，${username}` : '';
        }
        if (logoutButton) {
            logoutButton.hidden = true;
        }
        if (openButton) {
            openButton.hidden = !token;
            openButton.textContent = token ? '会员中心' : '会员注册';
        }
    }

    function switchTab(target) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const loginTab = document.getElementById(LOGIN_TAB_ID);
        const registerTab = document.getElementById(REGISTER_TAB_ID);
        if (!loginTab || !registerTab) return;
        const isLogin = target === 'login';
        if (loginForm) loginForm.hidden = !isLogin;
        if (registerForm) registerForm.hidden = isLogin;
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
        const logoutButton = document.getElementById(LOGOUT_BUTTON_ID);
        const sendCodeButton = document.getElementById(SEND_CODE_BUTTON_ID);

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

        document.querySelectorAll(PLAN_CARDS_SELECTOR).forEach(card => {
            card.addEventListener('click', () => {
                syncPlanSelection(card.dataset.plan || 'standard');
            });
        });

        if (sendCodeButton) {
            sendCodeButton.addEventListener('click', sendRegisterCode);
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                logout();
            });
        }
    }

    injectStyles();
    bindModalEvents();
    syncPlanSelection('standard');
    updateAuthStatus();
    restoreSession();
    switchTab('login');
})();
