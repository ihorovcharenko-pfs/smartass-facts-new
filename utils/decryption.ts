
export async function decryptAnswer(encryptedAnswer: string): Promise<boolean> {
  try {
    const [ivHex, encryptedHex] = encryptedAnswer.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted answer format');
    }

    const envKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
    let keyBuffer: ArrayBuffer;
    
    if (envKey.length === 64 && /^[0-9a-fA-F]+$/.test(envKey)) {
      const hexBytes = envKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16));
      keyBuffer = new Uint8Array(hexBytes).buffer;
    } else {
      const keyData = new TextEncoder().encode(envKey);
      keyBuffer = await crypto.subtle.digest('SHA-256', keyData);
    }
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    const iv = Uint8Array.from(
      ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    const encrypted = Uint8Array.from(
      encryptedHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      encrypted
    );

    const decryptedText = new TextDecoder().decode(decrypted);
    return decryptedText === 'true';
  } catch (error) {
    console.error('Error decrypting answer:', error);
    return false;
  }
}

