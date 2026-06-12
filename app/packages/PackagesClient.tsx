"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Utensils,
    Leaf,
    Coffee,
    Wine,
    ChefHat,
    Check,
    ArrowRight,
} from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";
import { Reveal } from "@/components/gallery/reveal";
import { Package } from "@/app/types/package";

const MenuSection = ({
    title,
    items,
    icon,
    colorClass = "text-primary",
}: {
    title: string;
    items: string[];
    icon: React.ReactNode;
    colorClass?: string;
}) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-5 last:mb-0">
            <h4
                className={`flex items-center gap-2 mb-2.5 font-serif text-base font-semibold ${colorClass}`}
            >
                {icon} {title}
            </h4>
            <div className="grid grid-cols-1 gap-x-1 gap-y-1 px-8">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-2 text-muted-foreground text-md"
                    >
                        <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function PackagesClient({ packages }: { packages: Package[] }) {
    if (packages.length === 0) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <p className="text-muted-foreground">
                    No packages have been published yet.
                </p>
            </div>
        );
    }

    const defaultId = packages.find((p) => p.popular)?.id ?? packages[0].id;

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20 pt-24 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <Reveal className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                        Curated Catering Packages
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore our carefully designed menus. Select a package
                        to see the delicious details.
                    </p>
                </Reveal>

                <Tabs defaultValue={defaultId} className="w-full">
                    <TabsList className="w-full flex h-auto flex-wrap justify-center gap-2 bg-transparent mb-5">
                        {packages.map((pkg) => (
                            <TabsTrigger
                                key={pkg.id}
                                value={pkg.id}
                                className="px-6 py-3 rounded-full text-base border border-transparent data-[state=active]:border-primary/20 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all"
                            >
                                {pkg.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {packages.map((pkg) => (
                        <TabsContent
                            key={pkg.id}
                            value={pkg.id}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                            <Card
                                className={`overflow-hidden border-t-8 shadow-2xl ${pkg.color}`}
                            >
                                <CardHeader className="text-center bg-muted/10 pb-6 pt-6 relative">
                                    {pkg.popular && (
                                        <Badge className="w-fit mx-auto mb-3 bg-secondary text-primary hover:bg-secondary/90">
                                            Most Popular Choice
                                        </Badge>
                                    )}
                                    <h2 className="text-3xl font-serif font-bold text-primary mb-2">
                                        {pkg.name}
                                    </h2>
                                    <p className="text-3xl font-bold text-secondary">
                                        {pkg.price}{" "}
                                        <span className="text-lg font-normal text-muted-foreground">
                                            / person
                                        </span>
                                    </p>
                                    {pkg.description && (
                                        <p className="text-muted-foreground max-w-lg mx-auto mt-3 italic">
                                            {pkg.description}
                                        </p>
                                    )}

                                    <div className="absolute top-6 right-6 hidden md:block">
                                        <QuoteDialog
                                            packageName={pkg.name}
                                            trigger={
                                                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                                    Book Menu{" "}
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </CardHeader>

                                {pkg.images.length > 0 && (
                                    <div className="bg-muted/20 px-6 md:px-8 py-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {pkg.images.map((src, idx) => (
                                                <div
                                                    key={`${src}-${idx}`}
                                                    className="relative aspect-square rounded-lg overflow-hidden shadow-md"
                                                >
                                                    <Image
                                                        src={src}
                                                        alt={`${pkg.name} image ${idx + 1}`}
                                                        fill
                                                        sizes="(min-width: 768px) 25vw, 50vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <CardContent className="p-6 md:p-8 bg-white">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <MenuSection
                                                title="Starch Selection"
                                                items={pkg.starch}
                                                icon={
                                                    <ChefHat className="w-5 h-5" />
                                                }
                                            />
                                            <MenuSection
                                                title="Protein Selection"
                                                items={pkg.protein}
                                                icon={
                                                    <Utensils className="w-5 h-5" />
                                                }
                                            />
                                        </div>
                                        <div className="space-y-5">
                                            <MenuSection
                                                title="Fresh Vegetables"
                                                items={pkg.vegetables}
                                                icon={
                                                    <Leaf className="w-5 h-5" />
                                                }
                                            />
                                            <MenuSection
                                                title="Dessert & Sweet Treats"
                                                items={pkg.dessert || []}
                                                icon={
                                                    <Coffee className="w-5 h-5" />
                                                }
                                            />
                                            <MenuSection
                                                title="Beverages"
                                                items={pkg.drinks || []}
                                                icon={
                                                    <Wine className="w-5 h-5" />
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center md:hidden">
                                        <QuoteDialog
                                            packageName={pkg.name}
                                            trigger={
                                                <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                                    Book This Menu{" "}
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <QuoteDialog
                packageName="Custom Menu"
                trigger={
                    <button className="fixed bottom-8 right-8 bg-secondary hover:bg-secondary/90 text-primary px-6 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-2 z-40 animate-in slide-in-from-right duration-500">
                        <ChefHat className="w-5 h-5" />
                        Request a Custom Menu
                    </button>
                }
            />
        </div>
    );
}
