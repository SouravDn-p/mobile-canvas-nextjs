"use client";

import Image from "next/image";
import { Award, Heart, Shield, Zap, Target, CheckCircle } from "lucide-react";
import rahimImage from "@/public/rahim.jpg"; // Adjust the path as necessary
export default function AboutUs() {
  const coreValues = [
    {
      id: 1,
      icon: Heart,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-500/20 to-pink-500/20",
    },
    {
      id: 2,
      icon: Shield,
      title: "Trust & Security",
      description:
        "Your data and transactions are protected with industry-leading security measures and encryption.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 3,
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously evolve and innovate to bring you the latest technology and best user experience.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
    },
    {
      id: 4,
      icon: Target,
      title: "Excellence",
      description:
        "We strive for excellence in every product, service, and interaction with our valued customers.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            About Mobile Canvas
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Connecting people through innovative mobile technology and
            exceptional service since 2020
          </p>
        </div>

        {/* Owner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Owner Photo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                <Image
                  src={rahimImage}
                  alt="CEO & Founder"
                  width={300}
                  height={300}
                  className="relative rounded-full mx-auto border-4 border-gradient-to-r from-blue-500 to-purple-500"
                />
                {/* Experience Badge */}
                {/* <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  <Award className="h-4 w-4 inline mr-1" />
                  5+ Years
                </div> */}
              </div>
            </div>
          </div>
          {/* Owner Story */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Meet Our Founder
              </h3>
              <p className="text-blue-400 font-semibold text-lg">
                Rahim Khan, Owner & Shopkeeper
              </p>
            </div>

            <blockquote className="text-lg sm:text-xl text-gray-300 italic border-l-4 border-blue-500 pl-6 py-4 bg-gray-800/30 rounded-r-lg">
              &quot;We believe technology should be simple and helpful for
              everyone in our community. Mobile Canvas is here to serve our
              neighbors with honest advice and reliable service.&quot;
            </blockquote>

            <div className="space-y-4 text-gray-300">
              <p>
                Mobile Canvas began as a small local shop in Bangladesh, founded
                by Rahim to help people with their mobile devices.
              </p>
              <p>
                We offer phones, accessories, and repairs—always with honest
                advice and friendly service.
              </p>
              <p>
                As we grow, our focus remains on friendly service, fair prices,
                and honest advice. We welcome everyone to visit our shop and
                experience the Mobile Canvas difference.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Our Core Values
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do and shape the way we serve
              our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.id}
                  className="group relative"
                  // Remove onMouseEnter and onMouseLeave
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                    style={{
                      background: `linear-gradient(to right, ${
                        value.color.split(" ")[1]
                      }, ${value.color.split(" ")[3]})`,
                    }}
                  ></div>

                  <div
                    className={`relative h-full p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:border-gray-600/50 hover:bg-gradient-to-br hover:${value.bgColor} hover:border-opacity-100 bg-gray-800/50`}
                  >
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h4 className="text-xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-blue-400">
                      {value.title}
                    </h4>

                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-green-400 mb-4">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">
              Join thousands of satisfied customers
            </span>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Experience the Mobile Canvas difference today and discover why
            we&apos;re the trusted choice for mobile technology solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
