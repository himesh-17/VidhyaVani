"use client";

import { Gavel, AlertCircle, FileCheck, Ban, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
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
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4 z-0"
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
                            <Gavel className="h-4 w-4 text-blue-300" />
                            <span className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Usage Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight font-serif">
                            Terms and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Conditions</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                            Please read these terms carefully before using our services.
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
                                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and our institution, concerning your access to and use of our website and services.
                            </p>
                        </motion.div>

                        <div className="grid gap-12 mt-12">
                            {[
                                {
                                    icon: FileCheck,
                                    title: "Acceptance of Terms",
                                    content: "By accessing the site, you acknowledge that you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the site and you must discontinue use immediately."
                                },
                                {
                                    icon: Sparkles,
                                    title: "Intellectual Property Rights",
                                    content: "Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the 'Content') and the trademarks, service marks, and logos contained therein (the 'Marks') are owned or controlled by us or licensed to us."
                                },
                                {
                                    icon: Ban,
                                    title: "Prohibited Activities",
                                    content: "You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include systematic retrieval of data, tricking or misleading us or other users, and interfering with security features."
                                },
                                {
                                    icon: AlertCircle,
                                    title: "Modifications and Interruptions",
                                    content: "We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site."
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
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
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
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Last Updated</h4>
                            <p className="text-slate-600 mb-0">
                                We may update these terms from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. <br />
                                <span className="font-semibold text-slate-800">Last Revised: December 2025</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
