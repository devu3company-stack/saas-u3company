// metaPixel.js
// Utilitário para rastreamento de eventos no Meta (Facebook Pixel + API de Conversões)

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const initMetaPixel = () => {
    if (!PIXEL_ID) return;

    if (window.fbq) return;

    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');

    // Inicializa o Pixel
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
};

export const trackMetaEvent = async (eventName, eventData = {}, eventId = null) => {
    if (!PIXEL_ID) return;

    // Gera um ID único para deduplicação entre o Pixel e a CAPI se não for fornecido
    const uniqueEventId = eventId || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Dispara o evento Frontend (Browser Pixel)
    if (window.fbq) {
        window.fbq('track', eventName, eventData, { eventID: uniqueEventId });
    }

    // 2. Dispara o evento Backend (Conversions API - CAPI)
    try {
        await fetch(`${BACKEND_URL}/api/meta/capi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventName,
                eventData,
                eventId: uniqueEventId,
                sourceUrl: window.location.href,
                userAgent: navigator.userAgent,
                // Opcional: Pegar do cookie do FB se existir (_fbp, _fbc)
                fbp: getCookie('_fbp'),
                fbc: getCookie('_fbc')
            })
        });
    } catch (error) {
        console.error("Erro ao enviar evento CAPI:", error);
    }
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};
