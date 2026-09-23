// js/app.js - VERSIÓN FINAL con PIN en Panel Dev
const app = {
    currentPage: 'home',
    user: null,
    credit: 0,
    sesionActiva: false,
    bancoActual: 'bpa',
    bancoAutenticado: null,
    historial: [],
    
    navigateTo(page, params = {}) {
        this.currentPage = page;
        const container = document.getElementById('appContainer');
        const backBtn = document.getElementById('backBtn');
        
        const noBackPages = ['home', 'credit'];
        if (noBackPages.includes(page)) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'inline-flex';
        }
        
        const titles = {
            home: 'TransferPay',
            bpa: 'BPA',
            bandec: 'BANDEC',
            banmet: 'BANMET',
            myiphone: '📱 My iPhone',
            credit: '💎 Crédito',
            'panel-dev': '🧪 Panel Dev'
        };
        document.getElementById('headerTitle').textContent = titles[page] || 'TransferPay';
        
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                container.innerHTML = html;
                this.initPage(page, params);
            })
            .catch(() => {
                container.innerHTML = `
                    <div style="text-align:center;padding:40px 20px;color:#8aa89a;">
                        <div style="font-size:48px;">🔌</div>
                        <p>Error al cargar la página</p>
                        <button onclick="app.navigateTo('home')" style="margin-top:16px;padding:10px 24px;background:#00a859;color:#fff;border:none;border-radius:12px;font-size:16px;cursor:pointer;">Ir a Inicio</button>
                    </div>
                `;
            });
    },
    
    initPage(page, params) {
        switch(page) {
            case 'home': if (window.initHome) initHome(); break;
            case 'bpa': if (window.initBPA) initBPA(params); break;
            case 'bandec': if (window.initBANDEC) initBANDEC(params); break;
            case 'banmet': if (window.initBANMET) initBANMET(params); break;
            case 'myiphone': if (window.initMyiPhone) initMyiPhone(); break;
            case 'credit': if (window.initCredit) initCredit(); break;
            case 'panel-dev': break;
        }
        this.updateCreditUI();
    },
    
    volver() {
        this.navigateTo('home');
    },
    
    toggleSesion() {
        if (this.sesionActiva) {
            if (confirm('¿Deseas cerrar la sesión?')) {
                this.setSesion(false);
                this.bancoAutenticado = null;
                this.mostrarToast('🔒 Sesión desactivada');
            }
        } else {
            this.mostrarToast('🔐 Toca "Autenticarse" para activar la sesión');
        }
    },
    
    setSesion(activa) {
        this.sesionActiva = activa;
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        const btn = document.getElementById('btnDisconnect');
        dot.className = `status-dot ${activa ? 'active' : 'inactive'}`;
        const nombre = activa && this.bancoAutenticado ? this.getNombreBanco(this.bancoAutenticado) : '';
        text.textContent = activa ? `Sesión activa (${nombre})` : 'Sesión inactiva';
        btn.style.display = activa ? 'block' : 'none';
        if (this.currentPage === 'bpa' || this.currentPage === 'bandec' || this.currentPage === 'banmet') {
            this.initPage(this.currentPage, {});
        }
    },
    
    autenticar(banco) {
        const codigoBanco = this.getCodigoBanco(banco);
        const nombreBanco = this.getNombreBanco(banco);
        const codigo = `*444*40*${codigoBanco}#`;
        this.marcarUssd(codigo);
        this.bancoAutenticado = banco;
        this.setSesion(true);
        this.mostrarToast(`✅ Sesión activa para ${nombreBanco}`);
        this.guardarHistorial(`Autenticación ${nombreBanco}`);
    },
    
    desconectar() {
        this.marcarUssd('*444*70#');
        this.setSesion(false);
        this.bancoAutenticado = null;
        this.mostrarToast('🔒 Sesión cerrada');
        this.guardarHistorial('Desconectar');
    },
    
    getCodigoBanco(banco) {
        const codigos = { bpa: '01', bandec: '02', banmet: '03' };
        return codigos[banco] || '01';
    },
    
    getNombreBanco(banco) {
        const nombres = { bpa: 'BPA', bandec: 'BANDEC', banmet: 'BANMET' };
        return nombres[banco] || 'BPA';
    },
    
    marcarUssd(codigo) {
        if (!codigo) return;
        this.guardarHistorial(codigo);
        const limpio = codigo.replace(/\*/g, '%2A').replace(/#/g, '%23');
        const url = `tel://${limpio}`;
        const link = document.createElement('a');
        link.href = url;
        link.click();
        this.mostrarToast(`📞 Ejecutando`, codigo);
    },
    
    marcarNumero(numero) {
        const url = `tel://${numero}`;
        const link = document.createElement('a');
        link.href = url;
        link.click();
        this.mostrarToast(`📞 Llamando a ${numero}`);
    },
    
    updateCreditUI() {
        const el = document.getElementById('headerCredit');
        if (el) {
            const credit = CreditSystem ? CreditSystem.getBalance() : 0;
            el.textContent = `💎 ${credit}`;
        }
    },
    
    mostrarToast(mensaje, codigo) {
        const toast = document.getElementById('toast');
        let html = mensaje;
        if (codigo) {
            html += `<span class="toast-code">${codigo}</span>`;
        }
        toast.innerHTML = html;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
    },
    
    toggleFab() {
        document.getElementById('fabMenu').classList.toggle('show');
    },
    
    guardarHistorial(texto) {
        const fecha = new Date().toLocaleString('es-CU', { hour12: false });
        this.historial.unshift(`${fecha} - ${texto}`);
        if (this.historial.length > 20) this.historial.pop();
        localStorage.setItem('transferpay_historial', JSON.stringify(this.historial));
    },
    
    // ===== PANEL DEV =====
    abrirPanelDev() {
        const pin = prompt('🔐 Ingresa el PIN de acceso:');
        if (pin !== '3456') {
            app.mostrarToast('❌ PIN incorrecto');
            return;
        }
        this.navigateTo('panel-dev');
    },
    
// ===== ABRIR ENZONA =====
abrirEnzona() {
    // URL de login oficial de Enzona
    const url = 'https://identity.enzona.net/authenticationendpoint/login.do?client_id=ofr3Wz9nnfZaFd18OewdZYvuTaEa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.enzona.net%2Fauth%2Fenzona%2Fcallback&response_type=code&scope=openid&state=uKl19YlFlkbXhsU3bpyP9YBxu4wD5cNyVCKaIIMm&tenantDomain=carbon.super&sessionDataKey=b58118b4-99fc-4307-a9c4-fd21d98d88d1&relyingParty=ofr3Wz9nnfZaFd18OewdZYvuTaEa&type=oidc&sp=admin_ppago-apk_PRODUCTION&isSaaSApp=false&authenticators=IdentifierExecutor:LOCAL';
    
    // Confirmar antes de abrir
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'modalEnzona';
    modal.innerHTML = `
        <div class="modal-box" style="text-align:center;">
            <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
            <span class="modal-icon">💳</span>
            <h2>Enzona</h2>
            <p class="modal-sub">Plataforma de pagos y transferencias electrónicas</p>
            
            <div style="background:#e3f2fd;border-radius:12px;padding:16px;margin:12px 0;">
                <div style="font-size:48px;">🌐</div>
                <p style="color:#5a7a6a;font-size:14px;">Se abrirá la página oficial de Enzona en tu navegador</p>
            </div>
            
            <button class="modal-btn" onclick="app.abrirEnzonaConfirmado()" style="background:linear-gradient(135deg,#0099cc,#00b4d8);">
                🌐 Abrir Enzona
            </button>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
},

abrirEnzonaConfirmado() {
    const url = 'https://identity.enzona.net/authenticationendpoint/login.do?client_id=ofr3Wz9nnfZaFd18OewdZYvuTaEa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.enzona.net%2Fauth%2Fenzona%2Fcallback&response_type=code&scope=openid&state=uKl19YlFlkbXhsU3bpyP9YBxu4wD5cNyVCKaIIMm&tenantDomain=carbon.super&sessionDataKey=b58118b4-99fc-4307-a9c4-fd21d98d88d1&relyingParty=ofr3Wz9nnfZaFd18OewdZYvuTaEa&type=oidc&sp=admin_ppago-apk_PRODUCTION&isSaaSApp=false&authenticators=IdentifierExecutor:LOCAL';
    
    window.open(url, '_blank');
    document.getElementById('modalEnzona')?.remove();
    app.mostrarToast('🌐 Abriendo Enzona...');
},

// ===== DONACIÓN: SELECCIÓN DE BANCO =====
abrirDonacionSeleccionBanco() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'modalDonacionBanco';
    modal.innerHTML = `
        <div class="modal-box" style="text-align:center;">
            <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
            <span class="modal-icon">🔐</span>
            <h2>Autenticarse</h2>
            <p class="modal-sub">Selecciona tu banco para continuar con la donación</p>
            
            <div style="display:flex;flex-direction:column;gap:10px;margin:16px 0;">
                <button onclick="app.donacionAutenticar('bpa')" style="padding:14px;background:#1a237e;color:#fff;border:none;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;">
                    🏦 Autenticar con BPA
                </button>
                <button onclick="app.donacionAutenticar('bandec')" style="padding:14px;background:#2e7d32;color:#fff;border:none;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;">
                    🏦 Autenticar con BANDEC
                </button>
                <button onclick="app.donacionAutenticar('banmet')" style="padding:14px;background:#e65100;color:#fff;border:none;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;">
                    🏦 Autenticar con BANMET
                </button>
            </div>
            
            <button class="modal-btn" onclick="app.donacionYaAutenticado()" style="background:linear-gradient(135deg,#00a859,#00c853);">
                ✅ Ya estoy autenticado
            </button>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
},

// ===== DONACIÓN: AUTENTICAR EN BANCO =====
donacionAutenticar(banco) {
    const codigoBanco = this.getCodigoBanco(banco);
    const nombreBanco = this.getNombreBanco(banco);
    const codigo = `*444*40*${codigoBanco}#`;
    
    // Ejecutar el código USSD de autenticación
    this.marcarUssd(codigo);
    
    // Activar la sesión del banco
    this.bancoAutenticado = banco;
    this.setSesion(true);
    this.guardarHistorial(`Autenticación donación ${nombreBanco}`);
    
    // Mostrar mensaje
    this.mostrarToast(`✅ Sesión activa en ${nombreBanco}`);
    
    // NO cerrar el modal automáticamente
    // El usuario debe tocar "Ya estoy autenticado"
},

// ===== DONACIÓN: YA ESTOY AUTENTICADO =====
donacionYaAutenticado() {
    // Verificar que haya un banco autenticado
    if (!this.bancoAutenticado) {
        this.mostrarToast('❌ Primero debes autenticarte en un banco');
        return;
    }
    document.getElementById('modalDonacionBanco')?.remove();
    this.abrirDonacionTransferencia();
},

// ===== DONACIÓN: PANTALLA DE TRANSFERENCIA =====
abrirDonacionTransferencia() {
    const tarjeta = '9205129974200942';
    const telefono = '52985279'; // ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO
    const nombreBanco = this.getNombreBanco(this.bancoAutenticado);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'modalDonacionTransfer';
    modal.innerHTML = `
        <div class="modal-box" style="text-align:center;">
            <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
            <span class="modal-icon">💳</span>
            <h2>Donar</h2>
            <p class="modal-sub">Banco: ${nombreBanco}</p>
            
            <div style="background:#e8f5ee;border-radius:12px;padding:14px;margin:12px 0;text-align:left;">
                <div style="font-size:12px;color:#5a7a6a;margin-bottom:4px;">💳 Tarjeta destino</div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex:1;font-weight:600;font-size:13px;color:#1a3a2a;word-break:break-all;">${tarjeta}</div>
                    <button onclick="app.donacionCopiar('${tarjeta}')" style="padding:6px 10px;background:#00a859;color:#fff;border:none;border-radius:8px;font-size:11px;cursor:pointer;">📋 Copiar</button>
                </div>
            </div>
            
            <div style="background:#e8f5ee;border-radius:12px;padding:14px;margin:12px 0;text-align:left;">
                <div style="font-size:12px;color:#5a7a6a;margin-bottom:4px;">📱 Teléfono</div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex:1;font-weight:600;font-size:14px;color:#1a3a2a;">${telefono}</div>
                    <button onclick="app.donacionCopiar('${telefono}')" style="padding:6px 10px;background:#00a859;color:#fff;border:none;border-radius:8px;font-size:11px;cursor:pointer;">📋 Copiar</button>
                </div>
            </div>
            
            <div style="background:#fff3e0;border-radius:10px;padding:10px;margin:12px 0;border:1px solid #ffcc80;">
                <p style="font-size:12px;color:#e65100;margin:0;font-weight:500;">
                    ❤️ Cualquier cantidad monetaria será de gran ayuda, gracias.
                </p>
            </div>
            
            <button class="modal-btn" onclick="app.donacionEjecutar()" style="background:linear-gradient(135deg,#c62828,#d32f2f);">
                ❤️ Donar
            </button>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
},

// ===== DONACIÓN: COPIAR DATO =====
donacionCopiar(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => this.mostrarToast('📋 Copiado al portapapeles'))
        .catch(() => this.mostrarToast('📋 Copia manual: ' + texto));
},

// ===== DONACIÓN: EJECUTAR TRANSFERENCIA (código simple del banco) =====
donacionEjecutar() {
    const banco = this.bancoAutenticado || 'bpa';
    const codigoBanco = this.getCodigoBanco(banco);
    
    // Código simple de transferencia del banco seleccionado
    const codigo = `*444*45*${codigoBanco}#`;
    
    this.marcarUssd(codigo);
    
    // Cerrar modal de transferencia y mostrar agradecimiento
    document.getElementById('modalDonacionTransfer')?.remove();
    this.mostrarDonacionGracias();
},
    // ===== PANEL: GIRO POSTAL =====
    abrirPanelGiroPostal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.id = 'modalPanelGiro';
        modal.innerHTML = `
            <div class="modal-box">
                <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
                <span class="modal-icon">📮</span>
                <h2>Giro Postal</h2>
                <p class="modal-sub">Ingresa los datos del giro</p>
                
                <div class="form-group">
                    <label>🆔 CI Origen</label>
                    <input type="text" class="input-field" id="inputGiroCIOrigen" placeholder="Ej: 92051299742" maxlength="11">
                </div>
                <div class="form-group">
                    <label>🆔 CI Destino</label>
                    <input type="text" class="input-field" id="inputGiroCIDestino" placeholder="Ej: 93012345678" maxlength="11">
                </div>
                <div class="form-group">
                    <label>💰 Importe (CUP)</label>
                    <input type="number" class="input-field" id="inputGiroMonto" placeholder="Ej: 100.00" step="0.01">
                </div>
                <div class="form-group">
                    <label>💱 Moneda</label>
                    <select class="input-field" id="inputGiroMoneda">
                        <option value="CUP">CUP</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>📝 Motivo</label>
                    <input type="text" class="input-field" id="inputGiroMotivo" placeholder="Ej: Ayuda familiar">
                </div>
                <div class="form-group">
                    <label>📱 Teléfono Destino</label>
                    <input type="tel" class="input-field" id="inputGiroTelefono" placeholder="Ej: 52985279" maxlength="8">
                </div>
                <div class="form-group">
                    <label>📌 Versión</label>
                    <input type="text" class="input-field" id="inputGiroVersion" placeholder="Ej: 001" maxlength="5" value="001">
                </div>
                
                <button class="modal-btn" onclick="app.ejecutarGiroPostal()">📮 Enviar Giro</button>
                <button class="modal-close-btn" onclick="app.ejecutarGiroPostalSimple()" style="background:#fff3e0;color:#e65100;border:1px solid #ffcc80;">
                    ⚡ Modo seguro (ejecutar USSD simple)
                </button>
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('inputGiroCIOrigen')?.focus(), 300);
    },

    ejecutarGiroPostal() {
        const ciOrigen = document.getElementById('inputGiroCIOrigen').value.trim();
        const ciDestino = document.getElementById('inputGiroCIDestino').value.trim();
        const monto = document.getElementById('inputGiroMonto').value.trim();
        const moneda = document.getElementById('inputGiroMoneda').value;
        const motivo = document.getElementById('inputGiroMotivo').value.trim() || 'Sin motivo';
        const telefono = document.getElementById('inputGiroTelefono').value.trim();
        const version = document.getElementById('inputGiroVersion').value.trim() || '001';
        
        if (!ciOrigen || !ciDestino || !monto) {
            app.mostrarToast('❌ CI Origen, CI Destino y Monto son obligatorios');
            return;
        }
        
        if (ciOrigen.length < 8 || ciDestino.length < 8) {
            app.mostrarToast('❌ Los CI deben tener al menos 8 dígitos');
            return;
        }
        
        if (parseFloat(monto) <= 0) {
            app.mostrarToast('❌ El monto debe ser mayor a 0');
            return;
        }
        
        const codigo = `*444*64*${ciOrigen}*${ciDestino}*${monto}*${moneda}*${motivo}*${telefono}*${version}#`;
        document.getElementById('modalPanelGiro')?.remove();
        app.marcarUssd(codigo);
    },
    
    ejecutarGiroPostalSimple() {
        document.getElementById('modalPanelGiro')?.remove();
        app.marcarUssd('*444*64#');
    },
    
    // ===== PANEL: CONSULTA ONAT (BANDEC) =====
    abrirPanelONAT() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.id = 'modalPanelONAT';
        modal.innerHTML = `
            <div class="modal-box">
                <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
                <span class="modal-icon">📋</span>
                <h2>Consulta ONAT</h2>
                <p class="modal-sub">BANDEC - Ingresa tu número de RC05</p>
                
                <div class="form-group">
                    <label>🔢 Número de RC05</label>
                    <input type="text" class="input-field" id="inputRC05" placeholder="Ej: 1234567890" maxlength="10">
                    <span class="field-hint">📌 Código de tu cuenta en BANDEC</span>
                </div>
                
                <button class="modal-btn" onclick="app.ejecutarONAT()">🔍 Consultar</button>
                <button class="modal-close-btn" onclick="app.ejecutarONATSimple()" style="background:#fff3e0;color:#e65100;border:1px solid #ffcc80;">
                    ⚡ Modo seguro (ejecutar USSD simple)
                </button>
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('inputRC05')?.focus(), 300);
    },

    ejecutarONAT() {
        const rc05 = document.getElementById('inputRC05').value.trim();
        if (!rc05) {
            app.mostrarToast('❌ Ingresa el número de RC05');
            return;
        }
        if (rc05.length < 4) {
            app.mostrarToast('❌ El RC05 debe tener al menos 4 dígitos');
            return;
        }
        const codigo = `*444*56*${rc05}#`;
        document.getElementById('modalPanelONAT')?.remove();
        app.marcarUssd(codigo);
    },
    
    ejecutarONATSimple() {
        document.getElementById('modalPanelONAT')?.remove();
        app.marcarUssd('*444*56#');
    },
    
    // ===== PANEL: CONSULTA GIRO POSTAL =====
    abrirPanelConsultaGiro(banco) {
        const versiones = { bpa: '01', bandec: '02', banmet: '03' };
        const version = versiones[banco] || '01';
        const nombreBanco = this.getNombreBanco(banco);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.id = 'modalPanelConsultaGiro';
        modal.innerHTML = `
            <div class="modal-box">
                <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
                <span class="modal-icon">🔍</span>
                <h2>Consulta Giro Postal</h2>
                <p class="modal-sub">${nombreBanco} - Ingresa el CI para consultar el giro</p>
                
                <div style="background:#e8f5ee;border-radius:8px;padding:8px 12px;margin-bottom:12px;text-align:center;font-size:12px;color:#3a6b55;">
                    📌 Versión automática: <strong>${version}</strong> (${nombreBanco})
                </div>
                
                <div class="form-group">
                    <label>🆔 CI</label>
                    <input type="text" class="input-field" id="inputConsultaGiroCI" placeholder="Ej: 92051299742" maxlength="11">
                    <span class="field-hint">📌 CI del remitente o destinatario</span>
                </div>
                
                <button class="modal-btn" onclick="app.ejecutarConsultaGiro('${banco}')">🔍 Consultar</button>
                <button class="modal-close-btn" onclick="app.ejecutarConsultaGiroSimple('${banco}')" style="background:#fff3e0;color:#e65100;border:1px solid #ffcc80;">
                    ⚡ Modo seguro (ejecutar USSD simple)
                </button>
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('inputConsultaGiroCI')?.focus(), 300);
    },

    ejecutarConsultaGiro(banco) {
        const versiones = { bpa: '01', bandec: '02', banmet: '03' };
        const version = versiones[banco] || '01';
        const ci = document.getElementById('inputConsultaGiroCI').value.trim();
        
        if (!ci) {
            app.mostrarToast('❌ Ingresa el CI');
            return;
        }
        
        if (ci.length < 8) {
            app.mostrarToast('❌ El CI debe tener al menos 8 dígitos');
            return;
        }
        
        const codigo = `*444*64*${ci}*${version}#`;
        document.getElementById('modalPanelConsultaGiro')?.remove();
        app.marcarUssd(codigo);
    },

    ejecutarConsultaGiroSimple(banco) {
        const versiones = { bpa: '01', bandec: '02', banmet: '03' };
        const version = versiones[banco] || '01';
        document.getElementById('modalPanelConsultaGiro')?.remove();
        
        const codigo = `*444*64*${version}#`;
        app.marcarUssd(codigo);
    },
    
// ===== PANEL: REGISTRARSE =====
abrirPanelRegistro(banco) {
    const nombreBanco = this.getNombreBanco(banco);
    const codigoBanco = this.getCodigoBanco(banco);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'modalPanelRegistro';
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
            <span class="modal-icon">📝</span>
            <h2>Registrarse</h2>
            <p class="modal-sub">${nombreBanco} - Ingresa tu número de tarjeta</p>
            
            <div style="background:#e8f5ee;border-radius:8px;padding:8px 12px;margin-bottom:12px;text-align:center;font-size:12px;color:#3a6b55;">
                📌 Código del banco: <strong>${codigoBanco}</strong> (${nombreBanco})
            </div>
            
            <div class="form-group">
                <label>💳 Número de tarjeta</label>
                <input type="text" class="input-field" id="inputRegistroTarjeta" placeholder="Ej: 9205129974200942" maxlength="16">
                <span class="field-hint">📌 Número de tarjeta de 16 dígitos</span>
            </div>
            
            <button class="modal-btn" onclick="app.ejecutarRegistro('${banco}')">📝 Registrarse</button>
            <button class="modal-close-btn" onclick="app.ejecutarRegistroSimple('${banco}')" style="background:#fff3e0;color:#e65100;border:1px solid #ffcc80;">
                ⚡ Modo seguro (ejecutar USSD simple)
            </button>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('inputRegistroTarjeta')?.focus(), 300);
},

ejecutarRegistro(banco) {
    const codigoBanco = this.getCodigoBanco(banco);
    const tarjeta = document.getElementById('inputRegistroTarjeta').value.trim();
    
    if (!tarjeta) {
        app.mostrarToast('❌ Ingresa el número de tarjeta');
        return;
    }
    
    if (tarjeta.length < 8) {
        app.mostrarToast('❌ El número de tarjeta debe tener al menos 8 dígitos');
        return;
    }
    
    const ussd = `*444*49*${codigoBanco}*${tarjeta}#`;
    
    document.getElementById('modalPanelRegistro')?.remove();
    app.marcarUssd(ussd);
},

ejecutarRegistroSimple(banco) {
    const codigoBanco = this.getCodigoBanco(banco);
    document.getElementById('modalPanelRegistro')?.remove();
    app.marcarUssd(`*444*49*${codigoBanco}#`);
},

    // ===== POPUP DONACIÓN (SIEMPRE APARECE) =====
    cargarPopupDonacion() {
        // Siempre muestra el popup al abrir la app (sin límite diario)
        setTimeout(() => {
            fetch('pages/popup-donacion.html')
                .then(response => response.text())
                .then(html => {
                    const div = document.createElement('div');
                    div.innerHTML = html;
                    document.body.appendChild(div.firstElementChild);
                    
                    setTimeout(() => {
                        const popup = document.getElementById('popupDonacion');
                        if (popup) popup.classList.add('show');
                    }, 3000);
                })
                .catch(() => {});
        }, 1000);
    },

    cerrarPopupDonacion() {
        const popup = document.getElementById('popupDonacion');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
                // Después de cerrar el popup de donación, mostrar el de novedades
                this.cargarPopupNovedades();
            }, 500);
        }
    },

    // ===== POPUP NOVEDADES V3.5 =====
    cargarPopupNovedades() {
        // Verificar si ya se mostró la versión 3.5
        const versionMostrada = localStorage.getItem('transferpay_novedades_v3.5');
        if (versionMostrada === 'true') return;
        
        setTimeout(() => {
            const modal = document.createElement('div');
            modal.className = 'popup-overlay show';
            modal.id = 'popupNovedades';
            modal.style.display = 'flex';
            modal.innerHTML = `
                <div class="popup-box" style="max-width:400px;text-align:center;position:relative;">
                    <button class="popup-close" onclick="app.cerrarPopupNovedades()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:28px;color:#999;cursor:pointer;">✕</button>
                    
                    <div style="font-size:48px;margin-bottom:6px;">🎉</div>
                    <h2 style="font-family:'Playfair Display',serif;font-size:22px;color:#1a3a2a;margin:0 0 4px 0;">¡Nueva Actualización!</h2>
                    <p style="font-size:14px;color:#5a7a6a;margin:0 0 12px 0;">TransferPay <strong>v3.5</strong></p>
                    
                    <div style="background:#e8f5ee;border-radius:12px;padding:16px;margin:12px 0;text-align:left;">
                        <div style="font-weight:600;color:#1a3a2a;margin-bottom:8px;">📋 Novedades:</div>
                        <ul style="list-style:none;padding:0;margin:0;text-align:left;font-size:13px;color:#3a6b55;line-height:1.8;">
                            <li>✅ <strong>Recarga con cupón</strong> (My iPhone)</li>
                            <li>✅ <strong>Giro Postal</strong> con panel inteligente</li>
                            <li>✅ <strong>Consulta ONAT</strong> con RC05 (BANDEC)</li>
                            <li>✅ <strong>Consulta Giro Postal</strong> con versión automática</li>
                            <li>✅ <strong>Modo seguro</strong> en todas las operaciones con panel</li>
                            <li>✅ <strong>Modo oscuro</strong> automático según el sistema</li>
                        </ul>
                    </div>
                    
                    <div style="background:#fff3e0;border-radius:12px;padding:12px;margin:12px 0;text-align:center;border:1px solid #ffcc80;">
                        <div style="font-weight:600;color:#e65100;font-size:14px;">📱 ¡Síguenos en WhatsApp!</div>
                        <p style="font-size:12px;color:#5a7a6a;margin:4px 0 8px;">Entérate de todas las novedades y mejoras</p>
                        <a href="https://whatsapp.com/channel/0029Vb3X5q9X5q9X5q9X5q9X" target="_blank" style="display:inline-block;padding:10px 24px;background:#25D366;color:#fff;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">
                            📲 Unirse al canal
                        </a>
                    </div>
                    
                    <button class="popup-btn" onclick="app.cerrarPopupNovedades()" style="width:100%;padding:14px;background:linear-gradient(135deg,#00a859,#00c853);color:#fff;border:none;border-radius:12px;font-weight:600;font-size:16px;cursor:pointer;margin-top:8px;">
                        ✅ Entendido
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        }, 1000);
    },

    cerrarPopupNovedades() {
        const popup = document.getElementById('popupNovedades');
        if (popup) {
            popup.classList.remove('show');
            popup.style.display = 'none';
            localStorage.setItem('transferpay_novedades_v3.5', 'true');
            setTimeout(() => {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
            }, 300);
        }
    },
    
    // ===== INICIALIZACIÓN =====
    init() {
        const savedHistorial = localStorage.getItem('transferpay_historial');
        if (savedHistorial) {
            this.historial = JSON.parse(savedHistorial);
        }
        
        this.credit = CreditSystem ? CreditSystem.getBalance() : 0;
        this.updateCreditUI();
        
        if (window.AuthSystem) {
            const user = AuthSystem.getUser();
            if (user) {
                this.user = user;
                document.getElementById('headerUser').textContent = `👤 ${user.name || 'Usuario'}`;
            }
        }
        
        this.navigateTo('home');
        
        document.addEventListener('click', (e) => {
            const fab = document.querySelector('.fab-container');
            if (fab && !fab.contains(e.target)) {
                document.getElementById('fabMenu').classList.remove('show');
            }
        });
        
        this.cargarPopupDonacion();
        
        console.log('🚀 TransferPay v4.3 cargado');
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());