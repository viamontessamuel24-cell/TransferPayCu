// js/myiphone.js - Recarga con cupón (CORREGIDO)

const myiPhone = {
    rechargeCupon() {
        // Crear modal con estilos inline para asegurar que se vea bien
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        `;
        overlay.id = 'modalRechargeOverlay';
        
        overlay.innerHTML = `
            <div style="
                background: #fff;
                border-radius: 24px;
                padding: 28px 24px;
                max-width: 380px;
                width: 100%;
                position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <button onclick="myiPhone.cerrarModal()" style="
                    position: absolute;
                    top: 12px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 28px;
                    color: #999;
                    cursor: pointer;
                    line-height: 1;
                ">✕</button>
                
                <div style="font-size: 48px; display: block; margin-bottom: 6px;">🎫</div>
                <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #1a3a2a; margin: 0 0 4px 0;">Recarga con Cupón</h2>
                <p style="font-size: 14px; color: #5a7a6a; margin: 0 0 12px 0;">Ingresa el código de tu tarjeta de recarga</p>
                <p style="font-size: 12px; color: #5a7a6a; text-align: center; margin-bottom: 16px;">Código: <strong style="color:#1a3a2a;">*662*CÓDIGO#</strong></p>
                
                <div style="margin-bottom: 16px; text-align: left;">
                    <label style="display: block; font-size: 13px; font-weight: 600; color: #1a3a2a; margin-bottom: 4px;">🔢 Código del cupón</label>
                    <input type="text" id="inputCuponCode" 
                           placeholder="Ej: 123456789012" 
                           maxlength="20"
                           autocomplete="off"
                           style="
                               width: 100%;
                               padding: 14px;
                               border: 2px solid #e0e0e0;
                               border-radius: 12px;
                               font-size: 18px;
                               text-align: center;
                               letter-spacing: 2px;
                               background: #f8faf8;
                               color: #1a3a2a;
                               outline: none;
                               transition: border-color 0.3s;
                           "
                           onfocus="this.style.borderColor='#00a859'"
                           onblur="this.style.borderColor='#e0e0e0'">
                    <span style="display: block; font-size: 11px; color: #8aa89a; margin-top: 4px;">📌 Ingresa el código sin espacios (generalmente 12 dígitos)</span>
                </div>
                
                <button onclick="myiPhone.ejecutarRecargaCupon()" style="
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #00a859, #00c853);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 4px;
                ">🔄 Recargar</button>
                
                <button onclick="myiPhone.cerrarModal()" style="
                    width: 100%;
                    padding: 12px;
                    background: #f5f5f5;
                    color: #333;
                    border: none;
                    border-radius: 12px;
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 8px;
                ">Cancelar</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Enfocar el input
        setTimeout(() => {
            const input = document.getElementById('inputCuponCode');
            if (input) input.focus();
        }, 300);
    },
    
    cerrarModal() {
        const overlay = document.getElementById('modalRechargeOverlay');
        if (overlay) overlay.remove();
    },
    
    ejecutarRecargaCupon() {
        const input = document.getElementById('inputCuponCode');
        if (!input) {
            app.mostrarToast('❌ Error al obtener el código');
            return;
        }
        
        const codigo = input.value.trim();
        
        if (!codigo) {
            app.mostrarToast('❌ Ingresa el código del cupón');
            input.focus();
            return;
        }
        
        if (codigo.length < 8) {
            app.mostrarToast('❌ El código debe tener al menos 8 dígitos');
            input.focus();
            return;
        }
        
        // Construir y ejecutar el código USSD
        const codigoUssd = `*662*${codigo}#`;
        
        // Cerrar modal
        this.cerrarModal();
        
        // Ejecutar USSD
        app.marcarUssd(codigoUssd);
    }
};

function initMyiPhone() {
    console.log('📱 My iPhone cargado');
}

window.initMyiPhone = initMyiPhone;
window.myiPhone = myiPhone;