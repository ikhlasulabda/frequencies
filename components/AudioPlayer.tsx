// components/AudioPlayer.tsx

interface AudioPlayerProps {
    previewUrl: string
}

export default function AudioPlayer({ previewUrl }: AudioPlayerProps) {
    return (
        <div className="w-full mt-4">
            <p className="text-xs text-gray-400 mb-2">preview 30 detik</p>
            <audio
                controls
                src={previewUrl}
                className="w-full"
            >
                Browser lo tidak support audio.
            </audio>
        </div>
    )
}