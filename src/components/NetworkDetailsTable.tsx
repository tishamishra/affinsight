import React from "react";

const EXCLUDE_FIELDS = [
  "id", "logo_url", "description", "name", "website", "category", "rating", "countries"
];

function prettifyLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export default function NetworkDetailsTable({ network }: { network: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8">
      <h2 className="text-xl font-semibold text-[#bfa14a] mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.02em'}}>
        <span className="w-2 h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-4"></span>
        Affiliate Network Details
      </h2>
      <table className="w-full text-[15px] font-light text-gray-900 border-separate border-spacing-y-2" style={{fontFamily: 'Inter, ui-sans-serif, system-ui'}}>
        <tbody>
          {Object.entries(network)
            .filter(([key]) => !EXCLUDE_FIELDS.includes(key))
            .map(([key, value]) => (
              <tr key={key}>
                <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap" style={{fontSize: '14px', letterSpacing: '0.01em'}}>{prettifyLabel(key)}</td>
                <td className="py-2 pl-2 text-gray-900 font-semibold" style={{fontSize: '15px', color: '#bfa14a'}}>
                  {Array.isArray(value)
                    ? value.join(", ")
                    : value !== null && value !== undefined
                    ? String(value)
                    : "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
} 