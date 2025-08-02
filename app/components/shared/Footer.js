import {
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/MobileCanvas",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/MobileCanvas",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:w-1/3">
            <Link href="/" className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-xl">
                <Image
                  src={logo}
                  alt="Mobile Canvas Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mobile Canvas
              </span>
            </Link>
            <p className="text-gray-400 text-center md:text-left max-w-xs">
              Local mobile shop in Bangladesh. Honest service, fair prices.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 hover:border-green-500/30 group"
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start space-y-2 md:w-1/3">
            <h4 className="text-white font-semibold capitalize mb-2 text-center md:text-left">
              Contact Us
            </h4>
            <div className="space-y-2 text-gray-400 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="w-4 h-4" />
                <span>+880 1780599798</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="w-4 h-4" />
                <span>mobilecanvas01@gmail.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Shop #12, Sarail , Brahmanbaria, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col items-center md:items-start space-y-2 md:w-1/3">
            <h4 className="text-white font-semibold capitalize mb-2 text-center md:text-left">
              Business Hours
            </h4>
            <div className="space-y-2 text-gray-400 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Sat-Thu: 10:00 AM - 8:00 PM</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Friday: Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 text-center">
          <div className="text-gray-400">
            © {currentYear} Mobile Canvas. All rights reserved.
          </div>
          <div className="text-gray-400 text-xs">
            Developed by{" "}
            <a target="_blank" href="https://sourav-debnath-sd246.vercel.app">
              <span className="text-green-400 font-semibold">
                Sourav Debnath
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
