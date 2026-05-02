import { useState, useRef, useCallback } from 'react';
import { Upload, X, Move, ZoomIn, ZoomOut, Download } from 'lucide-react';
import type { Artwork } from '../../lib/types';

interface WallVisualizerProps {
  artwork: Artwork;
  onClose: () => void;
}

interface Position { x: number; y: number }

export default function WallVisualizer({ artwork, onClose }: WallVisualizerProps) {
  const [wallImage, setWallImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [artworkScale, setArtworkScale] = useState(0.35);
  const [position, setPosition] = useState<Position>({ x: 0.5, y: 0.4 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setWallImage(result);
      setUploading(false);
    };
    
    reader.onerror = () => {
      setUploading(false);
      alert('Erro ao carregar imagem');
    };
    
    reader.readAsDataURL(file);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: position.x, py: position.y };
  }, [position]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStart.current.mx) / rect.width;
    const dy = (e.clientY - dragStart.current.my) / rect.height;
    setPosition({
      x: Math.max(0.05, Math.min(0.95, dragStart.current.px + dx)),
      y: Math.max(0.05, Math.min(0.95, dragStart.current.py + dy)),
    });
  }, [dragging]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (!wallImage) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      alert('Erro: não foi possível criar contexto do canvas.');
      return;
    }

    const wallImg = new Image();
    wallImg.crossOrigin = 'anonymous';
    wallImg.src = wallImage;
    
    wallImg.onload = () => {
      canvas.width = wallImg.width;
      canvas.height = wallImg.height;
      ctx.drawImage(wallImg, 0, 0);

      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      artImg.src = artwork.image_url;
      
      artImg.onload = () => {
        try {
          const maxW = canvas.width * artworkScale;
          const ratio = artImg.naturalWidth / artImg.naturalHeight;
          const w = maxW;
          const h = maxW / ratio;
          const x = canvas.width * position.x - w / 2;
          const y = canvas.height * position.y - h / 2;
          
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 20;
          ctx.drawImage(artImg, x, y, w, h);
          
          canvas.toBlob((blob) => {
            if (!blob) {
              alert('Erro ao gerar imagem. Tente novamente.');
              return;
            }
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `preview-${artwork.title.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 'image/png');
        } catch (error) {
          console.error('Error drawing artwork:', error);
          alert('Erro ao processar imagem. Tente novamente.');
        }
      };
      
      artImg.onerror = () => {
        console.error('Error loading artwork image:', artImg.src);
        alert('Erro ao carregar a imagem do quadro.');
      };
    };
    
    wallImg.onerror = () => {
      console.error('Error loading wall image');
      alert('Erro ao carregar a imagem da parede.');
    };
  }, [wallImage, artworkScale, position, artwork.image_url, artwork.title]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col overflow-hidden" onClick={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <h3 className="text-white font-light tracking-widest uppercase text-sm whitespace-nowrap">
            Experimentar na Sua Parede
          </h3>
          <p className="text-white/40 text-xs mt-0.5 truncate">{artwork.title}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors flex-shrink-0 ml-4"
          title="Fechar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden min-h-0" onClick={(e) => e.stopPropagation()}>
        {/* Canvas area */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden bg-gray-950 min-w-0"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: dragging ? 'grabbing' : 'crosshair' }}
        >
          {!wallImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-gray-950 to-black/80 p-6">
              <div className="w-24 h-24 border-2 border-dashed border-white/20 flex items-center justify-center rounded shrink-0">
                <Upload size={40} className="text-white/30" />
              </div>
              <div className="text-center max-w-xs">
                <p className="text-white/60 text-sm tracking-widest mb-2 font-light">Fotografe a sua parede</p>
                <p className="text-white/30 text-xs mb-4">JPG, PNG ou HEIC — até 20 MB</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-8 py-3 bg-amber-500 text-black font-medium text-xs tracking-[0.3em] uppercase hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 rounded shrink-0"
              >
                {uploading ? 'A carregar...' : 'Escolher Fotografia'}
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={wallImage} 
                alt="Parede" 
                className="w-full h-full object-cover"
              />
              <div
                className="absolute"
                style={{
                  left: `${position.x * 100}%`,
                  top: `${position.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${artworkScale * 100}%`,
                  cursor: dragging ? 'grabbing' : 'grab',
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.8))',
                }}
                onMouseDown={onMouseDown}
              >
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-auto select-none pointer-events-none rounded-sm"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 border-2 border-white/60 pointer-events-none rounded-sm"
                  style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.3)' }}
                />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                <Move size={14} className="text-amber-400" />
                <span className="text-white/70 text-xs tracking-wider font-light">Arraste para reposicionar</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-white/10 flex flex-col gap-4 p-6 bg-black/30 overflow-y-auto flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="shrink-0">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full aspect-square object-cover mb-4 rounded border border-white/10"
              onError={() => console.error('Failed to load thumbnail')}
            />
            <p className="text-white font-light text-sm mb-1">{artwork.title}</p>
            <p className="text-white/40 text-xs mb-3">{artwork.dimensions}</p>
            {artwork.price && (
              <p className="text-amber-400 font-light text-lg">
                €{artwork.price.toFixed(2)}
              </p>
            )}
          </div>

          {wallImage && (
            <div className="space-y-4 border-t border-white/10 pt-4 shrink-0">
              <div>
                <p className="text-white/50 text-xs tracking-widest uppercase mb-3 font-medium">Tamanho do Quadro</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setArtworkScale(s => Math.max(0.1, s - 0.05))}
                    className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 rounded transition-colors flex-shrink-0"
                    title="Reduzir"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <div className="flex-1 h-1 bg-white/10 rounded-full relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full -translate-x-1/2 transition-all shadow-lg pointer-events-none"
                      style={{ left: `${((artworkScale - 0.1) / 0.7) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setArtworkScale(s => Math.min(0.8, s + 0.05))}
                    className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 rounded transition-colors flex-shrink-0"
                    title="Aumentar"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-black font-medium text-xs tracking-[0.2em] uppercase hover:bg-amber-600 rounded transition-colors"
              >
                <Download size={16} />
                Guardar Imagem
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 text-white/70 font-medium text-xs tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                <Upload size={16} />
                {uploading ? 'A carregar...' : 'Mudar Foto'}
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}