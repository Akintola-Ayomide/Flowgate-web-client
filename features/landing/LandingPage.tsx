'use client';

import { motion, Variants } from "framer-motion";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { AppDownloadSection } from "./components/AppDownloadSection";
import { Footer } from "./components/Footer";

// Page-level animation variants
const pageContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, when: "beforeChildren" },
  },
};

// Section reveal variants
const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-background relative overflow-hidden"
      variants={pageContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header remains fixed */}
      <Header />

      {/* Hero Section */}
      <motion.section variants={sectionVariant} className="border-b border-border/50">
        <HeroSection />
      </motion.section>

      {/* How It Works */}
      <motion.section variants={sectionVariant} className="border-b border-border/50">
        <HowItWorksSection />
      </motion.section>

      {/* Features */}
      <motion.section variants={sectionVariant} className="border-b border-border/50">
        <FeaturesSection />
      </motion.section>

      {/* App Download */}
      <motion.section variants={sectionVariant} className="border-b border-border/50">
        <AppDownloadSection />
      </motion.section>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
