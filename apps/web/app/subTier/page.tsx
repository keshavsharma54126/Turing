"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Zap, Users, ArrowRight } from 'lucide-react'

const pricingPlans = [
  {
    tier: 'FREE',
    price: '$0',
    features: [
      '2 Tests per month',
      '100 Chat queries',
      'Basic AI models',
      'Community support'
    ],
    color: 'from-amber-50 to-amber-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    icon: <Zap size={20} className="text-green-600" />
  },
  {
    tier: 'PRO',
    price: '$19',
    features: [
      '200 Tests per month',
      '2000 Chat queries',
      'Advanced AI models',
      'Priority support',
      'Custom test templates'
    ],
    color: 'from-amber-50 to-amber-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    icon: <Zap size={20} className="text-green-600" />,
    popular: true
  },
  {
    tier: 'TEAM',
    price: '$49',
    features: [
      '1000 Tests per month',
      '10000 Chat queries',
      'Enterprise-grade AI',
      'Dedicated account manager',
      'Team collaboration',
      'Custom integrations'
    ],
    color: 'from-amber-50 to-amber-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    icon: <Users size={20} className="text-green-600" />
  }
]

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Product Manager',
    text: 'The PRO plan has been a game-changer for our team. The advanced AI models have significantly improved our testing efficiency.',
    avatar: '/testimonial1.svg'
  },
  {
    name: 'Michael T.',
    role: 'QA Engineer',
    text: 'Switching to the TEAM plan allowed us to scale our testing operations while maintaining high quality standards.',
    avatar: '/testimonial2.svg'
  },
  {
    name: 'Emily R.',
    role: 'Startup Founder',
    text: 'The FREE plan was perfect for getting started, and upgrading was seamless when we needed more capacity.',
    avatar: '/testimonial3.svg'
  }
]

const SubTierPage = () => {
  const [selectedTier, setSelectedTier] = useState('FREE')
  const router = useRouter()

  const handlePayment = async () => {
    try {
      // Payment integration logic here
      router.push('/dashboard')
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 bg-amber-50 w-screen from-amber-50 to-amber-100">
      <button
        onClick={() => router.push('/home')}
        className="mb-6 sm:mb-8 px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2"
      >
        <ArrowRight className="rotate-180" size={16} />
        Back to Home
      </button>

      <div className="text-center mb-6 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Choose Your Plan</h1>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
          Flexible pricing plans designed to grow with your testing needs. Start small, scale big.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-20">
        {pricingPlans.map((plan) => (
          <div
            key={plan.tier}
            className={`relative bg-gradient-to-b ${plan.color} rounded-lg sm:rounded-2xl shadow-sm sm:shadow-xl hover:shadow-md sm:hover:shadow-2xl transition-all duration-300 p-4 sm:p-8 ${
              plan.popular ? 'scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-green-600 text-white px-2 py-1 rounded-bl-md rounded-tr-lg text-xs sm:text-sm">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-2 mb-3 sm:mb-6">
              {plan.icon}
              <h2 className="text-lg sm:text-2xl font-bold">{plan.tier}</h2>
            </div>
            <div className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6">
              {plan.price}<span className="text-base sm:text-lg text-gray-600">/mo</span>
            </div>
            
            <ul className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs sm:text-base">
                  <Check size={16} className="text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedTier(plan.tier)}
              className={`w-full py-1.5 sm:py-3 rounded-md sm:rounded-lg text-white font-medium transition-all text-sm sm:text-base ${
                selectedTier === plan.tier
                  ? 'ring-2 ring-white ring-offset-2'
                  : ''
              } ${plan.buttonColor}`}
            >
              {selectedTier === plan.tier ? 'Selected' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-8 mb-8 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-8 text-center">Plan Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 sm:p-4">Feature</th>
                {pricingPlans.map((plan) => (
                  <th key={plan.tier} className="p-2 sm:p-4 text-center">
                    {plan.tier}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingPlans[0]?.features?.map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 sm:p-4 text-xs sm:text-sm">{pricingPlans[0]?.features?.[index] || '-'}</td>
                  {pricingPlans.map((plan) => (
                    <td key={plan.tier} className="p-2 sm:p-4 text-center">
                      {plan.features?.[index] ? (
                        <Check size={18} className="text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mb-8 sm:mb-20">
        <button
          onClick={handlePayment}
          className="px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium text-sm sm:text-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
        >
          Get Started with {selectedTier}
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-2xl p-4 sm:p-8">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-amber-50 p-3 sm:p-6 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-xs sm:text-base">{testimonial.name}</div>
                  <div className="text-xxs sm:text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-base">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default SubTierPage
