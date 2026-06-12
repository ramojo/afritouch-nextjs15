import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChefHat, Calendar, Users, Star, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/gallery/reveal";

const heroImages = [
  "/images/gallery/gallery_53.jpg",
  "/images/gallery/gallery_24.jpg",
  "/images/gallery/gallery_67.jpg",
  "/images/gallery/gallery_05.jpg",
  "/images/gallery/gallery_79.jpg",
  "/images/gallery/gallery_66.jpg",
  "/images/hero_image_afritouch_2.jpg",
  "/images/gallery/gallery_15.jpg",
];

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center text-white overflow-hidden">
        {/* Crossfading background slideshow — all images are in the DOM so they
            are preloaded, and we animate opacity (not background-image) to avoid
            flicker. A static base layer guarantees no blank frame at the wrap. */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImages[0]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {heroImages.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="hero-slide object-cover"
              style={{ animationDelay: `${i * 5}s` }}
            />
          ))}
        </div>
        {/* Lighter gradient overlay for approachable feel */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 z-[1]"></div>

        <div className="relative z-10 container px-4 md:px-6 space-y-8 animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-block py-2 px-6 rounded-full bg-black/30 border border-amber-500/30 backdrop-blur-md text-amber-200 font-bold text-xs tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(251,191,36,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Premium Catering Services
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif tracking-tight drop-shadow-2xl">
              Taste the <span className="text-amber-400">Excellence</span> <br /> in Every Bite
            </h1>
            <p className="mx-auto max-w-200 text-xl md:text-2xl text-gray-100 font-light drop-shadow-lg leading-relaxed">
              From intimate gatherings to grand corporate banquets, we bring the authentic flavors of Africa to your table.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <Link href="/packages">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-10 py-7 text-xl font-semibold shadow-xl hover:scale-105 transition-transform border-2 border-amber-500/50">
                Explore Menus
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md rounded-full px-10 py-7 text-xl shadow-lg">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background text-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <Reveal className="space-y-6 text-center">
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">About Afritouch</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Afritouch, we believe that food is the heart of every celebration. We specialize in providing exquisite catering services that blend traditional flavors with modern culinary techniques. Our mission is to create unforgettable dining experiences tailored to your specific needs and preferences.
              </p>
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Star className="fill-secondary text-secondary" /> Premium Quality
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <ChefHat className="text-secondary" /> Expert Chefs
                </div>
              </div>
            </Reveal>
            <Reveal delay={120} className="relative h-100 rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500 max-w-lg mx-auto w-full">
              <Image src="/images/hero_image_afritouch_2.jpg" alt="Afritouch Chef" fill sizes="(min-width: 1024px) 32rem, 100vw" className="object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-24 bg-muted/30 text-center">
        <div className="container px-4 md:px-6">
          <Reveal className="space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We bring the restaurant experience to your venue of choice.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Reveal>
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 h-full">
                <CardHeader className="text-center">
                  <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <CardTitle className="font-serif text-2xl">Weddings</CardTitle>
                  <CardDescription>Elegant catering for your special day.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">From buffet setups to plated service, we ensure your wedding meal is as beautiful as the ceremony.</p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={120}>
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 h-full">
                <CardHeader className="text-center">
                  <Calendar className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <CardTitle className="font-serif text-2xl">Corporate Events</CardTitle>
                  <CardDescription>Professional catering for business.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Impress clients and boost team morale with our high-quality corporate lunch and dinner menus.</p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={240}>
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 h-full">
                <CardHeader className="text-center">
                  <ChefHat className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <CardTitle className="font-serif text-2xl">Private Parties</CardTitle>
                  <CardDescription>Customized sharing for celebrations.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Birthdays, anniversaries, or family gatherings - we handle the food so you can enjoy the party.</p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <Reveal as="h2" className="text-3xl md:text-5xl font-bold font-serif text-primary text-center mb-12">Culinary Gallery</Reveal>
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] max-w-6xl mx-auto">
            <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/gallery/gallery_24.jpg" alt="Chicken in a rich, spiced sauce" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/gallery/gallery_15.jpg" alt="Fresh, colourful fruit salad" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/gallery/gallery_11.jpg" alt="Golden, freshly fried samosas" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="col-span-2 relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/gallery/gallery_66.jpg" alt="Hearty slow-roasted meat" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold font-serif">Get in Touch</h2>
              <p className="text-lg opacity-90 max-w-md mx-auto">Ready to plan your next event? Contact us today for a personalized quote.</p>
              <div className="space-y-4 text-lg">
                <p><strong>Email:</strong> info@afritouchcaterers.co.ke</p>
                <p><strong>Phone:</strong> +254 753 325 124 / +254 732 664 205</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm max-w-lg mx-auto w-full shadow-2xl border border-white/10">
              <form className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Name" className="w-full p-3 rounded-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-secondary" />
                  <input type="email" placeholder="Email" className="w-full p-3 rounded-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
                <textarea placeholder="Tell us about your event..." rows={4} className="w-full p-3 rounded-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-secondary"></textarea>
                <Button size="lg" className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90">
                  Send Message <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-black text-white/50 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Afritouch Caterers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;