/**
 * End-to-End Encryption for Assigned Co Counsel Messages
 * Uses Web Crypto API with AES-256-GCM
 * 
 * Attorney-client privilege protection:
 * - Messages encrypted before leaving the device
 * - Only sender and recipient can decrypt
 * - Server never sees plaintext
 */

// Generate a new encryption key for a conversation
export async function generateEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true, // extractable for export
        ['encrypt', 'decrypt']
    );
}

// Export key to storable format (for secure key exchange)
export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Import key from stored format
export async function importKey(keyString: string): Promise<CryptoKey> {
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

// Encrypt a message
export async function encryptMessage(plaintext: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    // Generate random IV for each message (critical for security)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        data
    );
    
    return {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv)),
    };
}

// Decrypt a message
export async function decryptMessage(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
    const encryptedData = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const ivData = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivData,
        },
        key,
        encryptedData
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// Generate a key pair for secure key exchange (ECDH)
export async function generateKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        true,
        ['deriveKey']
    );
}

// Derive shared secret from key exchange
export async function deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
    return await crypto.subtle.deriveKey(
        {
            name: 'ECDH',
            public: publicKey,
        },
        privateKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
}

// Export public key for sharing
export async function exportPublicKey(keyPair: CryptoKeyPair): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Import public key from another user
export async function importPublicKey(keyString: string): Promise<CryptoKey> {
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
        'spki',
        keyData,
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        true,
        []
    );
}

// Hash for message integrity verification
export async function hashMessage(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

// Encrypted message wrapper type
export interface EncryptedMessage {
    ciphertext: string;
    iv: string;
    hash: string;
    timestamp: number;
    senderId: string;
}

// Full encryption workflow for sending
export async function prepareSecureMessage(
    plaintext: string,
    key: CryptoKey,
    senderId: string
): Promise<EncryptedMessage> {
    const { ciphertext, iv } = await encryptMessage(plaintext, key);
    const hash = await hashMessage(plaintext);
    
    return {
        ciphertext,
        iv,
        hash,
        timestamp: Date.now(),
        senderId,
    };
}

// Full decryption workflow for receiving
export async function readSecureMessage(
    encrypted: EncryptedMessage,
    key: CryptoKey
): Promise<{ content: string; verified: boolean }> {
    const content = await decryptMessage(encrypted.ciphertext, encrypted.iv, key);
    const computedHash = await hashMessage(content);
    const verified = computedHash === encrypted.hash;
    
    return { content, verified };
}
