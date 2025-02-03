import React, { useState } from 'react';
import { Download, Youtube, AlertCircle, Loader2 } from 'lucide-react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  formats: Array<{
    quality: string;
    container: string;
    size: string;
  }>;
}

function App() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const API_URL = import.meta.env.PROD 
    ? 'https://your-render-service-name.onrender.com'  // You'll replace this with your actual Render URL
    : 'http://localhost:3001';

  const validateUrl = (input: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    setIsValidUrl(youtubeRegex.test(input));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    validateUrl(input);
    setVideoInfo(null);
    setError('');
  };

  const getVideoInfo = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/video-info?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get video information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInfo) {
      await getVideoInfo();
    } else {
      try {
        setIsLoading(true);
        setError('');
        
        window.location.href = `${API_URL}/download?url=${encodeURIComponent(url)}`;
      } catch (err) {
        setError('Failed to download video');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Youtube className="w-12 h-12 text-red-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">GenTube</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Download YouTube videos easily and safely
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="url" 
                className="block text-sm font-medium text-gray-700"
              >
                YouTube URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Paste your YouTube video URL here"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isValidUrl ? 'border-gray-300' : 'border-red-500'
                  } focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors duration-200`}
                  disabled={isLoading}
                />
                {!isValidUrl && url && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 flex items-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              {!isValidUrl && url && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid YouTube URL
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {videoInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-4">
                  <img 
                    src={videoInfo.thumbnail} 
                    alt="Video thumbnail" 
                    className="w-32 h-auto rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{videoInfo.title}</h3>
                    <p className="text-sm text-gray-600">
                      Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValidUrl || !url || isLoading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium
                ${
                  isValidUrl && url && !isLoading
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }
                transition-colors duration-200`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  {videoInfo ? 'Download Video' : 'Get Video Info'}
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Fast Download</h3>
              <p className="text-sm text-gray-600">Quick and efficient downloads</p>
            </div>
            <div className="text-center">
              <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Safe & Secure</h3>
              <p className="text-sm text-gray-600">100% safe downloading</p>
            </div>
            <div className="text-center">
              <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Youtube className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800">All Formats</h3>
              <p className="text-sm text-gray-600">Multiple quality options</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} GenTube Clone. For educational purposes only.</p>
          <p className="mt-1">
            Not affiliated with YouTube or Google. Use responsibly and respect copyright.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;