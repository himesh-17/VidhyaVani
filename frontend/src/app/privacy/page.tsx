"use client";

import { Shield, Lock, Eye, FileText, Server, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative bg-slate-900 text-white py-24 overflow-hidden min-h-[50vh] flex items-center">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/institute.jpg"
                        alt="Institute Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/70 via-indigo-900/50 to-purple-900/30 backdrop-blur-[1px]" />
                </div>

                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-fixed bg-center mix-blend-overlay z-0" />

                {/* Animated Background Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4 z-0"
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
                            <Shield className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm font-semibold text-emerald-100 uppercase tracking-wide">Your Data is Secure</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight font-serif">
                            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Policy</span>
                        </h1>
                        <p className="text-xl text-indigo-100/90 max-w-2xl mx-auto leading-relaxed font-light">
                            We are committed to protecting your personal information and your right to privacy.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg prose-slate mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <p className="lead">
                                This Privacy Policy explains how our institution collects, uses, and discloses your personal information when you use our platform. By accessing or using our services, you consent to the data practices described in this policy.
                            </p>
                        </motion.div>

                        <div className="grid gap-12 mt-12">
                            {[
                                {
                                    icon: Eye,
                                    title: "Information We Collect",
                                    content: "We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us. This may include names, email addresses, and student/faculty IDs."
                                },
                                {
                                    icon: Server,
                                    title: "How We Use Your Information",
                                    content: "We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations."
                                },
                                {
                                    icon: Lock,
                                    title: "Data Security",
                                    content: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk."
                                },
                                {
                                    icon: FileText,
                                    title: "Your Privacy Rights",
                                    content: "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. You may review, change, or terminate your account at any time."
                                }
                            ].map((section, index) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <section.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">{section.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{section.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200"
                        >
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Contact Us</h4>
                            <p className="text-slate-600 mb-0">
                                If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@institution.edu" className="text-indigo-600 hover:underline">help@mitsgwl.ac.in</a>.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
