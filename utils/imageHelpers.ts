
/**
 * Procesa una imagen subida:
 * 1. La redimensiona para no saturar la memoria.
 * 2. Realiza un recorte inteligente.
 * 3. Devuelve una cadena Base64 optimizada.
 */
export const processImage = (file: File, targetWidth = 1200, targetHeight = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');

        const canvasWidth = targetWidth;
        const canvasHeight = targetHeight;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          drawHeight = img.height;
          drawWidth = img.height * canvasAspect;
          offsetX = (img.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = img.width;
          drawHeight = img.width / canvasAspect;
          offsetX = 0;
          offsetY = (img.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, canvasWidth, canvasHeight);

        // Calidad 0.7 para asegurar que quepa en localStorage
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
