
/**
 * @fileoverview Provides client-side and server-side encryption utilities
 * using the WebCrypto API for end-to-end payload encryption (E2EE).
 * 
 * IMPORTANT: The secret key must be managed securely and should NOT be
 * hardcoded in the client-side application. This implementation assumes
 * the key is fetched or derived securely (e.g., via a key exchange).
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Derives a cryptographic key from a raw secret string.
 * @param secretKey - A high-entropy secret string.
 * @returns A promise that resolves to a CryptoKey.
 */
async function getCryptoKey(secretKey: string): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(secretKey),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("a-constant-salt"), // In a real app, salt should be unique per user
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypts a data payload using AES-GCM.
 * This function is intended for the CLIENT-SIDE.
 * 
 * @param data - The JSON-serializable object to encrypt.
 * @param secretKey - The raw secret key string.
 * @returns A promise that resolves to an object containing the base64-encoded
 *          ciphertext (`payload`) and initialization vector (`iv`).
 */
export async function encryptPayload(data: unknown, secretKey: string): Promise<{ payload: string; iv: string }> {
    const encodedData = encoder.encode(JSON.stringify(data));
    // The IV must be unique for every encryption with the same key.
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const cryptoKey = await getCryptoKey(secretKey);

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        cryptoKey,
        encodedData
    );

    // Convert ArrayBuffer to Base64 string for transmission
    const payload = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const ivString = btoa(String.fromCharCode(...iv));

    return { payload, iv: ivString };
}


// --- SERVER-SIDE DECRYPTION ---
// The following function is for illustrative purposes and should be implemented
// in a secure server environment (e.g., Firebase Cloud Functions) using Node.js crypto.

/**
 * Decrypts a data payload using AES-GCM.
 * This function is intended for the SERVER-SIDE.
 * 
 * @param encryptedPayload - The base64-encoded ciphertext.
 * @param ivString - The base64-encoded initialization vector.
 * @param secretKey - The raw secret key string (fetched from a secure secret manager).
 * @returns A promise that resolves to the decrypted data object.
 */
export async function decryptPayload(encryptedPayload: string, ivString: string, secretKey: string): Promise<any> {
    // This server-side implementation would use Node.js's crypto module.
    // The following is a browser-based simulation for structural illustration.
    
    // Convert Base64 strings back to ArrayBuffers
    const payloadBuffer = Uint8Array.from(atob(encryptedPayload), c => c.charCodeAt(0));
    const ivBuffer = Uint8Array.from(atob(ivString), c => c.charCodeAt(0));

    const cryptoKey = await getCryptoKey(secretKey);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        cryptoKey,
        payloadBuffer
    );
    
    const decryptedData = decoder.decode(decrypted);
    return JSON.parse(decryptedData);
}
