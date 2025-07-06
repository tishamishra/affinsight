"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSupabase = async () => {
    setLoading(true);
    try {
      console.log("Testing Supabase connection...");
      
      // Test 1: Direct query
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .limit(10);
      
      console.log("Supabase response:", { data, error });
      setResults({ data, error });
      
    } catch (err) {
      console.error("Test failed:", err);
      setResults({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Test</h1>
        
        <button
          onClick={testSupabase}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? "Testing..." : "Test Supabase Connection"}
        </button>

        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <div className="space-y-4">
              {results.error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="text-red-800 font-semibold">Error:</h3>
                  <pre className="text-red-700 text-sm mt-2">{JSON.stringify(results.error, null, 2)}</pre>
                </div>
              )}
              
              {results.data && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="text-green-800 font-semibold">Data ({results.data.length} networks):</h3>
                  <pre className="text-green-700 text-sm mt-2 overflow-auto max-h-96">{JSON.stringify(results.data, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 