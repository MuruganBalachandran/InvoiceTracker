import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, TrendingUp, Sparkles, Zap, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-90"></div>
      
      {/* Geometric Patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>
      
      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"
      />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-indigo-300 rounded-full animate-bounce"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 glass-card px-8 py-3 mb-8 text-white/90 text-sm font-medium group hover:scale-105 transition-transform duration-300"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </motion.div>
            <span className="font-semibold">Trusted by 10,000+ professionals worldwide</span>
            <Sparkles className="w-4 h-4 text-pink-300" />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block"
            >
              Manage Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="block bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent"
            >
              Finances
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="block"
            >
              Effortlessly
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Transform your financial management with our AI-powered platform. Track expenses, 
            generate professional invoices, and get intelligent insights to grow your wealth.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 mb-16 justify-center"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl flex items-center gap-3 pulse-glow"
              >
                <Zap className="w-6 h-6 text-indigo-600" />
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
            >
              <Shield className="w-6 h-6" />
              Watch Demo
            </motion.button>
          </motion.div>
          
          {/* Enhanced Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto"
          >
            {[
              {
                icon: Users,
                number: "10K+",
                label: "Active Users",
                gradient: "from-pink-500 to-purple-500",
                delay: 0,
              },
              {
                icon: TrendingUp,
                number: "$2M+",
                label: "Expenses Tracked",
                gradient: "from-indigo-500 to-blue-500",
                delay: 0.2,
              },
              {
                icon: Star,
                number: "4.9/5",
                label: "User Rating",
                gradient: "from-green-500 to-emerald-500",
                delay: 0.4,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + stat.delay, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-8 text-center group hover:bg-white/20 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl mx-auto mb-6 shadow-lg group-hover:shadow-xl`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4 + stat.delay, duration: 0.5, type: "spring" }}
                  className="text-4xl font-black text-white mb-3"
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/80 font-semibold text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#waveGradient)"/>
          <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 95 960 100 1080 102C1200 105 1320 105 1380 105L1440 105V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;