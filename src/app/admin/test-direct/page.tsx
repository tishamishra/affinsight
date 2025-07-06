"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDirectPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDirectAccess = async () => {
    setLoading(true);
    try {
      console.log("Testing direct Supabase access...");
      
      // Test 1: Simple count query
      const { count, error: countError } = await supabase
        .from('networks')
        .select('*', { count: 'exact', head: true });
      
      console.log("Count result:", { count, countError });
      
      // Test 2: Full query
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .limit(5);
      
      console.log("Full query result:", { data, error });
      
      setResults({ count, countError, data, error });
      
    } catch (err) {
      console.error("Direct test failed:", err);
      setResults({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Direct Supabase Test</h1>
        
        <button
          onClick={testDirectAccess}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? "Testing..." : "Test Direct Supabase Access"}
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
              
              {results.countError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <h3 className="text-yellow-800 font-semibold">Count Error:</h3>
                  <pre className="text-yellow-700 text-sm mt-2">{JSON.stringify(results.countError, null, 2)}</pre>
                </div>
              )}
              
              {results.data && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="text-green-800 font-semibold">Data ({results.data.length} networks):</h3>
                  <pre className="text-green-700 text-sm mt-2 overflow-auto max-h-96">{JSON.stringify(results.data, null, 2)}</pre>
                </div>
              )}
              
              {results.count !== undefined && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h3 className="text-blue-800 font-semibold">Count:</h3>
                  <p className="text-blue-700 text-sm mt-2">{results.count} networks found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 