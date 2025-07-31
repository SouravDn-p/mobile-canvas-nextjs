import {
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Warranty", href: "/warranty" },
      { name: "Track Order", href: "/track" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Partnerships", href: "/partnerships" },
      { name: "Investors", href: "/investors" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
      { name: "Accessibility", href: "/accessibility" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/MobileCanvas",
    },
    {
      name: "Twitter",
      icon: X,
      href: "https://twitter.com/MobileCanvas",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/MobileCanvas",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/MobileCanvas",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 text-sm">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6 text-center">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5 flex flex-col items-center text-left">
            <Link href="/" className="flex items-center space-x-3">
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
            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto text-left">
              Your trusted destination for premium gadgets and cutting-edge
              technology.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-gray-400 text-left">
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>mobileCanvas@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Tech Street, Silicon Valley, CA</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass border border-white/10 hover:border-green-500/30 group"
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-white font-semibold capitalize">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 text-center">
          <div className="text-gray-400">
            © {currentYear} MobileCanvas. All rights reserved.
          </div>
          <div className="flex items-center flex-wrap gap-2 justify-center">
            <span className="text-gray-400">We accept:</span>
            <div className="flex overflow-x-auto gap-2">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                <div
                  key={method}
                  className="px-2 py-1 glass rounded border border-white/10 text-xs text-gray-400 whitespace-nowrap"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
