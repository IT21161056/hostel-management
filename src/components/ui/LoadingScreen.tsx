import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;