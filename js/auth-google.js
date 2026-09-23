// js/auth-google.js - Google Auth en desarrollo

const GoogleAuth = {
    isAuthenticated: false,
    user: null,
    
    // ===== INICIAR SESIÓN (EN DESARROLLO) =====
    signIn() {
        app.mostrarToast('🚧 Google Auth en desarrollo - Próximamente disponible');
        // Mostrar modal informativo
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.id = 'modalGoogleDev';
        modal.innerHTML = `
            <div class="modal-box" style="text-align:center;">
                <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
                <span class="modal-icon">🔧</span>
                <h2>En desarrollo</h2>
                <p class="modal-sub">La autenticación con Google estará disponible próximamente.</p>
                <div style="background:#fff3e0;border-radius:12px;padding:16px;margin:12px 0;">
                    <div style="font-size:48px;">🚀</div>
                    <p style="color:#5a7a6a;font-size:14px;">Mientras tanto, regístrate con tu número de teléfono</p>
                </div>
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Entendido</button>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    // ===== CERRAR SESIÓN =====
    signOut() {
        this.isAuthenticated = false;
        this.user = null;
        localStorage.removeItem('google_user');
        app.mostrarToast('🔒 Sesión cerrada');
        if (app.currentPage === 'credit') {
            initCredit();
        }
    },
    
    // ===== OBTENER USUARIO =====
    getUser() {
        if (!this.user) {
            const saved = localStorage.getItem('google_user');
            if (saved) {
                this.user = JSON.parse(saved);
                this.isAuthenticated = true;
            }
        }
        return this.user;
    },
    
    // ===== VERIFICAR AUTENTICACIÓN =====
    checkAuth() {
        this.getUser();
        return this.isAuthenticated;
    }
};

window.GoogleAuth = GoogleAuth;