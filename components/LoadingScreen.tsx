// components/LoadingScreen.tsx

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <p className="text-lg tracking-widest animate-pulse">finding your frequency...</p>
        </div>
    )
}