/**
 * Utility functions for client-side avatar image processing and compression.
 * Automatically resizes high-resolution images to optimal web dimensions
 * (max 360x360 px) so localStorage stays lightweight (< 40KB) and lightning-fast.
 */

export const PRESET_AVATARS = [
  {
    id: 'avatar-trader-1',
    name: 'Wall Street Trader',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    role: 'Equity & Macro Strategist',
  },
  {
    id: 'avatar-trader-2',
    name: 'Tech Quant Analyst',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    role: 'Algorithmic Trader',
  },
  {
    id: 'avatar-trader-3',
    name: 'Executive Portfolio Manager',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    role: 'Global Fund Manager',
  },
  {
    id: 'avatar-trader-4',
    name: 'Financial Architect',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    role: 'Derivatives & FX Specialist',
  },
  {
    id: 'avatar-trader-5',
    name: 'IDX Market Specialist',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&auto=format&fit=crop&q=80',
    role: 'Indonesian Equities Analyst',
  },
  {
    id: 'avatar-trader-6',
    name: 'Venture & Growth Investor',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    role: 'Private Equity & Blue Chips',
  },
];

/**
 * Resizes and compresses an uploaded image file into a square base64 JPEG string
 * @param file User selected File object
 * @param maxSize Maximum width/height in pixels (default 360)
 * @param quality JPEG compression quality (0.0 to 1.0, default 0.85)
 */
export function compressAvatarImage(
  file: File,
  maxSize: number = 360,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan berkas gambar yang valid.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.onload = () => {
        // Calculate center-cropped square dimensions
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        const targetSize = Math.min(maxSize, minDim);

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context tidak tersedia.'));
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped center square
        ctx.drawImage(
          img,
          startX,
          startY,
          minDim,
          minDim,
          0,
          0,
          targetSize,
          targetSize
        );

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (e) {
          // Fallback to PNG if JPEG export fails
          resolve(canvas.toDataURL());
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
