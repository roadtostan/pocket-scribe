import React, { useState, useRef } from 'react';
import { Heart, Gift, Sparkles, Cake, Star, Play, Pause, X } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Photo details with descriptions and dates
  const photoDetails = [
    {
      description: "Hari pertama kita bertemu di kafe itu, matamu yang berbinar membuat hatiku berdebar. Senyuman manismu langsung mencuri perhatianku, dan sejak saat itu aku tahu bahwa kamu istimewa.",
      date: "15 Februari 2023",
      title: "Pertemuan Pertama Kita"
    },
    {
      description: "Kencan pertama kita di taman bunga. Kita berjalan-jalan sambil mengobrol tentang mimpi-mimpi kita. Kamu terlihat begitu cantik di antara bunga-bunga sakura yang bermekaran.",
      date: "28 Februari 2023", 
      title: "Kencan Pertama di Taman"
    },
    {
      description: "Momen ketika kamu pertama kali bilang 'aku sayang kamu' sambil memelukku erat. Rasanya dunia berhenti berputar, dan yang ada hanya kita berdua dalam kehangatan cinta.",
      date: "14 Maret 2023",
      title: "Pengakuan Cinta Pertama"
    },
    {
      description: "Liburan romantis kita ke pantai. Kita menonton sunset sambil bergandengan tangan, dan aku berjanji akan selalu membuatmu bahagia seperti saat ini.",
      date: "10 Juni 2023",
      title: "Sunset Romantis di Pantai"
    },
    {
      description: "Ulang tahun kita yang pertama merayakan bersama. Kamu membuat kue untukku dengan tanganmu sendiri, dan rasanya adalah yang termanis yang pernah aku cicipi.",
      date: "23 Agustus 2023", 
      title: "Perayaan Bersama Pertama"
    },
    {
      description: "Momen ketika kita berdua tertidur di sofa sambil menonton film. Aku terbangun dan melihatmu tidur dengan damai di pelukanku, dan aku tahu ini adalah kebahagiaan sejati.",
      date: "5 November 2023",
      title: "Ketenangan dalam Pelukan"
    }
  ];

  // Auto-play audio when component mounts
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // If autoplay fails (browser policy), set isPlaying to false
        setIsPlaying(false);
      });
    }
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-romantic-background via-romantic-muted to-romantic-secondary dark:from-romantic-background dark:via-romantic-muted dark:to-romantic-secondary">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-gradient-end text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 px-4 py-12 text-center md:px-6 md:py-16">
            <div className="mb-4 flex justify-center space-x-2 md:mb-6 md:space-x-4">
              <Sparkles className="h-6 w-6 animate-pulse md:h-8 md:w-8" />
              <Heart className="h-6 w-6 animate-bounce text-pink-200 md:h-8 md:w-8" />
              <Cake className="h-6 w-6 animate-pulse md:h-8 md:w-8" />
            </div>
            <h1 className="mb-3 text-2xl font-bold tracking-tight md:mb-4 md:text-4xl lg:text-6xl">
              Selamat Ulang Tahun
            </h1>
            <h2 className="mb-4 text-lg font-light md:mb-6 md:text-2xl lg:text-4xl">
              Sayang ku, Wanda! 💖
            </h2>
            <p className="mx-auto max-w-2xl text-sm opacity-90 md:text-lg">
              Semoga hari spesial ini dipenuhi cinta, kebahagiaan, dan semua hal indah yang kamu impikan, sayang
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-2 left-2 h-8 w-8 rounded-full bg-pink-300/30 animate-bounce md:-top-4 md:left-4 md:h-16 md:w-16"></div>
          <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-rose-300/30 animate-pulse md:top-8 md:right-8 md:h-12 md:w-12"></div>
          <div className="absolute bottom-2 left-1/4 h-4 w-4 rounded-full bg-pink-400/30 animate-bounce delay-75 md:bottom-4 md:h-8 md:w-8"></div>
          <div className="absolute bottom-4 right-1/3 h-5 w-5 rounded-full bg-rose-400/30 animate-pulse delay-150 md:bottom-8 md:h-10 md:w-10"></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Photo Gallery Section */}
          <Card className="mb-8 overflow-hidden border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 md:mb-12">
            <CardContent className="p-4 md:p-8">
              <div className="mb-6 text-center md:mb-8">
                <h3 className="mb-3 flex items-center justify-center text-lg font-bold text-romantic-foreground md:mb-4 md:text-2xl">
                  <Star className="mr-2 h-5 w-5 text-romantic-accent md:h-6 md:w-6" />
                  Kenangan Indah Kita
                  <Star className="ml-2 h-5 w-5 text-romantic-accent md:h-6 md:w-6" />
                </h3>
                <p className="text-sm text-romantic-foreground/70 md:text-base">
                  Setiap momen bersamamu adalah harta yang tak ternilai, sayang
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
              
              <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {[photo1, photo2, photo3, photo4, photo5, photo6].map((photo, index) => (
                  <div 
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-romantic-muted to-romantic-secondary shadow-lg cursor-pointer md:cursor-default"
                    onClick={() => setSelectedPhoto(index)}
                  >
                    <img 
                      src={photo} 
                      alt={`Kenangan indah bersama ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-romantic-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    
                    {/* Mobile click indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 md:hidden">
                      <div className="rounded-full bg-white/90 p-2">
                        <Heart className="h-4 w-4 text-romantic-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Birthday Message */}
          <Card className="mb-8 border-0 bg-gradient-to-r from-romantic-primary/10 via-romantic-accent/10 to-romantic-secondary/20 backdrop-blur-sm md:mb-12">
            <CardContent className="p-4 md:p-8">
              <div className="text-center">
                <div className="mb-4 flex justify-center md:mb-6">
                  <Cake className="h-12 w-12 text-romantic-primary md:h-16 md:w-16" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-romantic-foreground md:mb-6 md:text-3xl">
                  Untuk Cinta Hidupku
                </h3>
                <div className="mx-auto max-w-3xl space-y-3 text-sm text-romantic-foreground/80 md:space-y-4 md:text-lg">
                  <p>
                    Sayang, hari ini hatiku dipenuhi rasa syukur karena bisa merayakan hari spesialmu. Senyummu yang hangat, pelukan lembutmu, dan cintamu yang tulus selalu menjadi alasan aku bersemangat setiap hari.
                  </p>
                  <p>
                    Di hari istimewa ini, aku ingin kamu tahu bahwa kamu adalah hadiah terindah dalam hidupku. Semoga di tahun yang baru ini, setiap langkahmu dipenuhi kebahagiaan, setiap mimpimu semakin dekat menjadi kenyataan, dan cinta kita semakin kuat selamanya.
                  </p>
                  <p className="text-base font-semibold text-romantic-primary md:text-xl">
                    Aku mencintaimu dengan segenap hatiku. Selamat ulang tahun, bidadariku. 💕
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Birthday Wishes Grid */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Cinta Abadi",
                message: "Semoga cintaku padamu tumbuh semakin dalam setiap hari, dan hatimmu selalu dipenuhi kehangatan kasih sayang yang tulus."
              },
              {
                icon: Star,
                title: "Impian Terwujud",
                message: "Aku akan selalu mendukung setiap mimpimu, sayang. Semoga semua yang kamu harapkan menjadi kenyataan indah."
              },
              {
                icon: Gift,
                title: "Kejutan Manis",
                message: "Semoga setiap hari membawa kejutan kecil yang membuatmu tersenyum, seperti cara kamu membuatku bahagia setiap saat."
              },
              {
                icon: Sparkles,
                title: "Momen Berkilau",
                message: "Bersamamu, setiap detik terasa istimewa. Semoga hari ini dan seterusnya penuh dengan momen-momen ajaib kita berdua."
              },
              {
                icon: Cake,
                title: "Perayaan Cinta",
                message: "Hari ini bukan hanya ulang tahunmu, tapi perayaan betapa beruntungnya aku memilikimu dalam hidup."
              },
              {
                icon: Heart,
                title: "Kebahagiaan Selamanya",
                message: "Aku berjanji akan selalu berusaha membuatmu bahagia, hari ini, besok, dan selamanya."
              }
            ].map((wish, index) => (
              <Card key={index} className="group border-0 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80 hover:scale-105 dark:bg-gray-900/60 dark:hover:bg-gray-900/80">
                <CardContent className="p-4 text-center md:p-6">
                  <div className="mb-3 flex justify-center md:mb-4">
                    <wish.icon className="h-8 w-8 text-romantic-primary transition-colors group-hover:text-romantic-accent md:h-10 md:w-10" />
                  </div>
                  <h4 className="mb-2 text-base font-semibold text-romantic-foreground md:mb-3 md:text-lg">
                    {wish.title}
                  </h4>
                  <p className="text-xs text-romantic-foreground/70 md:text-sm">
                    {wish.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-center md:mt-16">
            <div className="mx-auto max-w-2xl rounded-lg bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-gradient-end p-6 text-white md:p-8">
              <h3 className="mb-3 text-lg font-bold md:mb-4 md:text-2xl">
                Dengan segenap cinta dalam hatiku 💖
              </h3>
              <p className="text-sm opacity-90 md:text-lg">
                Selamat ulang tahun, cinta hidupku. Semoga Allah selalu melindungi dan membahagiakan hidupmu.
              </p>
              <div className="mt-4 flex justify-center space-x-1 md:mt-6 md:space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 animate-pulse text-pink-200 md:h-6 md:w-6" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Photo Modal */}
        {selectedPhoto !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:hidden">
            <div className="relative max-h-full w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/20 p-2 text-white transition-colors hover:bg-black/40"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Photo */}
              <div className="aspect-square overflow-hidden">
                <img 
                  src={[photo1, photo2, photo3, photo4, photo5, photo6][selectedPhoto]} 
                  alt={photoDetails[selectedPhoto].title}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-romantic-primary">
                    {photoDetails[selectedPhoto].title}
                  </h3>
                  <span className="text-sm text-romantic-foreground/60">
                    {photoDetails[selectedPhoto].date}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-romantic-foreground/80">
                  {photoDetails[selectedPhoto].description}
                </p>
                
                {/* Decorative hearts */}
                <div className="mt-4 flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart key={i} className="h-4 w-4 animate-pulse text-romantic-accent" style={{ animationDelay: `${i * 0.3}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Audio Control Button */}
        <div className="fixed bottom-24 right-4 z-50 md:bottom-6 md:right-6">
          <button
            onClick={toggleAudio}
            className="group relative h-12 w-12 rounded-full bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-gradient-end shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-romantic-primary/50 md:h-16 md:w-16"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="flex h-full w-full items-center justify-center">
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white md:h-6 md:w-6" />
              ) : (
                <Play className="h-5 w-5 text-white translate-x-0.5 md:h-6 md:w-6" />
              )}
            </div>
            
            {/* Pulse animation when playing */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-gradient-end animate-ping opacity-30"></div>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default WandaBirthday;