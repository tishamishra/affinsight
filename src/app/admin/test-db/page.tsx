"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDBPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addLog("Testing database connection...");
      
      // Test 1: Check if we can read from networks table
      addLog("Test 1: Reading from networks table");
      const { data: readData, error: readError } = await supabase
        .from('networks')
        .select('*')
        .limit(5);
      
      if (readError) {
        addLog(`❌ Read error: ${readError.message}`);
      } else {
        addLog(`✅ Read successful. Found ${readData?.length || 0} networks`);
      }

      // Test 2: Try to insert a test network
      addLog("Test 2: Inserting test network");
      const testNetwork = {
        name: "Test Network " + Date.now(),
        website: "https://test.com",
        category: "Test Category",
        rating: 4.0,
        countries: ["US", "CA"],
        logo_url: null
      };

      const { data: insertData, error: insertError } = await supabase
        .from('networks')
        .insert([testNetwork])
        .select()
        .single();

      if (insertError) {
        addLog(`❌ Insert error: ${insertError.message}`);
      } else {
        addLog(`✅ Insert successful. Created network with ID: ${insertData?.id}`);
        
        // Test 3: Try to delete the test network
        addLog("Test 3: Deleting test network");
        const { error: deleteError } = await supabase
          .from('networks')
          .delete()
          .eq('id', insertData.id);

        if (deleteError) {
          addLog(`❌ Delete error: ${deleteError.message}`);
        } else {
          addLog(`✅ Delete successful`);
        }
      }

    } catch (error) {
      addLog(`❌ Unexpected error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Connection Test</h1>
        
        <button
          onClick={testDatabaseConnection}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? "Testing..." : "Run Database Tests"}
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                {result}
              </div>
            ))}
            {testResults.length === 0 && (
              <p className="text-gray-500">No test results yet. Click the button above to run tests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 