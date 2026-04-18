"use client";

import { motion } from "framer-motion";
import { Sparkles, Video, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D WebGL Arkaplan Simgesi */}
      <HeroCanvas />
      
      {/* Glow Blur Gradient Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-20 pointer-events-none" />

      <div className="container px-4 md:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-white/80"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="bg-clip-text text-transparent bg-electric-gradient animate-shimmer">
              AI Video Üretimi Yeniden Tasarlandı
            </span>
          </motion.div>

          {/* Başlık */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Hayal Ettiğiniz Her Şeyi <br />
            <span className="bg-clip-text text-transparent bg-electric-gradient">
              Harekete Geçirin
            </span>
          </h1>

          {/* Alt Metin */}
          <p className="mx-auto max-w-[600px] text-lg text-white/60 md:text-xl leading-relaxed">
            Görsellerinizi ve metinlerinizi saniyeler içinde sinematik başyapıtlara dönüştürün. Dünyanın en gelişmiş AI motoru (Kling AI) arkanızda.
          </p>

          {/* Butonlar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full glow-green font-bold">
                <Video className="mr-2 h-5 w-5" /> Ücretsiz Deneyin
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="glass" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                <Zap className="mr-2 h-5 w-5 text-secondary" /> Nasıl Çalışır?
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
