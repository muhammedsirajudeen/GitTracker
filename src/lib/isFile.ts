export function isImageFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const uint = new Uint8Array(reader.result as ArrayBuffer);
        const bytes = uint.slice(0, 4);
        const hex = bytes.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  
        // Check for common image file signatures
        const imageSignatures: { [key: string]: string } = {
          'ffd8ffe0': 'image/jpeg',
          '89504e47': 'image/png',
          '47494638': 'image/gif',
          '424d': 'image/bmp',
          '474946383961': 'image/gif',
          '49492a00': 'image/tiff',
          '424d228c010000000000': 'image/bmp',
        };
  
        const mimeType = imageSignatures[hex];
        if (mimeType) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
  
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
  
      reader.readAsArrayBuffer(file);
    });
  }
  