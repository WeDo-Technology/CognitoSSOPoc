import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('relay')).render(<div>Example POC Identity Relay</div>);

const isInIframe = window.self !== window.top;
const settings = {
    allowedOrigins: [
        'https://white-bush-0b5c14a1e-preview.westus2.4.azurestaticapps.net',
        'https://brave-rock-03757401e-preview.westus2.4.azurestaticapps.net',
        'https://agreeable-rock-0d2ded81e-preview.westus2.4.azurestaticapps.net',
        'https://witty-rock-0b731271e-preview.westus2.4.azurestaticapps.net'
    ],
    allowedOrigin: '*',
    cognitoLocalStorageKey: 'CognitoIdentityServiceProvider',
}

if (isInIframe) {
    console.log('RELAY IN IFRAME');
    window.onmessage = function (e) {
        console.log('FROM RELAY', e);
        if (!settings.allowedOrigins.includes(e.origin)) {
            return;
        }

        if (e.data.type === 'REQUEST_USER_INFO') {
            const localStorageArray = Object.entries(localStorage);
            const payload = Object.fromEntries(localStorageArray.filter((item) => item[0].startsWith(settings.cognitoLocalStorageKey)));
            window.parent.postMessage({type: 'USER_INFO', payload: payload}, settings.allowedOrigin);
        }

        if (e.data.type === 'SET_USER_INFO') {
            const payload = e.data.payload;
            Object.entries(payload).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            localStorage.setItem('IdentityRelay.LastUpdatedBy', e.origin);
            localStorage.setItem('IdentityRelay.LastUpdated', new Date().toISOString());
        }

        if (e.data.type === 'SEND_LOGOUT') {
            localStorage.clear();
            window.parent.postMessage({type: 'USER_LOGOUT'}, settings.allowedOrigin);
        }

        console.log('Message received from', e.origin, e.data);
    };

    window.onstorage = function (e) {
        if (e.key?.startsWith(settings.cognitoLocalStorageKey)) {
            window.parent.postMessage({type: 'USER_INFO', payload: {[e.key]: e.newValue}}, settings.allowedOrigin);
        }
    };

    setInterval(() => {
        const localStorageArray = Object.entries(localStorage);
        const relatedEntries = localStorageArray.filter((item) => item[0].startsWith(settings.cognitoLocalStorageKey));

        if (relatedEntries.length > 0) {
            const payload = Object.fromEntries(relatedEntries);
            window.parent.postMessage({type: 'USER_INFO', payload: payload}, settings.allowedOrigin);
        } else {
            window.parent.postMessage({type: 'USER_LOGOUT'}, settings.allowedOrigin);
        }
    }, 5000);
}



