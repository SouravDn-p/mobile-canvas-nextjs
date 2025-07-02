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
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Smartphones", href: "/products?category=smartphones" },
      { name: "Tablets", href: "/products?category=tablets" },
      { name: "Laptops", href: "/products?category=laptops" },
      { name: "Audio", href: "/products?category=audio" },
      { name: "Wearables", href: "/products?category=wearables" },
    ],
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
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className=" rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                <Image
                  src={logo}
                  alt="Mobile Canvas Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <span
                className={` text-xl tracking-tight transition-all duration-300  font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent
                }`}
              >
                Mobile Canvas
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Your trusted destination for premium gadgets and cutting-edge
              technology. Discover the future of tech with us.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">mobileCanvas@gmail .com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  123 Tech Street, Silicon Valley, CA
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg glass border border-white/10 hover:border-green-500/30 transition-colors group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} MobileCanvas. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We accept:</span>
              <div className="flex space-x-2">
                {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                  <div
                    key={method}
                    className="px-2 py-1 glass rounded border border-white/10 text-xs text-gray-400"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
