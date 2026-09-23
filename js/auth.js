// js/auth.js
const AuthSystem = {
    registerWithGoogle() {
        const name = prompt('👤 Ingresa tu nombre:');
        if (!name) return false;
        
        const phone = prompt('📱 Ingresa tu número de teléfono (ej: 52985279):');
        if (!phone || phone.length < 8) {
            app.mostrarToast('❌ Número inválido');
            return false;
        }
        
        if (this.getUser()) {
            app.mostrarToast('❌ Ya tienes una cuenta');
            return false;
        }
        
        const user = {
            id: 'user_' + Date.now(),
            name: name,
            phone: phone,
            provider: 'google',
            created: new Date().toISOString(),
            credit: 5
        };
        
        localStorage.setItem('transferpay_user', JSON.stringify(user));
        localStorage.setItem('transferpay_credit', user.credit);
        
        app.user = user;
        app.updateCreditUI();
        document.getElementById('headerUser').textContent = `👤 ${user.name}`;
        app.mostrarToast(`✅ Bienvenido ${user.name}! Tienes ${user.credit} créditos gratis`);
        return true;
    },
    
    getUser() {
        const saved = localStorage.getItem('transferpay_user');
        if (!saved) return null;
        try {
            return JSON.parse(saved);
        } catch(e) {
            return null;
        }
    },
    
    logout() {
        if (confirm('¿Deseas cerrar sesión?')) {
            app.user = null;
            document.getElementById('headerUser').textContent = '👤';
            app.mostrarToast('🔒 Sesión cerrada');
            if (app.currentPage === 'credit') {
                app.initPage('credit', {});
            }
        }
    },
    
    updateCredit(amount) {
        const user = this.getUser();
        if (!user) return false;
        user.credit = amount;
        localStorage.setItem('transferpay_user', JSON.stringify(user));
        return true;
    },
    
    isAuthenticated() {
        return this.getUser() !== null;
    }
};

window.AuthSystem = AuthSystem;