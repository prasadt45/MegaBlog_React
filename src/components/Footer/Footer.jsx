import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center sm:items-start">
            <Logo width="120px" />
            <p className="mt-4 text-sm text-gray-200">
              &copy; 2023 All Rights Reserved by DevUI.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Company</h3>
            <ul>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Features</Link>
              </li>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Pricing</Link>
              </li>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Affiliate Program</Link>
              </li>
              <li>
                <Link className="text-gray-200 hover:text-gray-300" to="/">Press Kit</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Support</h3>
            <ul>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Account</Link>
              </li>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Help</Link>
              </li>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Contact Us</Link>
              </li>
              <li>
                <Link className="text-gray-200 hover:text-gray-300" to="/">Customer Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Legals</h3>
            <ul>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Terms & Conditions</Link>
              </li>
              <li className="mb-4">
                <Link className="text-gray-200 hover:text-gray-300" to="/">Privacy Policy</Link>
              </li>
              <li>
                <Link className="text-gray-200 hover:text-gray-300" to="/">Licensing</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-gray-300 py-6 mt-12 text-center text-gray-200">
        <p>&copy; 2023 DevUI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
