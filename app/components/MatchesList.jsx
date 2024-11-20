"use client";

import { useState, useEffect } from "react";

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:8080/matches");
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        const sortedMatches = data.sort((a, b) => b.score - a.score);
        setMatches(sortedMatches);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMatches();
  }, []);

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }

  console.log(matches);

  return (
    <div className="mb-4">
      <h4 className='text-lg md:text-2xl font-semibold'>Ranking</h4>
      <div className="flex flex-col bg-dodger-blue-500 w-full h-20 md:h-48 rounded-lg p-4 overflow-auto">
        {matches.map(match => 
          <div key={match.id} className="flex flex-row justify-between my-1 px-4">
            <div className="text-2xl">{match.username}</div>
            <div className="text-2xl">{match.score}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesList;
