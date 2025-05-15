import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-300 via-blue-300 to-blue-300 text-blue-900 pt-12 pb-6   shadow-inner border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center sm:items-start">
            <Logo width="120px" />
            <p className="mt-4 text-sm text-blue-800">
              &copy; 2025 All Rights Reserved by BlueCare.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-950 mb-4">Company</h3>
            <ul>
              {["Features", "Pricing", "Affiliate Program", "Press Kit"].map((item) => (
                <li key={item} className="mb-2">
                  <Link
                    to="/"
                    className="text-blue-800 hover:text-blue-950 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-950 mb-4">Support</h3>
            <ul>
              {["Account", "Help", "Contact Us", "Customer Support"].map((item) => (
                <li key={item} className="mb-2">
                  <Link
                    to="/"
                    className="text-blue-800 hover:text-blue-950 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-950 mb-4">Legals</h3>
            <ul>
              {["Terms & Conditions", "Privacy Policy", "Licensing"].map((item) => (
                <li key={item} className="mb-2">
                  <Link
                    to="/"
                    className="text-blue-800 hover:text-blue-950 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-blue-300 mt-12 pt-6 text-center text-sm text-blue-800">
        <p>&copy; 2025 BlueCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
