"use client";

import { Cookie, Settings, Info, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CookiePolicyPage() {
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
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4 z-0"
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
                            <Cookie className="h-4 w-4 text-amber-300" />
                            <span className="text-sm font-semibold text-amber-100 uppercase tracking-wide">Transparency First</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight font-serif">
                            Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">Policy</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                            Understanding how and why we use cookies on our platform.
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
                                This Cookie Policy explains what cookies are and how we use them. You should read this policy so you can understand what type of cookies we use, the information we collect using cookies, and how that information is used.
                            </p>
                        </motion.div>

                        <div className="grid gap-12 mt-12">
                            {[
                                {
                                    icon: Info,
                                    title: "What are Cookies?",
                                    content: "Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide reporting information."
                                },
                                {
                                    icon: Settings,
                                    title: "How We Use Cookies",
                                    content: "We use cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as 'essential' or 'strictly necessary' cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties."
                                },
                                {
                                    icon: CheckCircle,
                                    title: "Types of Cookies We Use",
                                    content: "Essential Cookies: Strictly necessary for the website to function. Performance Cookies: Allow us to count visits and traffic sources. Functional Cookies: Enable the website to provide enhanced functionality and personalization."
                                },
                                {
                                    icon: Settings,
                                    title: "Managing Cookies",
                                    content: "You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted."
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
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
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
                            className="mt-16 p-8 bg-amber-50/50 rounded-2xl border border-amber-100"
                        >
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Consent</h4>
                            <p className="text-slate-600 mb-0">
                                By using our website, you adhere to this usage of cookies. For more details on how to manage your preferences, please consult your browser help menu.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
