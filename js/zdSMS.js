// js/zdsms.js - Integración con zdSMS
// Reemplaza el token en la línea 4 con el tuyo

const zdSMS = {
    // ⚠️ AQUÍ VA TU TOKEN (reemplaza el texto entre comillas)
    apiKey: '14280|Yy80teKQhYAN2moSMmwPBDrYas12j',
    
    apiUrl: 'https://api.zdsms.com/send',
    isConfigured: false,
    
    // ===== CONFIGURAR TOKEN =====
    configure(apiKey) {
        this.apiKey = apiKey;
        this.isConfigured = true;
        localStorage.setItem('zdSMS_apiKey', apiKey);
        app.mostrarToast('✅ zdSMS configurado');
    },
    
    // ===== VERIFICAR SI ESTÁ CONFIGURADO =====
    checkConfig() {
        const savedKey = localStorage.getItem('zdSMS_apiKey');
        if (savedKey && savedKey.length > 5) {
            this.apiKey = savedKey;
            this.isConfigured = true;
        }
        return this.isConfigured;
    },
    
    // ===== ENVIAR SMS =====
    sendSMS(phone, message, callback) {
        // Verificar crédito
        if (!CreditSystem.hasEnough(1)) {
            app.mostrarToast('❌ Crédito insuficiente');
            if (callback) callback(false);
            return;
        }
        
        // Limpiar número de teléfono
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 8) {
            app.mostrarToast('❌ Número inválido');
            if (callback) callback(false);
            return;
        }
        
        // Formatear número (agregar 53 si es necesario)
        let fullPhone = cleanPhone;
        if (cleanPhone.length === 8) {
            fullPhone = '53' + cleanPhone;
        } else if (cleanPhone.length === 10 && cleanPhone.startsWith('5')) {
            fullPhone = '53' + cleanPhone;
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith('53')) {
            fullPhone = cleanPhone;
        }
        
        // Verificar configuración
        if (!this.isConfigured || !this.apiKey || this.apiKey === 'PEGA_TU_TOKEN_AQUI') {
            app.mostrarToast('⚠️ zdSMS no configurado - Configúralo en Panel Dev');
            if (callback) callback(false);
            return;
        }
        
        // Enviar SMS
        const data = {
            api_key: this.apiKey,
            phone: fullPhone,
            message: message
        };
        
        fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success || result.status === 'ok') {
                CreditSystem.use(1);
                CreditSystem.addTransaction('use', 1, 'SMS a ' + fullPhone);
                app.updateCreditUI();
                app.mostrarToast('📤 SMS enviado a ' + fullPhone);
                if (callback) callback(true);
            } else {
                app.mostrarToast('❌ Error: ' + (result.message || 'Error desconocido'));
                if (callback) callback(false);
            }
        })
        .catch(error => {
            app.mostrarToast('❌ Error de conexión');
            console.error('Error zdSMS:', error);
            if (callback) callback(false);
        });
    },
    
    // ===== CONFIGURAR CON PROMPT (desde Panel Dev) =====
    configurarConPrompt() {
        const token = prompt('🔑 Ingresa tu token de zdSMS:');
        if (token && token.trim()) {
            this.configure(token.trim());
        } else {
            app.mostrarToast('❌ Token no válido');
        }
    }
};

// ===== CARGAR TOKEN GUARDADO AL INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('zdSMS_apiKey');
    if (savedKey && savedKey.length > 5) {
        zdSMS.apiKey = savedKey;
        zdSMS.isConfigured = true;
        console.log('✅ zdSMS cargado desde localStorage');
    } else {
        console.log('⚠️ zdSMS sin configurar');
    }
});

window.zdSMS = zdSMS;