import React, { useState, useRef } from 'react';
import { Heart, Gift, Sparkles, Cake, Star, Play, Pause } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

// Import assets
import photo1 from '@/assets/photo-1.jpeg';
import photo2 from '@/assets/photo-2.jpeg';
import photo3 from '@/assets/photo-3.jpeg';
import photo4 from '@/assets/photo-4.jpeg';
import photo5 from '@/assets/photo-5.jpeg';
import photo6 from '@/assets/photo-6.jpeg';
import selamatUltahAudio from '@/assets/selamatUltah.mp3';

const WandaBirthday = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 px-6 py-16 text-center">
            <div className="mb-6 flex justify-center space-x-4">
              <Sparkles className="h-8 w-8 animate-pulse" />
              <Heart className="h-8 w-8 animate-bounce text-pink-200" />
              <Cake className="h-8 w-8 animate-pulse" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
              Selamat Ulang Tahun
            </h1>
            <h2 className="mb-6 text-2xl font-light md:text-4xl">
              Mbak Wanda! 🎉
            </h2>
            <p className="mx-auto max-w-2xl text-lg opacity-90">
              Semoga hari ini dipenuhi cinta, tawa, dan hal-hal yang paling kamu suka!
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 left-4 h-16 w-16 rounded-full bg-yellow-300/30 animate-bounce"></div>
          <div className="absolute top-8 right-8 h-12 w-12 rounded-full bg-pink-300/30 animate-pulse"></div>
          <div className="absolute bottom-4 left-1/4 h-8 w-8 rounded-full bg-purple-300/30 animate-bounce delay-75"></div>
          <div className="absolute bottom-8 right-1/3 h-10 w-10 rounded-full bg-indigo-300/30 animate-pulse delay-150"></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          {/* Photo Gallery Section */}
          <Card className="mb-12 overflow-hidden border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <CardContent className="p-8">
              <div className="mb-8 text-center">
                <h3 className="mb-4 flex items-center justify-center text-2xl font-bold text-foreground">
                  <Star className="mr-2 h-6 w-6 text-yellow-500" />
                  Kenangan Indah
                  <Star className="ml-2 h-6 w-6 text-yellow-500" />
                </h3>
                <p className="text-muted-foreground">
                  Momen-momen spesial yang kami siapkan khusus untukmu
                </p>
                
                {/* Elemen audio tersembunyi untuk kontrol play/pause */}
                <div className="sr-only">
                  <audio
                    ref={audioRef}
                    onEnded={() => setIsPlaying(false)}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                  >
                    <source src={selamatUltahAudio} type="audio/mpeg" />
                    Browser Anda tidak mendukung elemen audio.
                  </audio>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[photo1, photo2, photo3, photo4, photo5, photo6].map((photo, index) => (
                  <div 
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 shadow-lg"
                  >
                    <img 
                      src={photo} 
                      alt={`Kenangan ulang tahun ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Birthday Message */}
          <Card className="mb-12 border-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <Cake className="h-16 w-16 text-pink-500" />
                </div>
                <h3 className="mb-6 text-3xl font-bold text-foreground">
                  Hari Spesial untuk Orang Spesial
                </h3>
                <div className="mx-auto max-w-3xl space-y-4 text-lg text-muted-foreground">
                  <p>
                    Hari ini kita merayakanmu, Wanda! Kebaikan, kehangatan, dan semangatmu selalu membuat setiap ruangan terasa lebih hidup. Di hari spesial ini, semoga kamu benar-benar merasakan betapa berharganya dirimu bagi kami.
                  </p>
                  <p>
                    Semoga tahun baru dalam hidupmu dipenuhi petualangan seru, kejutan manis, dan kebahagiaan yang melimpah. Kamu pantas mendapatkan yang terbaik.
                  </p>
                  <p className="text-xl font-semibold text-primary">
                    Untuk satu tahun lagi menjadi pribadi yang luar biasa! 🌟
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Birthday Wishes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Cinta dan Kebahagiaan",
                message: "Semoga harimu dipenuhi cinta dari keluarga dan teman, dan kebahagiaan selalu menyertaimu."
              },
              {
                icon: Star,
                title: "Mimpi yang Terwujud",
                message: "Semoga semua harapanmu satu per satu menjadi kenyataan di tahun ini."
              },
              {
                icon: Gift,
                title: "Kejutan Indah",
                message: "Semoga banyak momen tak terduga yang membawa senyum dan rasa syukur."
              },
              {
                icon: Sparkles,
                title: "Momen Magis",
                message: "Semoga setiap detik hari ini terasa istimewa dan penuh kehangatan."
              },
              {
                icon: Cake,
                title: "Perayaan Manis",
                message: "Semoga kue ulang tahunnya manis, doanya tulus, dan perayaannya tak terlupakan."
              },
              {
                icon: Heart,
                title: "Bahagia Selalu",
                message: "Semoga kebahagiaan menjadi teman setia di sepanjang perjalananmu."
              }
            ].map((wish, index) => (
              <Card key={index} className="group border-0 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80 hover:scale-105 dark:bg-gray-900/60 dark:hover:bg-gray-900/80">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <wish.icon className="h-10 w-10 text-purple-500 transition-colors group-hover:text-pink-500" />
                  </div>
                  <h4 className="mb-3 text-lg font-semibold text-foreground">
                    {wish.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {wish.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Message */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 text-white">
              <h3 className="mb-4 text-2xl font-bold">
                Dengan Cinta dan Doa Terbaik 💝
              </h3>
              <p className="text-lg opacity-90">
                Selamat ulang tahun, Wanda.
                Semoga hari-harimu selalu dipenuhi cinta, kesehatan, dan kebahagiaan.
              </p>
              <div className="mt-6 flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-6 w-6 animate-pulse text-pink-200" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Audio Control Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleAudio}
            className="group relative h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="flex h-full w-full items-center justify-center">
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white translate-x-0.5" />
              )}
            </div>
            
            {/* Pulse animation when playing */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-ping opacity-30"></div>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default WandaBirthday;