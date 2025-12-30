"use client";

import { BookOpen, Target, Users, Mail, Phone, MapPin, Award, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative bg-slate-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-fixed bg-center" />

                {/* Animated Background Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4"
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
                            <Sparkles className="h-4 w-4 text-indigo-300" />
                            <span className="text-sm font-semibold text-indigo-100 uppercase tracking-wide">Building the Future of Learning</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight font-serif">
                            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Academic Excellence</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100/90 max-w-3xl mx-auto leading-relaxed font-light">
                            A platform designed to foster collaboration, knowledge sharing, and continuous growth for students and faculty alike.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-[2.5rem] p-12 border border-indigo-50 hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Target className="h-40 w-40 text-indigo-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Target className="h-8 w-8" />
                                </div>
                                <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">Our Mission</h2>
                                <p className="text-xl text-slate-600 leading-relaxed">
                                    To provide a modern, accessible platform that enables academic excellence through knowledge sharing.
                                    We believe every student has valuable insights to share, and every idea deserves to be heard.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-[2.5rem] p-12 border border-emerald-50 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="h-40 w-40 text-emerald-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                                <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">Our Vision</h2>
                                <p className="text-xl text-slate-600 leading-relaxed">
                                    To become the leading institutional platform for academic publishing, fostering a culture of
                                    continuous learning and collaborative growth across educational institutions worldwide.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">Our Core Values</h2>
                        <p className="text-xl text-slate-600">These principles guide every decision we make and help us maintain a high standard of academic integrity.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Award, color: "indigo", title: "Excellence", delay: 0 },
                            { icon: Users, color: "purple", title: "Community", delay: 0.1 },
                            { icon: Heart, color: "emerald", title: "Integrity", delay: 0.2 },
                            { icon: Target, color: "amber", title: "Innovation", delay: 0.3 },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: item.delay, duration: 0.5 }}
                                className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 group"
                            >
                                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-${item.color}-50 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`h-10 w-10 text-${item.color}-600`} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {i === 0 && "Striving for the highest quality in every action and interaction."}
                                    {i === 1 && "Building strong, supportive connections through shared knowledge."}
                                    {i === 2 && "Maintaining honesty, transparency, and ethics in all we do."}
                                    {i === 3 && "Continuously improving and embracing new perspectives."}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[3rem] p-8 md:p-20 overflow-hidden relative shadow-2xl shadow-indigo-900/20 text-center"
                    >
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 font-serif">Get In Touch</h2>
                            <div className="grid md:grid-cols-3 gap-12">
                                <div className="text-white/80 hover:text-white transition-colors group">
                                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                        <MapPin className="h-8 w-8 text-indigo-200 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-white">Visit Us</h3>
                                    <p className="text-indigo-100">Gole Ka Mandir<br />Gwalior, Mp 474001</p>
                                </div>
                                <div className="text-white/80 hover:text-white transition-colors group">
                                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                        <Mail className="h-8 w-8 text-indigo-200 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-white">Email</h3>
                                    <a href="mailto:help@mitsgwl.ac.in" className="text-indigo-100 hover:text-white transition-colors font-medium text-lg">help@mitsgwl.ac.in</a>
                                </div>
                                <div className="text-white/80 hover:text-white transition-colors group">
                                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                        <Phone className="h-8 w-8 text-indigo-200 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-white">Call</h3>
                                    <p className="text-indigo-100 font-medium text-lg">+91-751-240-9300</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
