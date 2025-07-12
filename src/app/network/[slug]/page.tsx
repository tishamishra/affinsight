import offers from '@/data/offers.json'
import affiliateNetworksData from '@/data/affiliate-networks.json'
import ReviewButton from '@/components/ReviewButton'
import NetworkHeaderRating from '@/components/NetworkHeaderRating'
import NetworkStats from '@/components/NetworkStats'
import UserReviews from '@/components/UserReviews'

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function NetworkPage({ params }: PageProps) {
  const { slug } = await params
  
  // Convert slug to network name for matching
  const networkName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  // Improved network matching logic
  const network = affiliateNetworksData.networks.find(n => {
    const networkNameLower = n.name.toLowerCase();
    const slugLower = slug.toLowerCase();
    const networkNameSlug = networkNameLower.replace(/\s+/g, '-');
    const networkNameSlugAlt = networkNameLower.replace(/[^a-z0-9]/g, '');
    
    return (
      networkNameLower === networkName.toLowerCase() ||
      networkNameSlug === slugLower ||
      networkNameSlugAlt === slugLower ||
      networkNameLower.includes(slugLower) ||
      slugLower.includes(networkNameLower.replace(/\s+/g, ''))
    );
  })
  
  if (!network) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Network Not Found</h1>
            <p className="text-gray-600">The network you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">Searched for: {slug}</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter offers by network name
  const networkOffers = offers.filter(offer => 
    offer.network.toLowerCase().includes(network.name.toLowerCase()) ||
    network.name.toLowerCase().includes(offer.network.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8" style={{fontFamily: 'Inter, ui-sans-serif, system-ui'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-8">
              {/* Network Logo with Rating */}
              {network.logo_url && (
                <div className="flex-shrink-0 relative">
                  <img 
                    src={network.logo_url} 
                    alt={`${network.name} logo`}
                    className="w-24 h-24 object-contain rounded-xl border border-[#e6c77c] bg-white p-3 shadow-sm"
                  />
                  {/* Small Rating Label on top of logo */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                    <NetworkHeaderRating networkSlug={slug} compact={true} />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-wide" style={{letterSpacing: '0.02em'}}>
                  {network.name}
                </h1>
                {network.category && (
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white text-sm font-medium rounded-full shadow-sm">
                    {network.category}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Metrics Display */}
              <NetworkStats networkSlug={slug} />
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {network.website && (
                  <a
                    href={network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] hover:from-[#e6c77c] hover:to-[#bfa14a] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                  >
                    Visit Website
                  </a>
                )}
                <ReviewButton networkName={network.name} networkSlug={slug} />
              </div>
            </div>
          </div>
        </div>

        {/* Network Description Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.02em'}}>
            <span className="w-2 h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-4"></span>
            About {network.name}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">{network.description || 'No description available.'}</p>
          
          {/* Network Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Commission Rate</h3>
              <p className="text-[#bfa14a] font-medium">{network.commission_rate || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Minimum Payout</h3>
              <p className="text-[#bfa14a] font-medium">{network.minimum_payout || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Frequency</h3>
              <p className="text-[#bfa14a] font-medium">{network.payment_frequency || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Offers Available</h3>
              <p className="text-[#bfa14a] font-medium">{network.offers_count || networkOffers.length}</p>
            </div>
          </div>
        </div>

        {/* Offers Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center tracking-wide" style={{letterSpacing: '0.02em'}}>
            <span className="w-2 h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-4"></span>
            Available Offers ({networkOffers.length})
          </h2>
          {networkOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {networkOffers.map((offer, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#e6c77c]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900" style={{letterSpacing: '0.01em'}}>{offer.offerName || 'Unnamed Offer'}</h3>
                    <span className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white text-xs font-medium px-3 py-1 rounded-full">
                      {offer.vertical || 'General'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 font-light">Payout: {offer.payout || 'N/A'} | Country: {offer.country || 'Global'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#bfa14a]">${offer.payout || '0'}</span>
                    <button className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] hover:from-[#e6c77c] hover:to-[#bfa14a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                      View Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-wide" style={{letterSpacing: '0.02em'}}>No Offers Available</h3>
              <p className="text-gray-600 font-light">Currently no offers are available for this network.</p>
            </div>
          )}
        </div>

        {/* User Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.02em'}}>
            <span className="w-2 h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-4"></span>
            User Reviews
          </h2>
          
          {/* Display Reviews */}
          <UserReviews networkSlug={slug} networkName={network.name} />
          
          {/* Add Review Button */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Share your experience with {network.name}</p>
            <ReviewButton networkName={network.name} networkSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
} 