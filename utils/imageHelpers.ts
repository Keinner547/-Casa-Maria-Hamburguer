
/**
 * Procesa una imagen subida:
 * 1. La redimensiona para no saturar la memoria.
 * 2. Realiza un recorte automático (Center Crop) a formato cuadrado (1:1).
 * 3. Devuelve una cadena Base64 lista para usar.
 */
export const processImage = (file: File): Promise<string> => {
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

        // Configuración de tamaño de salida (600x600 es excelente para web)
        const size = 600; 
        canvas.width = size;
        canvas.height = size;

        // Lógica de "Cover" (Recorte central automático)
        let sWidth, sHeight, sx, sy;
        const aspect = img.width / img.height;

        if (aspect > 1) {
          // Es más ancha que alta
          sHeight = img.height;
          sWidth = img.height; // Queremos cuadrado
          sx = (img.width - img.height) / 2;
          sy = 0;
        } else {
          // Es más alta que ancha
          sWidth = img.width;
          sHeight = img.width;
          sx = 0;
          sy = (img.height - img.width) / 2;
        }

        // Dibujar en canvas (Crop & Resize)
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

        // Convertir a JPEG con calidad 0.85 para balancear calidad/peso
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
