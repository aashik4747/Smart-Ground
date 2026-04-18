export default function Loader({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">{text}</p>
        </div>
    );
}
