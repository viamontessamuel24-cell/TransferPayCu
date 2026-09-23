// js/credit.js - Con anuncios activos y Google en desarrollo

const CreditSystem = {
    getBalance() {
        return parseInt(localStorage.getItem('transferpay_credit')) || 0;
    },
    
    add(amount) {
        const current = this.getBalance();
        const newBalance = current + amount;
        localStorage.setItem('transferpay_credit', newBalance);
        this.updateUI();
        return newBalance;
    },
    
    use(amount = 1) {
        const current = this.getBalance();
        if (current < amount) {
            app.mostrarToast('❌ Crédito insuficiente');
            return false;
        }
        const newBalance = current - amount;
        localStorage.setItem('transferpay_credit', newBalance);
        this.updateUI();
        return true;
    },
    
    hasEnough(amount = 1) {
        return this.getBalance() >= amount;
    },
    
    updateUI() {
        if (app) {
            app.updateCreditUI();
        }
        const el = document.getElementById('headerCredit');
        if (el) {
            el.textContent = `💎 ${this.getBalance()}`;
        }
        const balanceEl = document.getElementById('creditBalance');
        if (balanceEl) {
            balanceEl.textContent = this.getBalance();
        }
    },
    
    getHistory() {
        const history = localStorage.getItem('transferpay_credit_history');
        return history ? JSON.parse(history) : [];
    },
    
    addTransaction(type, amount, description) {
        const history = this.getHistory();
        history.unshift({
            date: new Date().toISOString(),
            type: type,
            amount: amount,
            description: description || '',
            balance: this.getBalance()
        });
        if (history.length > 50) history.pop();
        localStorage.setItem('transferpay_credit_history', JSON.stringify(history));
    },
    
    consultarMovimientos() {
        const history = this.getHistory();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.id = 'modalMovimientos';
        modal.innerHTML = `
            <div class="modal-box" style="max-height:80vh;overflow-y:auto;">
                <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
                <span class="modal-icon">📊</span>
                <h2>Todos los movimientos</h2>
                ${history.length > 0 ? `
                    <div style="margin-top:16px;">
                        ${history.map(mov => `
                            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;">
                                <div>
                                    <strong>${mov.description || mov.type}</strong>
                                    <div style="font-size:11px;color:#999;">${new Date(mov.date).toLocaleString('es-CU', { hour12: false })}</div>
                                </div>
                                <div style="font-weight:600;color:${mov.type === 'ingreso' ? '#00a859' : '#ff6b35'};">
                                    ${mov.type === 'ingreso' ? '+' : '-'} ${mov.amount} CUP
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <p style="text-align:center;color:#999;padding:20px;">No hay movimientos registrados</p>
                `}
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

function initCredit() {
    console.log('💎 Crédito cargado');
    CreditSystem.updateUI();
    
    const container = document.getElementById('creditContent');
    if (!container) return;
    
    const balance = CreditSystem.getBalance();
    const user = GoogleAuth ? GoogleAuth.getUser() : null;
    const history = CreditSystem.getHistory();
    
    container.innerHTML = `
        ${user ? `
        <div style="display:flex;align-items:center;gap:12px;background:#f5f5f5;border-radius:12px;padding:12px 16px;margin-bottom:16px;">
            <img src="${user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=1a237e&color=fff'}" 
                 style="width:48px;height:48px;border-radius:50%;border:2px solid #1a237e;">
            <div>
                <div style="font-weight:600;color:#1a3a2a;">${user.name}</div>
                <div style="font-size:12px;color:#5a7a6a;">${user.email}</div>
                <div style="font-size:11px;color:#00a859;">✅ Sincronizado con Google</div>
            </div>
            <button onclick="GoogleAuth.signOut()" style="margin-left:auto;padding:4px 12px;background:#ffebee;border:none;border-radius:6px;color:#c62828;cursor:pointer;font-size:12px;">Cerrar</button>
        </div>
        ` : `
        <div style="text-align:center;padding:12px;background:#fff3e0;border-radius:12px;margin-bottom:16px;border:1px dashed #ffcc80;">
            <div style="font-size:24px;margin-bottom:4px;">🔧</div>
            <div style="font-weight:600;color:#e65100;font-size:14px;">Google Auth en desarrollo</div>
            <p style="font-size:12px;color:#5a7a6a;margin:4px 0;">Próximamente disponible</p>
            <button onclick="GoogleAuth.signIn()" style="padding:8px 16px;background:#e8e8e8;color:#888;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">
                🔑 Iniciar sesión con Google
            </button>
            <p style="font-size:11px;color:#8aa89a;margin-top:4px;">Mientras tanto, regístrate con tu número de teléfono</p>
        </div>
        `}
        
        <div style="background:linear-gradient(135deg,#1a237e,#0d47a1);border-radius:16px;padding:20px;color:#fff;margin-bottom:16px;text-align:center;">
            <div style="font-size:14px;opacity:0.8;">💰 Saldo disponible</div>
            <div style="font-size:36px;font-weight:bold;margin:8px 0;" id="creditBalance">${balance} CUP</div>
            <div style="font-size:12px;opacity:0.7;">Última actualización: ${new Date().toLocaleString('es-CU', { hour12: false })}</div>
        </div>
        
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
            <button onclick="AdSystem.showAd()" style="width:100%;padding:14px;background:linear-gradient(135deg,#ff6f00,#ff8f00);color:#fff;border:none;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;">
                📺 Ver anuncio (+10 créditos)
            </button>
            <button onclick="CreditSystem.consultarMovimientos()" style="width:100%;padding:14px;background:#f5f5f5;color:#333;border:1px solid #ddd;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;">
                📊 Ver movimientos
            </button>
        </div>
        
        <div style="background:#f8f9fa;border-radius:12px;padding:16px;">
            <h3 style="margin:0 0 12px 0;font-size:16px;color:#333;">📜 Últimos movimientos</h3>
            ${history.length > 0 ? `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${history.slice(0, 5).map(mov => `
                        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#fff;border-radius:8px;border-left:4px solid ${mov.type === 'ingreso' ? '#00a859' : '#ff6b35'};">
                            <div>
                                <div style="font-weight:500;font-size:14px;">${mov.description || mov.type}</div>
                                <div style="font-size:11px;color:#999;">${new Date(mov.date).toLocaleString('es-CU', { hour12: false })}</div>
                            </div>
                            <div style="font-weight:600;color:${mov.type === 'ingreso' ? '#00a859' : '#ff6b35'};">
                                ${mov.type === 'ingreso' ? '+' : '-'} ${mov.amount} CUP
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <p style="text-align:center;color:#999;padding:12px;">No hay movimientos recientes</p>
            `}
        </div>
    `;
}

window.CreditSystem = CreditSystem;
window.initCredit = initCredit;