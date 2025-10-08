/**
 * Statistics page - ZLECAf Trade Statistics
 * Next.js compatible page structure
 */
import React, { useState, useEffect } from 'react';

export default function StatisticsPage({ initialStats = null }) {
  const [statistics, setStatistics] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load statistics if not provided via SSR
    if (!initialStats) {
      fetchStatistics();
    }
  }, [initialStats]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="statistics-page">
      <h1>ZLECAf Trade Statistics</h1>
      {loading ? (
        <div>Loading statistics...</div>
      ) : statistics ? (
        <div>
          <h2>Trade Overview</h2>
          {/* Statistics visualization will be integrated here */}
          <pre>{JSON.stringify(statistics, null, 2)}</pre>
        </div>
      ) : (
        <div>No statistics available</div>
      )}
    </div>
  );
}

// Next.js server-side props (ready for migration)
/*
export async function getServerSideProps() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${API_URL}/api/statistics`);
    const statistics = await res.json();
    
    return {
      props: {
        initialStats: statistics,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialStats: null,
      },
    };
  }
}
*/
