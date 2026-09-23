// js/ads.js - Sistema de anuncios Adsterra

const AdSystem = {
    // ===== MOSTRAR ANUNCIO =====
    showAd() {
        // Cargar pop-under de Adsterra
        const script = document.createElement('script');
        script.src = 'https://pl31241208.profitableratecpmnetwork.com/1c/79/90/1c79908bd8039f1584c01afa08509204.js';
        script.async = true;
        document.body.appendChild(script);
        
        // Mostrar modal de espera
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.id = 'modalAdView';
        modal.innerHTML = `
            <div class="modal-box" style="text-align:center;">
                <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
                <span class="modal-icon">📺</span>
                <h2>Viendo anuncio...</h2>
                <p class="modal-sub">Espera 10 segundos para reclamar tus créditos</p>
                <div style="font-size:48px;margin:16px 0;">🔄</div>
                <div id="adTimer" style="font-size:18px;font-weight:bold;color:#1a237e;">
                    ⏱️ <span id="adCountdown">10</span>s
                </div>
                <button id="adClaimBtn" class="modal-btn" disabled style="opacity:0.5;background:#888;margin-top:12px;">
                    ⏳ Espera...
                </button>
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Temporizador
        let seconds = 10;
        const countdownEl = document.getElementById('adCountdown');
        const claimBtn = document.getElementById('adClaimBtn');
        
        const timer = setInterval(() => {
            seconds--;
            if (countdownEl) countdownEl.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(timer);
                if (claimBtn) {
                    claimBtn.disabled = false;
                    claimBtn.style.opacity = '1';
                    claimBtn.style.background = 'linear-gradient(135deg, #00a859, #00c853)';
                    claimBtn.textContent = '💰 Reclamar 10 créditos';
                    claimBtn.onclick = () => {
                        if (window.CreditSystem) {
                            CreditSystem.add(10);
                            CreditSystem.addTransaction('ingreso', 10, '📺 Anuncio visto');
                            app.mostrarToast('🎉 ¡Ganaste 10 créditos!');
                            app.updateCreditUI();
                            if (app.currentPage === 'credit') {
                                initCredit();
                            }
                        }
                        modal.remove();
                    };
                }
            }
        }, 1000);
    }
};

window.AdSystem = AdSystem;