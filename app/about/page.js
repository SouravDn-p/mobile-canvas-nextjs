"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  const [activeSection, setActiveSection] = useState("story");
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    countries: 0,
    years: 0,
  });

  // Animated counters
  useEffect(() => {
    const targets = {
      customers: 50000,
      products: 1200,
      countries: 25,
      years: 8,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = Object.keys(targets).map((key) => {
      const target = targets[key];
      const increment = target / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals.find((interval) => interval === this));
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, stepDuration);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Visionary leader with 15+ years in tech industry",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Tech innovator passionate about mobile technology",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Design",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Creative designer focused on user experience",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Emily Davis",
      role: "VP of Operations",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Operations expert ensuring seamless customer experience",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const milestones = [
    {
      year: "2016",
      title: "Company Founded",
      description:
        "Started with a vision to make premium tech accessible to everyone",
      icon: "🚀",
    },
    {
      year: "2018",
      title: "First 1000 Customers",
      description:
        "Reached our first major milestone with exceptional customer satisfaction",
      icon: "🎯",
    },
    {
      year: "2020",
      title: "Global Expansion",
      description: "Expanded operations to serve customers across 25 countries",
      icon: "🌍",
    },
    {
      year: "2022",
      title: "Innovation Award",
      description:
        "Recognized as 'Best Mobile Retailer' by Tech Excellence Awards",
      icon: "🏆",
    },
    {
      year: "2024",
      title: "50K+ Happy Customers",
      description: "Celebrating our growing community of satisfied customers",
      icon: "❤️",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly seek cutting-edge technology to bring you the latest and greatest products.",
      icon: "💡",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Quality",
      description:
        "Every product we offer meets our rigorous standards for performance and reliability.",
      icon: "⭐",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We're here to support you every step of the way.",
      icon: "🤝",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Sustainability",
      description:
        "We're committed to responsible business practices and environmental stewardship.",
      icon: "🌱",
      color: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                About{" "}
                <span className="text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text">
                  Mobile Canvas
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Pioneering the future of mobile technology with premium devices
                and exceptional customer experiences
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counters.customers.toLocaleString()}+
                </div>
                <div className="text-indigo-300 font-semibold">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counters.products.toLocaleString()}+
                </div>
                <div className="text-purple-300 font-semibold">Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counters.countries}+
                </div>
                <div className="text-pink-300 font-semibold">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counters.years}+
                </div>
                <div className="text-green-300 font-semibold">
                  Years Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-2 border border-gray-700">
              <div className="flex space-x-2">
                {[
                  { id: "story", label: "Our Story", icon: "📖" },
                  { id: "team", label: "Our Team", icon: "👥" },
                  { id: "values", label: "Our Values", icon: "💎" },
                  { id: "timeline", label: "Timeline", icon: "⏰" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeSection === tab.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Our Story */}
          {activeSection === "story" && (
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">Our Story</h2>
                <p className="text-xl text-gray-300">
                  From a small startup to a global leader in mobile technology
                  retail
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">
                    The Beginning
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Mobile Canvas was born from a simple belief: everyone
                    deserves access to the latest technology without compromise.
                    Founded in 2016 by a team of tech enthusiasts, we started
                    with a mission to bridge the gap between cutting-edge
                    innovation and everyday accessibility.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    What began as a small online store has evolved into a
                    trusted global platform, serving customers across 25
                    countries with a carefully curated selection of premium
                    mobile devices, tablets, laptops, and accessories.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Mobile Canvas Office"
                      width={400}
                      height={300}
                      className="rounded-xl w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Team Working"
                      width={400}
                      height={300}
                      className="rounded-xl w-full"
                    />
                  </div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-2xl font-bold text-white">
                    Our Mission Today
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Today, we continue to push boundaries by partnering with
                    leading manufacturers to bring you the most innovative
                    products at competitive prices. Our commitment to quality,
                    customer service, and technological advancement remains
                    unwavering.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    We're not just a retailer – we're your technology partner,
                    helping you stay connected, productive, and entertained with
                    the devices that matter most to your life.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Our Team */}
          {activeSection === "team" && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">Meet Our Team</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  The passionate individuals behind Mobile Canvas who make
                  everything possible
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="relative rounded-full w-full h-full object-cover border-4 border-gray-700 group-hover:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {member.name}
                        </h3>
                        <p className="text-indigo-400 font-semibold">
                          {member.role}
                        </p>
                        <p className="text-gray-300 text-sm mt-2">
                          {member.bio}
                        </p>
                      </div>
                      <div className="flex justify-center space-x-3">
                        <a
                          href={member.social.linkedin}
                          className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                          <span className="text-white text-sm">in</span>
                        </a>
                        <a
                          href={member.social.twitter}
                          className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                        >
                          <span className="text-white text-sm">tw</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Our Values */}
          {activeSection === "values" && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">Our Values</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  The core principles that guide everything we do at Mobile
                  Canvas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        {value.icon}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">
                          {value.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeSection === "timeline" && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">Our Journey</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Key milestones that shaped Mobile Canvas into what it is today
                </p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>

                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-1/2 ${
                          index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                        }`}
                      >
                        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                          <div className="space-y-3">
                            <div className="text-3xl">{milestone.icon}</div>
                            <div className="text-2xl font-bold text-indigo-400">
                              {milestone.year}
                            </div>
                            <h3 className="text-xl font-bold text-white">
                              {milestone.title}
                            </h3>
                            <p className="text-gray-300">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="relative z-10 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border-4 border-gray-900 flex-shrink-0"></div>

                      <div className="w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-12 text-center space-y-8 border border-gray-700">
            <h2 className="text-4xl font-bold text-white">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Mobile Canvas for
              their technology needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
