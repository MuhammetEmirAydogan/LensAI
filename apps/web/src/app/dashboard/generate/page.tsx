"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Wand2, PlayCircle, Loader2, Film } from "lucide-react";
import { LensCanvas } from "@/components/canvas/LensCanvas";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import io from "socket.io-client";

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    const socket = io("http://localhost:4000");
    
    socket.on("connect", () => {
      socket.emit("auth", userId);
    });
    
    socket.on("kling.progress", (data) => {
      console.log("Progress update:", data);
      if (data.progress) setProgress(Math.floor(data.progress * 100));
    });

    return () => { socket.disconnect(); };
  }, [userId]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:4000/api/v1/generate/video",
        { prompt, imageUrl: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // API Gateway successfully queued the task!
    } catch (error) {
      console.error("Generation error:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight glow-purple inline-block px-4 py-1 rounded-lg bg-secondary/10 text-white">
          Video Stüdyosu
        </h1>
        <p className="text-muted-foreground mt-2">
          Kling AI altyapısıyla hayalini kurduğunuz anları saniyeler içinde gerçeğe dönüştürün.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sol Panel: Upload ve Prompt */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Görsel Yükle
              </CardTitle>
              <CardDescription>Videonun çıkış noktası olacak temel resmi seçin (Opsiyonel).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer bg-black/20">
                <UploadCloud className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-sm text-white/60 text-center">
                  Sürükleyip bırakın veya <span className="text-primary glow-green">göz atın</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-secondary glow-purple rounded-full" />
                AI Prompt Motoru
              </CardTitle>
              <CardDescription>Sahnede ne olmasını istediğinizi anlatın, gerisini prompt asistanımız halletsin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Örn: Yağmurlu bir siberpunk şehrinde yürüyen neon ışıklı robot, sinematik, 4k..."
                className="w-full min-h-[120px] bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-white/20 resize-none transition-all"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || prompt.length < 5}
                size="lg" 
                variant="cyber" 
                className="w-full text-lg"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Üretiliyor...</>
                ) : (
                  <><PlayCircle className="w-5 h-5 mr-2" /> Motora Gönder</>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sağ Panel: Önizleme / Çıktı */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-panel border-white/5 h-full min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-white">Kamera & Monitör</CardTitle>
              <CardDescription>Videonuz üretildiğinde burada gösterilecektir.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center space-y-6 w-full h-full relative overflow-hidden">
                  <LensCanvas progress={progress} />
                  <div className="relative w-32 h-32 z-10">
                    <div className="absolute inset-0 rounded-full animate-pulse blur-xl bg-primary/20"></div>
                    <div className="absolute inset-2 border-4 border-l-primary border-b-secondary border-t-transparent border-r-transparent rounded-full animate-spin direction-reverse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">{progress}%</div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary animate-pulse">Render Alınıyor</h3>
                    <p className="text-sm text-white/60 mt-2">Kling AI videonuzu işliyor... ({progress}%)</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full border border-white/10 border-dashed rounded-xl flex items-center justify-center bg-black/20 relative overflow-hidden">
                  <LensCanvas progress={0} />
                  <p className="text-white/30 font-medium tracking-widest uppercase z-10 drop-shadow-lg">
                    SİNYAL BEKLENİYOR
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
