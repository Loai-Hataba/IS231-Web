// Simple encryption/decryption functions
function encryptToken(token) {
    const key = 'conquista-beblio-2024';
    let encrypted = '';
    for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += ('00' + charCode.toString(16)).slice(-2);
    }
    return btoa(encrypted);
}

function decryptToken(encrypted) {
    const key = 'conquista-beblio-2024';
    try {
        const hex = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < hex.length; i += 2) {
            const charCode = parseInt(hex.substr(i, 2), 16) ^ key.charCodeAt((i/2) % key.length);
            decrypted += String.fromCharCode(charCode);
        }
        return decrypted;
    } catch (e) {
        console.error('Token decryption failed:', e);
        return null;
    }
}