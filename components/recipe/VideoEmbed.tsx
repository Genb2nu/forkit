'use client';

import { detectVideoType, buildEmbedUrl } from '@/lib/video';

interface VideoEmbedProps {
  videoUrl: string | null;
  videoNote?: string | null;
  isOwner?: boolean;
  onRequestEdit?: () => void;
}

export function VideoEmbed({ videoUrl, videoNote, isOwner, onRequestEdit }: VideoEmbedProps) {
  // No video
  if (!videoUrl) {
    if (isOwner) {
      return (
        <div className="mt-6">
          <button
            onClick={onRequestEdit}
            className="w-full border-2 border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 text-muted-custom hover:border-fire/30 hover:text-cream transition-colors"
          >
            <span className="text-2xl">🎬</span>
            <span className="text-sm">Add a video link</span>
            <span className="text-xs text-muted-custom">YouTube or Facebook</span>
          </button>
        </div>
      );
    }
    // Guest/non-owner: subtle placeholder
    return (
      <div className="mt-6">
        <div className="w-full border border-dashed border-border/50 rounded-xl py-6 flex items-center justify-center">
          <span className="text-muted-custom text-xs">No video available</span>
        </div>
      </div>
    );
  }

  const type = detectVideoType(videoUrl);
  const embedUrl = buildEmbedUrl(videoUrl);

  return (
    <div className="mt-6">
      {/* Platform badge */}
      {type && (
        <span className="text-xs text-muted-custom mb-2 inline-block">
          {type === 'youtube' ? '▶️ YouTube' : '👤 Facebook'}
        </span>
      )}

      {/* 16:9 embed */}
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Recipe video"
        />
      </div>

      {/* Video note */}
      {videoNote && (
        <div className="mt-3 p-3 rounded-lg bg-fire/5 border border-fire/10">
          <p className="text-text-2 text-xs italic">📝 {videoNote}</p>
        </div>
      )}
    </div>
  );
}
