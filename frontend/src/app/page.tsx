"use client";

import Link from "next/link";
import { BookOpen, Calendar, Users, ArrowRight, CheckCircle, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center text-white">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/institute.jpg"
            alt="MITS Gwalior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/70 via-indigo-900/50 to-purple-900/30 backdrop-blur-[1px]" />
        </div>

        {/* Decorative Patterns */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow z-0 mix-blend-overlay" />

        {/* Floating Background Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl z-0"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl z-0"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm mb-6 border border-white/20 shadow-xl">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-indigo-50 font-medium tracking-wide">Estd. 1957 • Gwalior, India</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-serif tracking-tight drop-shadow-2xl">
              Madhav Institute of Technology & Science
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl mt-4 block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 font-light">
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-indigo-50 mb-10 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-md">
              <strong className="font-semibold text-white">VidyaVani</strong> — The Official Editorial & Events Platform. A dynamic space for students and faculty to publish articles, manage events, and showcase academic brilliance.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-950 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-1"
              >
                Start Blogging
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 border border-white/20 hover:border-white/40 shadow-lg"
              >
                Explore Blogs
              </Link>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-sm md:text-base text-indigo-200/80 max-w-3xl mx-auto font-light border-t border-white/10 pt-8 mt-2">
              A legacy of academic rigor, modern research, and continuous industry engagement — shaping engineers for tomorrow.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Everything You Need to Succeed
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform provides all the tools for academic publishing and community engagement.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BookOpen,
                title: "Rich Blog Editor",
                description: "Create beautiful articles with our powerful rich text editor. Customize fonts, colors, and themes to match your style.",
                color: "from-indigo-500 to-purple-500",
                shadow: "shadow-indigo-500/10"
              },
              {
                icon: CheckCircle,
                title: "Faculty Review",
                description: "All submissions go through faculty review to ensure quality and academic standards are maintained.",
                color: "from-emerald-500 to-teal-500",
                shadow: "shadow-emerald-500/10"
              },
              {
                icon: Calendar,
                title: "Events Management",
                description: "Stay updated with institutional events, seminars, and workshops. Never miss an important date.",
                color: "from-orange-500 to-amber-500",
                shadow: "shadow-orange-500/10"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className={`bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 transition-shadow duration-300 hover:shadow-xl ${feature.shadow}`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-6 text-white shadow-lg`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { count: "500+", label: "Published Articles", color: "text-indigo-600" },
              { count: "200+", label: "Active Writers", color: "text-purple-600" },
              { count: "50+", label: "Faculty Reviewers", color: "text-emerald-600" },
              { count: "100+", label: "Events Hosted", color: "text-orange-600" }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center group cursor-default">
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 scale-100 group-hover:scale-110 transition-transform duration-300`}>{stat.count}</div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Built for Everyone
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600">
              Different roles, different capabilities, one unified platform.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                role: "Students",
                icon: Users,
                gradient: "from-blue-500 to-indigo-600",
                features: ["Write and submit articles", "Customize blog appearance", "Track submission status", "Save drafts for later"]
              },
              {
                role: "Faculty",
                icon: CheckCircle,
                gradient: "from-emerald-500 to-teal-600",
                features: ["Review student submissions", "Approve or reject with feedback", "Manage institutional events", "Publish own articles"]
              },
              {
                role: "Admin",
                icon: Sparkles,
                gradient: "from-purple-500 to-pink-600",
                features: ["Full system access", "Manage user roles", "Override content status", "System-wide control"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                  <item.icon className="h-8 w-8" />
                  <h3 className="text-2xl font-bold font-serif">{item.role}</h3>
                </div>
                <ul className="space-y-3">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90">
                      <Star className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6 font-serif">
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
              Join our community of writers, thinkers, and innovators. Your voice matters.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
