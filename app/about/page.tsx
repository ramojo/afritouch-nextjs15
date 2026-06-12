import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Award,
    Building2,
    ChefHat,
    GraduationCap,
    HandHeart,
    Heart,
    Mail,
    Phone,
    Section,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
    Utensils,
} from "lucide-react";

export const metadata = {
    title: "About Us | Afritouch Caterers",
    description:
        "Afritouch Caterers — a Nairobi-based catering firm specialising in institutional catering, cafeteria management and outside catering since 2006.",
};

const services = [
    {
        icon: <Building2 className="w-7 h-7 text-secondary" />,
        title: "Institutional and Corporate Catering",
        description:
            "Daily staff lunches, staff tea, and meals during meetings and corporate functions for schools, universities and offices.",
    },
    {
        icon: <Utensils className="w-7 h-7 text-secondary" />,
        title: "Cafeteria Management",
        description:
            "Full-service cafeteria operations for cash-paying guests at institutions, run by qualified chefs and service staff.",
    },
    {
        icon: <Users className="w-7 h-7 text-secondary" />,
        title: "Outside Catering",
        description:
            "Weddings (from 100 to 3,000+ guests), AGMs, trainings, team-building, orientations, parties and CSR activities.",
    },
];

const achievements = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
        stat: "1,000,000+",
        label: "Meals served in the last 10 years — zero cases of food poisoning.",
    },
    {
        icon: <Utensils className="w-8 h-8 text-secondary" />,
        stat: "7,000+",
        label: "Meals served every week, consistently for the past 5 years.",
    },
    {
        icon: <Sparkles className="w-8 h-8 text-secondary" />,
        stat: "150",
        label: "Outside catering events handled annually for the past 5 years.",
    },
    {
        icon: <Award className="w-8 h-8 text-secondary" />,
        stat: "Certified",
        label: "Company-wide certification for food handling and safety.",
    },
];

const csrItems = [
    {
        icon: <GraduationCap className="w-6 h-6 text-secondary" />,
        title: "Educating Needy Students",
        description:
            "Sponsoring education for students who would otherwise be unable to attend school.",
    },
    {
        icon: <HandHeart className="w-6 h-6 text-secondary" />,
        title: "Staff Elevation Programme",
        description:
            "Supporting our team in acquiring property and furthering their education.",
    },
    {
        icon: <Heart className="w-6 h-6 text-secondary" />,
        title: "Women's Health",
        description:
            'Partnering with NGOs such as "Still a Mum" that champion women\'s health.',
    },
];

const clients = [
    "Christ Is The Answer Ministries (CITAM)",
    "Pinnacle Capital Limited",
    "Pan African Christian University, Roysambu",
    "St. Paul's University, Limuru",
    "Innova, Nairobi",
    "Milimani Law Courts",
    "Deliverance Church Headquarters, Nairobi",
    "Kiambu Law Courts",
    "Unilever Kenya Limited (Mabroukie Tea)",
    "Nairobi Chapel — Kiambu Road",
    "Octagon Africa",
    "Institute of Pension Management (IPM Kenya)",
    "Paytech Limited",
    "Enchanting Travels",
    "Royal Media Services",
    "Ridgeways Baptist Church",
    "Kenchic PLC",
    "SAWA Sacco",
];

export default function AboutUsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
                <Image
                    src="/images/hero_image_afritouch_3.jpg"
                    alt="Afritouch Caterers"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/80 z-0" />
                <div className="relative z-10 container px-4 md:px-6 space-y-6 pt-24 pb-16 animate-in fade-in zoom-in duration-1000">
                    <div className="inline-block py-2 px-6 rounded-full bg-black/30 border border-amber-500/30 backdrop-blur-md text-amber-200 font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        About Afritouch Caterers
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight drop-shadow-2xl">
                        Crafting <span className="text-amber-400">memorable</span> meals since 2006
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg md:text-xl text-gray-100 font-light drop-shadow-lg leading-relaxed">
                        A Nairobi-based catering firm serving institutions,
                        corporates and celebrations of every size — from
                        intimate gatherings to weddings with over 3,000 guests.
                    </p>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">
                                Who We Are
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Afritouch Caterers is a Nairobi-based catering
                                firm specialising in food catering services to
                                institutions — schools, universities and
                                corporate offices. We are a sister firm to{" "}
                                <span className="font-semibold text-primary">
                                    <a
                                        href="https://hometouch.co.ke"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Hometouch Catering Services Limited
                                    </a>
                                </span>
                                .
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                As directors, we felt it was stretching
                                Hometouch to perform both institutional and
                                corporate catering and outside catering for
                                varied events. Afritouch was born with a mandate
                                to handle all institutional and corporate
                                catering tasks, while Hometouch Catering
                                Services Limited handles all the varied outside
                                catering events.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <Star className="fill-secondary text-secondary w-5 h-5" />{" "}
                                    Premium Quality
                                </div>
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <ChefHat className="text-secondary w-5 h-5" />{" "}
                                    Expert Chefs
                                </div>
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <ShieldCheck className="text-secondary w-5 h-5" />{" "}
                                    Certified & Safe
                                </div>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500 max-w-lg mx-auto w-full">
                            <Image
                                src="/images/hero_image_afritouch_2.jpg"
                                alt="Afritouch Chefs at work"
                                fill
                                sizes="(min-width: 1024px) 32rem, 100vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Working Experience */}
            <section className="py-24 bg-muted/30">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl -skew-y-3 hover:skew-y-0 transition-transform duration-500 max-w-lg mx-auto w-full order-2 lg:order-1">
                            <Image
                                src="/images/hero_image_afritouch_4.jpg"
                                alt="Afritouch event service"
                                fill
                                sizes="(min-width: 1024px) 32rem, 100vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6 order-1 lg:order-2">
                            <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">
                                Two Decades of Experience
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Afritouch Caterers / Hometouch Catering
                                Services Ltd has been in business since{" "}
                                <span className="font-semibold text-primary">
                                    2006
                                </span>
                                . We serve a broad range of clients — from
                                chief executives to students on shoe-string
                                budgets — and have catered weddings ranging
                                from 100 to more than 3,000 guests.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our staff is experienced in dealing with
                                multicultural and international clients. Our
                                chefs can prepare a wide range of dishes from
                                around the world, and respond to requests at
                                the shortest possible notice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">
                            What We Do
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Three core service lines, delivered with the same
                            commitment to fresh, tasty, quality food at
                            competitive rates.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((s) => (
                            <Card
                                key={s.title}
                                className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                                        {s.icon}
                                    </div>
                                    <CardTitle className="font-serif text-2xl text-primary">
                                        {s.title}
                                    </CardTitle>
                                    <CardDescription className="text-base leading-relaxed">
                                        {s.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* By the numbers */}
            <section className="py-24 bg-primary text-primary-foreground">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-amber-300">
                            By the Numbers
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            A track record built on consistency, safety and
                            scale.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {achievements.map((a) => (
                            <div
                                key={a.stat}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
                            >
                                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                                    {a.icon}
                                </div>
                                <div className="text-3xl font-bold font-serif text-amber-300 mb-2">
                                    {a.stat}
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {a.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capacity & Management */}
            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">
                            Built to Deliver, at Scale
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Experienced leadership, a qualified team and the
                            logistics to back it up.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <ChefHat className="w-10 h-10 text-secondary mb-3" />
                                <CardTitle className="font-serif text-xl text-primary">
                                    Qualified Staff
                                </CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    Experienced chefs capable of preparing
                                    international dishes. All staff carry
                                    health certifications and are qualified by
                                    the relevant authorities.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <Users className="w-10 h-10 text-secondary mb-3" />
                                <CardTitle className="font-serif text-xl text-primary">
                                    Logistics
                                </CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    Capacity to serve over 3,000 meals
                                    simultaneously across different venues —
                                    on time, every time.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <Building2 className="w-10 h-10 text-secondary mb-3" />
                                <CardTitle className="font-serif text-xl text-primary">
                                    Strong Foundation
                                </CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    Two directors lead policy and strategy
                                    under the board of Hometouch Catering
                                    Services Ltd, with an annual turnover of
                                    approximately KES 40 million.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values & CSR */}
            <section className="py-24 bg-muted/30">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">
                            Our Values & Community
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
                            &ldquo;Fresh, tasty, quality food at very
                            competitive rates.&rdquo;
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {csrItems.map((c) => (
                            <Card
                                key={c.title}
                                className="bg-card border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <CardContent className="p-6 space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                        {c.icon}
                                    </div>
                                    <h3 className="font-serif text-xl font-semibold text-primary">
                                        {c.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {c.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Notable Clients */}
            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6 max-w-5xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">
                            Notable Clients
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A small selection of organizations that trust us
                            with their meals.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {clients.map((client) => (
                            <div
                                key={client}
                                className="bg-card border border-border/50 rounded-lg px-4 py-3 text-center text-sm md:text-base font-medium text-primary hover:border-secondary hover:shadow-md transition-all"
                            >
                                {client}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section
                id="contact"
                className="py-24 bg-linear-to-br from-primary via-primary to-amber-900 text-primary-foreground"
            >
                <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-amber-300">
                        Let&apos;s Cater Your Next Event
                    </h2>
                    <p className="text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
                        Speak with our team about meals for your institution,
                        cafeteria or upcoming event.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                        <a
                            href="mailto:info@afritouchcaterers.co.ke"
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                        >
                            <Mail className="w-6 h-6 text-amber-300 shrink-0" />
                            <div>
                                <div className="text-xs uppercase tracking-wider text-white/60">
                                    Email
                                </div>
                                <div className="font-semibold break-all">
                                    info@afritouchcaterers.co.ke
                                </div>
                            </div>
                        </a>
                        <a
                            href="tel:+254753325124"
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                        >
                            <Phone className="w-6 h-6 text-amber-300 shrink-0" />
                            <div>
                                <div className="text-xs uppercase tracking-wider text-white/60">
                                    Phone
                                </div>
                                <div className="font-semibold">
                                    +254 753 325 124
                                </div>
                                <div className="font-semibold text-white/80">
                                    +254 732 664 205
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="pt-2 text-white/70">
                        Directors:{" "}
                        <span className="font-semibold text-white">
                            Gaceri Kiara
                        </span>
                        
                        <span className="font-semibold text-white">
                            &nbsp;&amp;&nbsp; Allan Ramogo
                        </span>
                        
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/packages">
                            <Button
                                size="lg"
                                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-10 py-7 text-lg font-semibold shadow-xl hover:scale-105 transition-transform border-2 border-amber-500/50"
                            >
                                View Our Menus
                            </Button>
                        </Link>
                        <Link href="/gallery">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md rounded-full px-10 py-7 text-lg shadow-lg"
                            >
                                See Our Work
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
