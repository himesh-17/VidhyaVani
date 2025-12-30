import Link from "next/link";
import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react";
import logo from "../../../public/logo-white.png";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                                {/* <BookOpen className="h-5 w-5 text-white" /> */}
                                <img src="/icon.jpg" alt="VidyaVani Logo" className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">VidyaVani</span>
                        </Link>
                        <p className="text-sm text-slate-600">
                            A modern institutional blogging platform for students, faculty, and administrators.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://x.com/mitsgwl" className="text-slate-400 hover:text-indigo-600 transition-colors" target="_blank">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors" target="_blank">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors" target="_blank">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="https://web.mitsgwalior.in/index.php/contact-us" className="text-slate-400 hover:text-indigo-600 transition-colors" target="_blank">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/blogs" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    Browse Blogs
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    Upcoming Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/register" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    Join Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="https://owl.purdue.edu/owl/general_writing/index.html" target="_blank" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    Writing Guidelines
                                </a>
                            </li>
                            <li>
                                <a href="https://nextjs.org/docs" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors" target="_blank">
                                    API Documentation
                                </a>
                            </li>
                            <li>
                                <a href="https://web.mitsgwalior.in/index.php/frequently-asked-questions-faqs" target="_blank" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="https://web.mitsgwalior.in/index.php/contact-us" target="blank" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Institution */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Institution</h3>
                        <ul className="space-y-3">
                            <li className="text-sm text-slate-600">
                                Madhav Insttitute Of Technology and Science
                            </li>
                            <li className="text-sm text-slate-600">
                                Gwalior, MP 474001
                            </li>
                            <li>
                                <a href="mailto:contact@institution.edu" className="text-sm text-indigo-600 hover:underline">
                                    help@mitsgwl.ac.in
                                </a>
                            </li>
                            <li className="text-sm text-slate-600">
                                +91-751-240-9300 / +91-751-240-9354.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} VidyaVani. All rights reserved.
                        <br />
                        <b> Developed by <a href="https://www.linkedin.com/in/himesh-badlani-03778b322/" target="_blank">Himesh Badlani (BTEO24O1019)</a> and
                            <a href="https://www.linkedin.com/in/ojaswi-anand-sharma-7080b434a/" target="_blank"> Ojaswi Anand Sharma (BTEO24O1035)</a></b>


                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
