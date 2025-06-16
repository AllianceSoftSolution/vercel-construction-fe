import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaTiktok } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-[#02214D] text-white mt-10 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Top Footer Section */}
                <div className="grid md:grid-cols-5 gap-6 text-sm">
                    {/* Column 1 - Get Involved */}
                    <div>
                        <h3 className="font-semibold mb-2">Get Involved</h3>
                        <ul className="space-y-1">
                            <li>Careers</li>
                            <li>Archer Gives</li>
                            <li>Become an Affiliate</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>

                    {/* Column 2 - Company */}
                    <div>
                        <h3 className="font-semibold mb-2">Company</h3>
                        <ul className="space-y-1">
                            <li>Social Learning</li>
                            <li>Awards and Media</li>
                        </ul>
                    </div>

                    {/* Column 3 - Medical */}
                    <div>
                        <h3 className="font-semibold mb-2">Medical</h3>
                        <ul className="space-y-1">
                            <li>USMLE Step 1</li>
                            <li>USMLE Step 2 CK</li>
                            <li>USMLE Step 3</li>
                        </ul>
                    </div>

                    {/* Column 4 - Nursing */}
                    <div>
                        <h3 className="font-semibold mb-2">Nursing</h3>
                        <ul className="space-y-1">
                            <li>TEAS 7</li>
                            <li>Nursing School</li>
                            <li>NCLEX-RN®</li>
                            <li>NCLEX-PN®</li>
                            <li>FNP</li>
                        </ul>
                    </div>

                    {/* Column 5 - Educators */}
                    <div>
                        <h3 className="font-semibold mb-2">Educators</h3>
                        <ul className="space-y-1">
                            <li>For NCLEX</li>
                            <li>For Nursing School</li>
                        </ul>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-8">
                    <h3 className="font-semibold mb-2">Contact Us</h3>
                    <ul className="text-sm space-y-1">
                        <li>📧 support@nurseinsight.com</li>
                        <li>🏢 Nurse Insight, LLC</li>
                        <li>📍 539 W Commerce Street #6075, Dallas, TX 75208</li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Follow Us</h3>
                    <div className="flex space-x-3">
                        <FaFacebookF className="text-white text-xl cursor-pointer hover:text-gray-300" />
                        <FaInstagram className="text-white text-xl cursor-pointer hover:text-gray-300" />
                        <FaLinkedinIn className="text-white text-xl cursor-pointer hover:text-gray-300" />
                        <FaXTwitter className="text-white text-xl cursor-pointer hover:text-gray-300" />
                        <FaTiktok className="text-white text-xl cursor-pointer hover:text-gray-300" />
                    </div>
                </div>

                {/* Disclaimer Section */}
                <div className="mt-10 text-xs text-gray-300 border-t border-gray-600 pt-6">
                    <p className="text-center">
                        * First-time users of Nurse Insight must achieve high or very high scores in four consecutive readiness assessments prior to taking the NCLEX.
                    </p>
                    <p className="mt-4 text-justify leading-relaxed">
                        Archer Review is an independent resource offering educational materials and preparation resources for examinations including the United States Medical Licensing Examination (USMLE), the National Council Licensure Examination (NCLEX), Family Nurse Practitioner (FNP) certification programs, and the Test of Essential Academic Skills (TEAS). Archer Review is not affiliated with, sponsored by, or endorsed by any of the respective owners of the aforementioned trademarks. All trademarks mentioned on this website are the property of their respective owners and are used on this site for the purpose of reference only. Please refer to the official testing organizations for the most accurate and current information related to these examinations and certifications. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                    </p>
                </div>

                {/* Bottom Footer Section */}
                <div className="mt-6 flex flex-col md:flex-row justify-between text-xs text-gray-400 border-t border-gray-600 pt-4">
                    <p>© 2024 Archer Review LLC</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-200">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-200">Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
