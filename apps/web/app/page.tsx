"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useRouter } from 'next/navigation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold">
              TURING AI
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="brutalist-button p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900">Pricing</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-gray-900">About</button>
            <Link href="/signin" className="brutalist-button px-4 py-2 text-sm">Sign In</Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm border-t border-gray-200">
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              About
            </button>
            <Link 
              href="/signin" 
              className="block px-3 py-2 brutalist-button text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen gradient-bg relative">
      <div className="absolute inset-0 pattern-grid opacity-30"></div>
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 hero-pattern opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F5DC]/50"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
                  Transform Learning with AI
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-12 font-mono text-gray-700 leading-relaxed">
                  Generate intelligent tests and get personalized tutoring powered by advanced AI
                </p>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex -space-x-2">
                    <img 
                      src="/testimonial1.jpg" 
                      alt="Student 1" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img 
                      src="/testimonial2.jpg" 
                      alt="Student 2" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img 
                      src="/testimonial3.jpg" 
                      alt="Student 3" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  </div>
                  <div className="font-mono text-gray-600">
                    <span className="font-bold">5000+</span> students transformed
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={() => router.push('/home')} className="brutalist-button px-8 py-4 text-lg font-bold bg-[#B8D8E3] hover:bg-[#9CC5D3]">
                    Get Started
                  </button>
                  <button className="brutalist-button px-8 py-4 text-lg font-bold bg-[#F7CAC9] hover:bg-[#F0B7B6]">
                    Try Demo
                  </button>
                </div>
              </div>
              
              <div className="relative h-[500px] hidden md:block">
                <div className="absolute inset-0 brutalist-card p-6 bg-white animate-float">
                  <Line
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                      datasets: [
                        {
                          label: 'Average Student Score',
                          data: [65, 68, 72, 78, 85, 92],
                          borderColor: '#B8D8E3',
                          backgroundColor: 'rgba(184, 216, 227, 0.2)',
                          tension: 0.4,
                          fill: true,
                        },
                        {
                          label: 'With Turing AI',
                          data: [67, 75, 82, 88, 92, 96],
                          borderColor: '#F7CAC9',
                          backgroundColor: 'rgba(247, 202, 201, 0.2)',
                          tension: 0.4,
                          fill: true,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            font: {
                              family: 'monospace'
                            }
                          }
                        },
                        title: {
                          display: true,
                          text: 'Student Performance Improvement',
                          font: {
                            size: 16,
                            family: 'monospace',
                            weight: 'bold'
                          }
                        }
                      },
                      scales: {
                        y: {
                          min: 60,
                          max: 100,
                          ticks: {
                            callback: value => `${value}%`,
                            font: {
                              family: 'monospace'
                            }
                          },
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        x: {
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            font: {
                              family: 'monospace'
                            }
                          }
                        }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                      },
                      interaction: {
                        intersect: false,
                        mode: 'index'
                      }
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full brutalist-card bg-[#B8D8E3]/20 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Section - Updated */}
        <section className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50K+", label: "Active Students", bg: "bg-[#FFE2E0]" },
                { number: "1M+", label: "Tests Generated", bg: "bg-[#E0F4FF]" },
                { number: "98%", label: "Success Rate", bg: "bg-[#E5FFE0]" },
                { number: "24/7", label: "AI Support", bg: "bg-[#FFE8D6]" }
              ].map((stat) => (
                <div key={stat.label} className={`brutalist-card ${stat.bg} p-6 text-center hover:transform hover:scale-105 transition-transform`}>
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="font-mono text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Updated */}
        <section id="features" className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="brutalist-card bg-[#B8D8E3] p-8 hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#AED2E6] rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">AI Test Generation</h2>
                </div>
                <p className="font-mono">
                  Generate comprehensive tests from your resources and our knowledge base. Create multiple choice, essay, and coding questions with detailed explanations.
                </p>
              </div>

              <div className="brutalist-card bg-[#F7CAC9] p-8 hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#FFB5B5] rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Smart Tutoring</h2>
                </div>
                <p className="font-mono">
                  Get 24/7 personalized assistance with step-by-step explanations, concept breakdowns, and real-time feedback from our AI tutor.
                </p>
              </div>

              <div className="brutalist-card bg-[#F6E6B4] p-8 hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#FFE5B4] rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Resource Management</h2>
                </div>
                <p className="font-mono">
                  Upload, organize, and tag your learning materials. Our AI will automatically categorize and link related resources for efficient studying.
                </p>
              </div>

              <div className="brutalist-card bg-[#C3E6CB] p-8 hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#B4E4B4] rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Progress Tracking</h2>
                </div>
                <p className="font-mono">
                  Monitor your learning journey with detailed analytics, performance trends, and personalized recommendations for improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Study Tools Showcase - Updated */}
        <section className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Smart Study Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#AED2E6] to-[#E0F4FF] rounded-3xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-[#E5FFE0]/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-[#AED2E6] to-[#B8D8E3] rounded-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Smart Flashcards</h3>
                      <p className="font-mono text-gray-600">AI-generated flashcards that adapt to your learning style and progress</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB5B5] to-[#FFE2E0] rounded-3xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-[#E5FFE0]/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-[#FFB5B5] to-[#F7CAC9] rounded-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Practice Quizzes</h3>
                      <p className="font-mono text-gray-600">Instant quizzes generated from your notes with detailed explanations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B4E4B4] to-[#E5FFE0] rounded-3xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-[#E5FFE0]/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-[#B4E4B4] to-[#C3E6CB] rounded-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Study Guides</h3>
                      <p className="font-mono text-gray-600">Personalized study guides that highlight key concepts and knowledge gaps</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE5B4] to-[#FFE8D6] rounded-3xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-[#E5FFE0]/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-[#FFE5B4] to-[#F6E6B4] rounded-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
                      <p className="font-mono text-gray-600">Visual insights into your learning journey and improvement areas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Updated */}
        <section className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Student Success Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah K.",
                  role: "Medical Student",
                  image: "/testimonial1.jpg",
                  quote: "Turing AI helped me ace my MCAT. The personalized practice tests were game-changing!",
                  bg: "bg-[#E0F4FF]"
                },
                {
                  name: "James L.",
                  role: "Computer Science Major",
                  image: "/testimonial2.jpg",
                  quote: "The AI tutor is like having a personal professor available 24/7. Incredible resource!",
                  bg: "bg-[#FFE2E0]"
                },
                {
                  name: "Maria R.",
                  role: "High School Senior",
                  image: "/testimonial3.jpg",
                  quote: "My SAT scores improved by 200 points using Turing AI's practice tests!",
                  bg: "bg-[#E5FFE0]"
                }
              ].map((testimonial) => (
                <div key={testimonial.name} className={`brutalist-card ${testimonial.bg} p-8 hover:transform hover:scale-105 transition-transform`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <p className="font-mono text-gray-600 mb-4">"{testimonial.quote}"</p>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Updated */}
        <section className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="brutalist-card bg-white p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
              <p className="font-mono text-xl text-gray-600 mb-8">
                Join thousands of students achieving their academic goals with AI-powered learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="brutalist-button px-8 py-4 text-lg font-bold bg-[#AED2E6] hover:bg-[#9BC3DB]">
                  Start Free Trial
                </button>
                <button className="brutalist-button px-8 py-4 text-lg font-bold bg-[#FFB5B5] hover:bg-[#FFA3A3]">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Logos - Updated */}
        <section className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center font-mono text-gray-600 mb-8">Trusted by leading educational institutions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">
              {/* Add your integration/partner logos here */}
              {/* Example placeholder divs for logos */}
              <div className="h-12 bg-white/50 rounded flex items-center justify-center">Logo 1</div>
              <div className="h-12 bg-white/50 rounded flex items-center justify-center">Logo 2</div>
              <div className="h-12 bg-white/50 rounded flex items-center justify-center">Logo 3</div>
              <div className="h-12 bg-white/50 rounded flex items-center justify-center">Logo 4</div>
            </div>
          </div>
        </section>

        {/* How it Works Section - Updated */}
        <section className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="brutalist-card bg-[#E0F4FF] p-8 aspect-square flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold mb-4">1</div>
                  <h3 className="text-xl font-bold mb-4">Upload Resources</h3>
                  <p className="font-mono">Add your learning materials and define your goals</p>
                </div>
              </div>
              <div className="text-center">
                <div className="brutalist-card bg-[#FFE2E0] p-8 aspect-square flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold mb-4">2</div>
                  <h3 className="text-xl font-bold mb-4">AI Analysis</h3>
                  <p className="font-mono">Our AI processes and understands your content</p>
                </div>
              </div>
              <div className="text-center">
                <div className="brutalist-card bg-[#E5FFE0] p-8 aspect-square flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold mb-4">3</div>
                  <h3 className="text-xl font-bold mb-4">Generate & Learn</h3>
                  <p className="font-mono">Get personalized tests and tutoring assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Updated */}
        <section id="pricing" className="py-24 bg-[#FFE8D6]/90">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="brutalist-card bg-white p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">$0<span className="text-xl">/mo</span></div>
                <ul className="space-y-4 mb-8 font-mono">
                  <li>✓ 50 AI Test Generations</li>
                  <li>✓ Basic Tutoring Support</li>
                  <li>✓ 1GB Resource Storage</li>
                  <li>✓ Community Access</li>
                </ul>
                <button onClick={() => localStorage.getItem('authToken') ? router.push('/home') : router.push('/signin')} className="brutalist-button w-full py-3 bg-white">Get Started</button>
              </div>

              <div className="brutalist-card bg-[#B8D8E3] p-8 transform -translate-y-4">
                <div className="font-bold text-sm mb-2 text-gray-700">MOST POPULAR</div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">$19<span className="text-xl">/mo</span></div>
                <ul className="space-y-4 mb-8 font-mono">
                  <li>✓ Unlimited Test Generation</li>
                  <li>✓ Advanced Tutoring</li>
                  <li>✓ 10GB Storage</li>
                  <li>✓ Priority Support</li>
                </ul>
                <button className="brutalist-button w-full py-3 bg-white">Upgrade to Pro</button>
              </div>

              <div className="brutalist-card bg-[#F7CAC9] p-8">
                <h3 className="text-2xl font-bold mb-2">Team</h3>
                <div className="text-4xl font-bold mb-4">$49<span className="text-xl">/mo</span></div>
                <ul className="space-y-4 mb-8 font-mono">
                  <li>✓ Everything in Pro</li>
                  <li>✓ Team Collaboration</li>
                  <li>✓ 100GB Storage</li>
                  <li>✓ Custom Integration</li>
                </ul>
                <button className="brutalist-button w-full py-3 bg-white">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Updated */}
        <footer className="bg-[#333333] text-white py-16 relative">
          <div className="absolute inset-0 pattern-grid opacity-10"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">TURING AI</h3>
                <p className="font-mono text-sm text-gray-400">
                  Transforming education through intelligent test generation and personalized tutoring.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 font-mono text-sm text-gray-400">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Use Cases</li>
                  <li>Documentation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 font-mono text-sm text-gray-400">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 font-mono text-sm text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-12 pt-8 text-center font-mono text-sm text-gray-400">
              © 2024 Turing AI. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
