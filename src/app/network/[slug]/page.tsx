import offers from '@/data/offers.json'
import affiliateNetworksData from '@/data/affiliate-networks.json'
import ReviewButton from '@/components/ReviewButton'
import NetworkHeaderRating from '@/components/NetworkHeaderRating'
import NetworkStats from '@/components/NetworkStats'
import UserReviews from '@/components/UserReviews'
import NetworkDescription from '@/components/NetworkDescription'
import NetworkDetailsTable from '@/components/NetworkDetailsTable'

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function NetworkPage({ params }: PageProps) {
  const { slug } = await params
  
  // Convert slug to network name for matching
  const networkName = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
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
          <div className="flex flex-col gap-4">
            {/* Top row: logo, name, and category pill */}
            <div className="flex flex-row items-center gap-6">
              {/* Logo */}
              {network.logo_url && (
                <div className="flex-shrink-0 relative">
                  <img 
                    src={network.logo_url} 
                    alt={`${network.name} logo`}
                    className="w-24 h-24 object-contain rounded-xl border border-[#e6c77c] bg-white p-3 shadow-sm"
                  />
                  {/* Small Rating Label on top of logo */}
                  <div className="absolute -top-2 -right-2">
                    <NetworkHeaderRating networkSlug={slug} compact={true} />
                  </div>
                </div>
              )}
              {/* Name and category pill in a row */}
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-wide" style={{letterSpacing: '0.02em'}}>
                  {network.name}
                </h1>
                {network.category && (
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white text-sm font-medium rounded-full shadow-sm">
                    {network.category}
                  </span>
                )}
              </div>
            </div>
            {/* Metrics badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <NetworkStats networkSlug={slug} />
            </div>
            {/* Action buttons */}
            <div className="flex flex-row gap-3 justify-end">
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

        {/* Network Description Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] bg-transparent rounded-none shadow-none border-none p-2 mb-3">
          <h2 className="text-base sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.01em'}}>
            <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
            About {network.name}
          </h2>
          {/* Description with Read More functionality */}
          <div className="text-xs sm:text-base">
            <NetworkDescription networkName={network.name} network={network} showReadMore={true} />
          </div>
          {/* Network Details Table (dynamic, auto-updating) */}
          <div className="sm:block bg-transparent rounded-none shadow-none border-none p-0">
            <NetworkDetailsTable network={network} />
          </div>
        </div>

        {/* Offers Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] bg-transparent rounded-none shadow-none border-none p-2 mb-3">
          <h2 className="text-base sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-8 flex items-center tracking-wide" style={{letterSpacing: '0.01em'}}>
            <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
            Available Offers ({networkOffers.length})
          </h2>
          {networkOffers.length > 0 ? (
            <div className="flex flex-col gap-2 sm:gap-3">
              {networkOffers.map((offer, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 border border-gray-200 rounded p-2 sm:p-3 text-sm sm:text-base w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                    <span className="font-semibold text-gray-900">{offer.offerName || 'Unnamed Offer'}</span>
                    <span className="text-gray-500">{offer.vertical || 'General'}</span>
                    <span className="text-gray-500">Payout: <span className="font-medium text-[#bfa14a]">{offer.payout || 'N/A'}</span></span>
                    <span className="text-gray-400">{offer.country || 'Global'}</span>
                  </div>
                  <button className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] hover:from-[#e6c77c] hover:to-[#bfa14a] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 transition-all duration-300 transform hover:scale-105 mt-2 sm:mt-0 whitespace-nowrap">
                    View Offer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-16">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 tracking-wide" style={{letterSpacing: '0.01em'}}>No Offers Available</h3>
              <p className="text-gray-600 font-light text-xs sm:text-base">Currently no offers are available for this network.</p>
            </div>
          )}
        </div>

        {/* User Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8 mb-8 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] bg-transparent rounded-none shadow-none border-none p-2 mb-3 text-xs sm:text-base">
          <h2 className="text-base sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.01em'}}>
            <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
            User Reviews
          </h2>
          {/* Display Reviews */}
          <UserReviews networkSlug={slug} networkName={network.name} />
          {/* Add Review Button */}
          <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2 sm:mb-4 text-xs sm:text-base">Share your experience with {network.name}</p>
            <ReviewButton networkName={network.name} networkSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
} 