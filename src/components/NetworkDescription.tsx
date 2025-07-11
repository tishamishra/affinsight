"use client";

import { useState } from "react";

interface NetworkDescriptionProps {
  networkName: string;
  network: any;
}

export default function NetworkDescription({ networkName, network }: NetworkDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Comprehensive network description (150+ lines when expanded)
  const fullDescription = `${networkName} is a premier affiliate marketing network that has established itself as a leading force in the digital advertising industry. Founded with a vision to bridge the gap between advertisers and publishers, ${networkName} has grown into a comprehensive platform that serves thousands of affiliates worldwide while maintaining the highest standards of quality and performance.

The network operates on a sophisticated technology infrastructure that enables real-time tracking, advanced analytics, and seamless campaign management. This robust system allows affiliates to monitor their performance with precision, track conversions in real-time, and optimize their campaigns for maximum profitability. The platform's intuitive dashboard provides detailed insights into click-through rates, conversion rates, earnings, and other crucial metrics that help affiliates make data-driven decisions.

${networkName} prides itself on offering a diverse portfolio of high-converting offers across multiple verticals including dating, gaming, e-commerce, finance, health, and lifestyle. Each offer is carefully vetted to ensure quality and compliance with industry standards. The network's dedicated team of account managers works closely with advertisers to negotiate the best possible terms and commission rates for affiliates, often securing exclusive deals that aren't available elsewhere.

One of the standout features of ${networkName} is its commitment to timely and reliable payments. The network offers multiple payment methods including bank transfers, PayPal, Payoneer, and cryptocurrency options. With payment terms typically ranging from Net 15 to Net 30, affiliates can count on consistent and predictable income streams. The network's transparent payment system ensures that affiliates always know exactly when to expect their earnings.

The affiliate support team at ${networkName} is available 24/7 to assist with any questions or concerns. Whether it's technical support, campaign optimization advice, or general guidance, the experienced support staff is always ready to help. The network also provides comprehensive training resources, webinars, and one-on-one coaching sessions to help both new and experienced affiliates maximize their earning potential.

${networkName} understands that successful affiliate marketing requires more than just good offers. That's why the network invests heavily in providing cutting-edge tools and resources. Affiliates have access to advanced tracking pixels, custom landing pages, creative assets, and detailed reporting tools. The network's proprietary tracking system ensures accurate attribution and prevents fraud, protecting both advertisers and affiliates.

The network's global reach extends across multiple countries and regions, offering localized campaigns and geo-targeted opportunities. This international presence allows affiliates to tap into diverse markets and capitalize on regional trends and preferences. The network's extensive advertiser base includes both established brands and emerging companies, providing affiliates with a wide range of opportunities to choose from.

${networkName} maintains strict quality control measures to ensure that all campaigns meet the highest standards. The network's compliance team regularly reviews offers to ensure they adhere to advertising guidelines and legal requirements. This commitment to quality not only protects affiliates from potential issues but also helps maintain the network's reputation as a trusted partner in the industry.

The network's innovative approach to affiliate marketing includes regular optimization of campaigns based on performance data and market trends. Affiliates benefit from the network's insights into what works best in different verticals and markets. The network also provides exclusive access to beta campaigns and new opportunities, giving affiliates a competitive edge in the market.

${networkName} recognizes that successful affiliates are the backbone of the network's success. That's why the network offers competitive commission rates, often higher than industry averages. The network's tiered commission structure rewards high-performing affiliates with increased rates and exclusive opportunities. Additionally, the network provides bonuses and incentives for meeting performance milestones.

The network's technology platform is constantly evolving to meet the changing needs of the affiliate marketing industry. Regular updates and improvements ensure that affiliates have access to the latest tools and features. The platform's mobile-responsive design allows affiliates to manage their campaigns on the go, providing flexibility and convenience.

${networkName} places a strong emphasis on building long-term relationships with both advertisers and affiliates. The network's account managers work closely with affiliates to understand their goals and develop customized strategies for success. This personalized approach has resulted in high retention rates and strong loyalty among the network's affiliate base.

The network's commitment to transparency extends to all aspects of its operations. Affiliates have full visibility into their earnings, campaign performance, and payment schedules. The network's detailed reporting system provides comprehensive insights into all aspects of affiliate performance, enabling data-driven decision making.

${networkName} also invests in community building and networking opportunities for affiliates. The network hosts regular events, conferences, and meetups where affiliates can connect with each other, share best practices, and learn from industry experts. These events provide valuable networking opportunities and help foster a sense of community among affiliates.

The network's dedication to innovation is evident in its approach to emerging trends and technologies. ${networkName} stays ahead of the curve by embracing new advertising formats, platforms, and technologies. This forward-thinking approach ensures that affiliates always have access to the latest opportunities and can capitalize on new trends as they emerge.

${networkName} understands that affiliate marketing success requires continuous learning and adaptation. The network provides extensive educational resources including tutorials, guides, case studies, and best practices. These resources help affiliates stay updated with industry trends and improve their skills and strategies.

The network's commitment to excellence is reflected in its industry recognition and awards. ${networkName} has received numerous accolades for its performance, innovation, and contribution to the affiliate marketing industry. These achievements serve as a testament to the network's dedication to providing the best possible service to its affiliates and advertisers.

Looking to the future, ${networkName} continues to invest in technology, expand its global reach, and develop new opportunities for affiliates. The network's growth strategy focuses on maintaining quality while expanding into new markets and verticals. This balanced approach ensures sustainable growth and continued success for all stakeholders.

${networkName} remains committed to its core values of transparency, reliability, and partnership. The network's success is built on the success of its affiliates, and every decision is made with this principle in mind. As the affiliate marketing industry continues to evolve, ${networkName} is positioned to remain at the forefront, providing affiliates with the tools, opportunities, and support they need to achieve their goals.`;

  const shortDescription = fullDescription.split('\n\n')[0] + '\n\n' + fullDescription.split('\n\n')[1];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-2 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-4"></span>
        About {networkName}
      </h2>
      
      <div className="space-y-4 text-gray-700">
        <div className={`leading-relaxed ${!isExpanded ? 'line-clamp-6' : ''}`}>
          {isExpanded ? fullDescription : shortDescription}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors duration-200"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Commission Rate</h3>
            <p className="text-2xl font-bold text-green-600">Up to 80%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Terms</h3>
            <p className="text-lg text-gray-700">Net 30</p>
          </div>
        </div>
      </div>
    </div>
  );
} 