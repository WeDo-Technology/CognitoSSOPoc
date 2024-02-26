
export const IdentityRelaySettings = {
    serverUrl: 'https://witty-rock-0b731271e-preview.westus2.4.azurestaticapps.net',
    cognitoLocalStorageKey: 'CognitoIdentityServiceProvider',
    cognitoConfig: {
        UserPoolId: "eu-central-1_B9XKAgL1z",
        ClientId: "192hqg48rei2v8q8ihl6irq9a1",
    },
};

const body = document.getElementsByTagName("body")[0];
const iframe = document.createElement("iframe");
iframe.style.display = "none";
iframe.src = IdentityRelaySettings.serverUrl;
iframe.id = "identity-relay";
body.append(iframe);

window.lastSentPayload = '';

iframe.onload = () => {
    const win = iframe.contentWindow;
    const postMsg = { type: "REQUEST_USER_INFO" };
    win.postMessage(postMsg, IdentityRelaySettings.serverUrl);

    setInterval(() => {
        const relatedEntries = getRelatedEntries();

        if (relatedEntries.length > 0) {
            const payload = Object.fromEntries(relatedEntries);

            if (JSON.stringify(payload) === window.lastSentPayload) {
                return;
            }

            win.postMessage({
                type: 'SET_USER_INFO',
                payload: payload
            }, IdentityRelaySettings.serverUrl);
            window.lastSentPayload = JSON.stringify(payload);
        }
    }, 1000);
};

window.onmessage = function (e) {
    if (e.origin !== IdentityRelaySettings.serverUrl) {
        return;
    }

    if (e.data.type === "USER_INFO") {
        if (JSON.stringify(Object.fromEntries(getRelatedEntries())) === JSON.stringify(e.data.payload)) {
            return;
        }

        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith(IdentityRelaySettings.cognitoLocalStorageKey),
        );
        keys.forEach((key) => localStorage.removeItem(key));
        for (var key in e.data.payload) {
            localStorage.setItem(key, e.data.payload[key]);
        }
    }

    if (e.data.type === 'USER_LOGOUT') {
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith(IdentityRelaySettings.cognitoLocalStorageKey),
        );

        if (keys.length === 0) {
            return;
        }

        keys.forEach((key) => localStorage.removeItem(key));
    }

    console.log("Message received from server: ", e.data);
};

window.identityRelay = {
    getPayload: getPayload,
    requestUserInfo: requestUserInfo,
    logout: logout,
    settings: IdentityRelaySettings,
};

function getRelatedEntries() {
    const localStorageArray = Object.entries(localStorage);
    return localStorageArray.filter((item) => item[0].startsWith(IdentityRelaySettings.cognitoLocalStorageKey));
}

function getPayload() {
    const relatedEntries = getRelatedEntries();
    return Object.fromEntries(relatedEntries);
}

function requestUserInfo() {
    const win = iframe.contentWindow;
    const postMsg = { type: "REQUEST_USER_INFO" };
    win.postMessage(postMsg, IdentityRelaySettings.serverUrl);
}

function logout() {
    const win = iframe.contentWindow;
    const postMsg = { type: "SEND_LOGOUT" };
    win.postMessage(postMsg, IdentityRelaySettings.serverUrl);
}
