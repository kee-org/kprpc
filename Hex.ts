export function base64urlEncode (input: string) {
    return btoa(input).replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, ".");
}

export function base64urlDecode (input: string) {
    return atob(input.replace(/\-/g, "+").replace(/\_/g, "/").replace(/\./g, "="));
}

export function binaryToByteArray (binary: string): Uint8Array {
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }
    return view;
}

export function base64urltoByteArray (input: string) {
    const binary = base64urlDecode(input);
    return binaryToByteArray(binary);
}

export function base64toByteArray (input: string) {
    const binary = atob(input);
    return binaryToByteArray(binary);
}

export function bufferToBase64 (arrayBuffer: ArrayBuffer): string {
    const bytes = new Uint8Array(arrayBuffer);
    return byteArrayToBase64(bytes);
}

export function byteArrayToBase64 (bytes: Uint8Array): string {
    let base64 = "";
    const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;
    let a;
    let b;
    let c;
    let d;
    let chunk;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
        // Combine into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
        d = chunk & 63; // 63 = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3 = 2^2 - 1

        base64 += encodings[a] + encodings[b] + "==";
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15 = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + "=";
    }

    return base64;
}

export function hexStringToByteArray (hex: string) {
    if (hex.length % 2 !== 0) {
        throw Error("Must have an even number of hex digits to convert to bytes");
    }
    const numBytes = hex.length / 2;
    const byteArray = new Uint8Array(numBytes);
    for (let i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hex.substr(i*2, 2), 16);
    }
    return byteArray;
}

export function byteArrayToHex (array: Uint8Array): string {
    return Array.prototype.map.call(array, (x: number) => ("00" + x.toString(16)).slice(-2)).join("");
}

export function bufferToHex (buffer: ArrayBuffer) {
    return byteArrayToHex(new Uint8Array(buffer));
}

export function hex2base64 (text: string) {
    const array = hexStringToByteArray(text);
    return byteArrayToBase64(array);
}

export function base642hex (text: string) {
    const array = base64toByteArray(text);
    return byteArrayToHex(array);
}
