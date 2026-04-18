"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Film, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { DataGridCanvas } from "@/components/canvas/DataGridCanvas";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <DataGridCanvas />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-purple inline-block px-4 py-1 rounded-lg bg-secondary/10 text-white">Kontrol Paneli</h1>
          <p className="text-muted-foreground mt-2">Video üretim durumunuzu ve aboneliklerinizi yönetin.</p>
        </div>
        <Link href="/dashboard/generate">
          <Button className="glow-green whitespace-nowrap">
            <Sparkles className="w-4 h-4 mr-2" /> Yeni Video Üret
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Krediler Kartı */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Kullanılabilir Kredi</CardTitle>
              <Zap className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">24 <span className="text-sm text-muted-foreground font-normal">/ 100</span></div>
              <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full w-[24%] glow-green rounded-full"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Bu ayki kotanızın %24&apos;ünü kullandınız.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Abonelik Kartı */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-secondary/20 bg-background/50 backdrop-blur-xl h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Abonelik Planı</CardTitle>
              <Crown className="w-5 h-5 text-secondary glow-purple rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-400">
                PRO HESAP
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Yenilenme tarihi: 12 Mayıs 2026
              </p>
              <Button variant="outline" className="w-full mt-4 border-secondary/50 text-secondary hover:bg-secondary/10">
                Planı Yönet
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Üretilen Videolar Kartı */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-background/50 backdrop-blur-xl h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Üretilenler</CardTitle>
              <Film className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">12</div>
              <p className="text-xs text-muted-foreground mt-2">
                Toplam üretilen video sayısı.
              </p>
              <Link href="/dashboard/videos">
                <Button variant="ghost" className="w-full mt-4 text-white/50 hover:text-white">
                  Tümünü Gör →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
