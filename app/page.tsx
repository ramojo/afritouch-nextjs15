import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChefHat, Calendar, Users, Star, ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center hero-section text-white overflow-hidden">
        {/* Lighter gradient overlay for approachable feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-0"></div>

        <div className="relative z-10 container px-4 md:px-6 space-y-8 animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-block py-2 px-6 rounded-full bg-black/30 border border-amber-500/30 backdrop-blur-md text-amber-200 font-bold text-xs tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(251,191,36,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Premium Catering Services
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif tracking-tight drop-shadow-2xl">
              Taste the <span className="text-amber-400">Excellence</span> <br /> in Every Bite
            </h1>
            <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-gray-100 font-light drop-shadow-lg leading-relaxed">
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
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">About Afritouch</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Afritouch, we believe that food is the heart of every celebration. We specialize in providing exquisite catering services that blend traditional flavors with modern culinary techniques. Our mission is to create unforgettable dining experiences tailored to your specific needs and preferences.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Star className="fill-secondary text-secondary" /> Premium Quality
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <ChefHat className="text-secondary" /> Expert Chefs
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500 max-w-lg mx-auto w-full">
              <Image src="/images/hero_image_afritouch_2.jpg" alt="Afritouch Chef" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We bring the restaurant experience to your venue of choice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle className="font-serif text-2xl">Weddings</CardTitle>
                <CardDescription>Elegant catering for your special day.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">From buffet setups to plated service, we ensure your wedding meal is as beautiful as the ceremony.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle className="font-serif text-2xl">Corporate Events</CardTitle>
                <CardDescription>Professional catering for business.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Impress clients and boost team morale with our high-quality corporate lunch and dinner menus.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <CardHeader className="text-center">
                <ChefHat className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle className="font-serif text-2xl">Private Parties</CardTitle>
                <CardDescription>Customized sharing for celebrations.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Birthdays, anniversaries, or family gatherings - we handle the food so you can enjoy the party.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary text-center mb-12">Culinary Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/hero_image_afritouch.jpg" alt="Gallery 1" fill className="object-cover" />
            </div>
            <div className="relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/hero_image_afritouch_3.jpg" alt="Gallery 2" fill className="object-cover" />
            </div>
            <div className="relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/hero_image_afritouch_4.jpg" alt="Gallery 3" fill className="object-cover" />
            </div>
            <div className="col-span-2 relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg">
              <Image src="/images/hero_image_afritouch_5.jpg" alt="Gallery 4" fill className="object-cover" />
            </div>
          </div>
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