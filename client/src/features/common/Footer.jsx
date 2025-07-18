import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div>
                        <h3 className="text-xl font-bold mb-3">BuyHive</h3>
                        <p className="text-sm text-gray-300">
                            Your trusted online marketplace for discovering, buying, and selling quality products. Shop with confidence and enjoy seamless experiences every time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#profile" className="hover:text-white transition">Profile</a></li>
                            <li><a href="#skills" className="hover:text-white transition">Skills</a></li>
                            <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="https://github.com/" target="_blank" rel="noreferrer"
                                className="text-gray-400 hover:text-white transition text-xl">
                                <FaGithub />
                            </a>
                            <a href="https://linkedin.com/" target="_blank" rel="noreferrer"
                                className="text-gray-400 hover:text-white transition text-xl">
                                <FaLinkedin />
                            </a>
                            <a href="https://twitter.com/" target="_blank" rel="noreferrer"
                                className="text-gray-400 hover:text-white transition text-xl">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
                    Made with <FaHeart className="inline text-red-500 mx-1" /> &copy; {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
