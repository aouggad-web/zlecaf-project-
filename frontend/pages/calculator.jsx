/**
 * Calculator page - ZLECAf Tariff Calculator
 * Next.js compatible page structure
 */
import React, { useState, useEffect } from 'react';

export default function CalculatorPage({ initialCountries = [] }) {
  const [countries, setCountries] = useState(initialCountries);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load countries if not provided via SSR
    if (!initialCountries.length) {
      fetchCountries();
    }
  }, [initialCountries]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-page">
      <h1>ZLECAf Tariff Calculator</h1>
      {loading ? (
        <div>Loading countries...</div>
      ) : (
        <div>
          <p>Countries loaded: {countries.length}</p>
          {/* Calculator form will be integrated here */}
        </div>
      )}
    </div>
  );
}

// Next.js server-side props (ready for migration)
/*
export async function getServerSideProps() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${API_URL}/api/countries`);
    const countries = await res.json();
    
    return {
      props: {
        initialCountries: countries,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialCountries: [],
      },
    };
  }
}
*/
