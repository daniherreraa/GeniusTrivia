import { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';

export default function MatchesList() {
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(rankings)

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }
      const data = await response.json();
      setRankings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial rankings
    fetchRankings();

    // Set interval to fetch rankings every 5 seconds
    const intervalId = setInterval(fetchRankings, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white/10 backdrop-blur-sm text-white rounded-lg">
        Loading rankings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-white/10 backdrop-blur-sm text-white rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white/10 backdrop-blur-sm text-white rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5" />
        <h2 className="text-lg font-bold">Global Rankings</h2>
      </div>
      <div className="space-y-3 max-h-32 overflow-y-scroll pr-2">
        {rankings.map((ranking, index) => (
          <div
            key={ranking.user_id}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors
              ${index === 0 ? 'bg-yellow-500/20' : 
                index === 1 ? 'bg-gray-400/20' : 
                index === 2 ? 'bg-amber-700/20' : 'bg-white/5'}`}
          >
            <div className="flex items-center gap-2 min-w-[40px]">
              {index < 3 ? (
                <Medal className={index === 0 ? "text-yellow-500" : 
                                 index === 1 ? "text-gray-400" : "text-amber-700"} />
              ) : (
                <span className="ml-6">#{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{ranking.username}</p>
              <p className="text-sm text-dodger-blue-100">
                {ranking.total_correct} correct answers
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{ranking.accuracy ?? 0}%</p>
              <p className="text-xs text-dodger-blue-100">accuracy</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}