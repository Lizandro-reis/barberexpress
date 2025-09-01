// Sistema de autenticação
class AuthSystem {
    constructor() {
        this.currentUser = this.loadUser();
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
    }
    
    bindEvents() {
        // Modal events
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.openModal('loginModal');
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.openModal('registerModal');
        });
        
        document.getElementById('loginClose').addEventListener('click', () => {
            this.closeModal('loginModal');
        });
        
        document.getElementById('registerClose').addEventListener('click', () => {
            this.closeModal('registerModal');
        });
        
        // Switch between login and register
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('loginModal');
            this.openModal('registerModal');
        });
        
        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('registerModal');
            this.openModal('loginModal');
        });
        
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    handleLogin(e) {
        const formData = new FormData(e.target);
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulação de login
        if (email && password) {
            const user = {
                id: Date.now(),
                name: 'Usuário Teste',
                email: email,
                phone: '(11) 99999-9999'
            };
            
            this.saveUser(user);
            this.currentUser = user;
            this.closeModal('loginModal');
            this.updateUI();
            this.showMessage('Login realizado com sucesso!', 'success');
        }
    }
    
    handleRegister(e) {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem!', 'error');
            return;
        }
        
        if (name && email && phone && password) {
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone
            };
            
            this.saveUser(user);
            this.currentUser = user;
            this.closeModal('registerModal');
            this.updateUI();
            this.showMessage('Conta criada com sucesso!', 'success');
        }
    }
    
    logout() {
        localStorage.removeItem('barberExpressUser');
        this.currentUser = null;
        this.updateUI();
        this.showMessage('Logout realizado com sucesso!', 'success');
    }
    
    saveUser(user) {
        localStorage.setItem('barberExpressUser', JSON.stringify(user));
    }
    
    loadUser() {
        const userData = localStorage.getItem('barberExpressUser');
        return userData ? JSON.parse(userData) : null;
    }
    
    updateUI() {
        const navAuth = document.querySelector('.nav-auth');
        
        if (this.currentUser) {
            navAuth.innerHTML = `
                <span class="user-greeting">Olá, ${this.currentUser.name.split(' ')[0]}</span>
                <button class="btn-secondary" id="dashboardBtn">Minha Agenda</button>
                <button class="btn-secondary" id="logoutBtn">Sair</button>
            `;
            
            // Bind new events
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.logout();
            });
            
            document.getElementById('dashboardBtn').addEventListener('click', () => {
                this.showDashboard();
            });
        } else {
            navAuth.innerHTML = `
                <button class="btn-secondary" id="loginBtn">Entrar</button>
                <button class="btn-primary" id="registerBtn">Cadastrar</button>
            `;
            
            // Re-bind events
            document.getElementById('loginBtn').addEventListener('click', () => {
                this.openModal('loginModal');
            });
            
            document.getElementById('registerBtn').addEventListener('click', () => {
                this.openModal('registerModal');
            });
        }
    }
    
    showDashboard() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">Minha Agenda</h1>
                        <p class="dashboard-subtitle">Gerencie seus agendamentos</p>
                    </div>
                    
                    <div class="dashboard-content">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Próximos Agendamentos</h3>
                                <button class="btn-primary" id="newBookingBtn">Novo Agendamento</button>
                            </div>
                            <div id="upcomingAppointments">
                                <div class="appointment-card">
                                    <div class="appointment-date">25 de Janeiro, 2025 - 14:30</div>
                                    <div class="appointment-details">
                                        <strong>Corte + Barba</strong><br>
                                        Barbeiro: Carlos Silva<br>
                                        Valor: R$ 55,00
                                    </div>
                                </div>
                                <div class="appointment-card">
                                    <div class="appointment-date">28 de Janeiro, 2025 - 16:00</div>
                                    <div class="appointment-details">
                                        <strong>Corte Tradicional</strong><br>
                                        Barbeiro: João Santos<br>
                                        Valor: R$ 35,00
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Histórico</h3>
                            </div>
                            <div id="appointmentHistory">
                                <div class="appointment-card" style="opacity: 0.7;">
                                    <div class="appointment-date">15 de Janeiro, 2025 - 15:00</div>
                                    <div class="appointment-details">
                                        <strong>Barba Completa</strong><br>
                                        Barbeiro: Pedro Costa<br>
                                        Status: Concluído
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event for new booking
        document.getElementById('newBookingBtn').addEventListener('click', () => {
            window.bookingSystem.openBookingModal();
        });
        
        // Update navbar
        document.querySelector('.navbar').classList.add('user-nav');
    }
    
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            background: ${type === 'success' ? 'var(--success-500)' : 
                       type === 'error' ? 'var(--error-500)' : 
                       'var(--primary-700)'};
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 3000);
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
}

// Adicionar animações para mensagens
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .user-greeting {
        color: var(--primary-200);
        font-weight: 500;
        margin-right: var(--space-4);
    }
`;
document.head.appendChild(style);