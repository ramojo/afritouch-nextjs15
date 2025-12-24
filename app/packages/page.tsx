"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Utensils, Leaf, Coffee, Wine, ChefHat, Check, ArrowRight } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";

interface PackageData {
    id: string;
    name: string;
    price: string;
    description?: string;
    starch: string[];
    protein: string[];
    vegetables: string[];
    dessert?: string[];
    drinks?: string[];
    color: string;
    popular?: boolean;
}

const packages: PackageData[] = [
    {
        id: "bronze",
        name: "Bronze Menu",
        price: "KES 600",
        description: "Perfect for budget-conscious events that don't compromise on taste.",
        starch: ["Pilau", "Vegetable Rice", "Chapati", "A choice of Mukimo, Mashed Potatoes or Parsley Potatoes"],
        protein: ["Beef stew"],
        vegetables: ["Vegetable Salad or Cooked Vegetables"],
        dessert: ["Fruit in season"],
        color: "border-amber-700/50",
    },
    {
        id: "silver",
        name: "Silver Menu",
        price: "KES 700",
        description: "A balanced selection offering more variety for your guests.",
        starch: ["Pilau", "Rice garnished with vegetables", "Chapati", "A choice of Mukimo, Mashed Potatoes or Parsley Potatoes"],
        protein: ["Beef Stew", "Chicken"],
        vegetables: ["Vegetable Salad or Cooked Vegetables"],
        dessert: ["Fruit in season"],
        color: "border-slate-400",
        popular: true
    },
    {
        id: "gold",
        name: "Gold Menu",
        price: "KES 1200",
        description: "Our diverse menu with premium options including drinks.",
        starch: ["Swahili Rice", "Vegetable stir-fried Rice", "White and brown Chapati", "*Extra Starch Option"],
        protein: ["Beef Stew", "Chicken", "Goat fry, Pork or Fish"],
        vegetables: ["Stir Fried Vegetables"],
        dessert: ["Fruit Cuts"],
        drinks: ["Soda", "Water"],
        color: "border-yellow-500",
    },
    {
        id: "gold-plus",
        name: "Gold Plus Menu",
        price: "KES 1800",
        description: "An elevated dining experience with extended variety.",
        starch: ["Swahili Rice", "Chinese stir-fried rice", "White and brown Chapati", "*Extra Starch Options"],
        protein: ["Beef Stew", "Chicken", "Goat fry, Pork or Fish"],
        vegetables: ["Vegetarian option", "Assortment of Stir Fried Vegetables"],
        dessert: ["Fruit Cuts or Ice Cream"],
        drinks: ["Soda", "Water", "Fresh Juice"],
        color: "border-yellow-600",
    },
    {
        id: "platinum",
        name: "Platinum Menu",
        price: "KES 2200",
        description: "The ultimate culinary experience with comprehensive meal courses.",
        starch: ["Swahili Pilau", "Vegetable Rice", "Soft Layered Chapati", "Mukimo or Parsley Potatoes", "Roast Potatoes/Wedges"],
        protein: ["Beef Wet Fry/Stew", "Glazed Chicken", "Mbuzi Wet Fry", "Pan Seared Fish Fillet"],
        vegetables: ["Creamed Spinach", "Traditional Vegetables"],
        dessert: ["Assorted Fruit Platter", "Ice Cream", "Cake Slices"],
        drinks: ["Soda", "Mineral Water", "Fresh Juice", "Tea/Coffee"],
        color: "border-slate-300",
    }
];

const MenuSection = ({ title, items, icon, colorClass = "text-primary" }: { title: string, items: string[], icon: React.ReactNode, colorClass?: string }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-4 last:mb-0">
            <h4 className={`flex items-center gap-2 mb-2 font-serif text-base font-semibold ${colorClass}`}>
                {icon} {title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-0.5">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function PackagesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Curated Catering Packages</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore our carefully designed menus. Select a package to see the delicious details.
                    </p>
                </div>

                <Tabs defaultValue="gold" className="w-full">
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
                        <TabsContent key={pkg.id} value={pkg.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className={`overflow-hidden border-t-8 shadow-2xl ${pkg.color}`}>
                                <CardHeader className="text-center bg-muted/10 pb-5 pt-5">
                                    {pkg.popular && (
                                        <Badge className="w-fit mx-auto mb-3 bg-secondary text-primary hover:bg-secondary/90">Most Popular Choice</Badge>
                                    )}
                                    <h2 className="text-3xl font-serif font-bold text-primary mb-2">{pkg.name}</h2>
                                    <p className="text-3xl font-bold text-secondary">{pkg.price} <span className="text-lg font-normal text-muted-foreground">/ person</span></p>
                                    <p className="text-muted-foreground max-w-lg mx-auto mt-3 italic">{pkg.description}</p>
                                </CardHeader>
                                <CardContent className="p-5 md:p-7 bg-white">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <MenuSection title="Starch Selection" items={pkg.starch} icon={<ChefHat className="w-5 h-5" />} />
                                            <MenuSection title="Protein Selection" items={pkg.protein} icon={<Utensils className="w-5 h-5" />} />
                                        </div>
                                        <div className="space-y-4">
                                            <MenuSection title="Fresh Vegetables" items={pkg.vegetables} icon={<Leaf className="w-5 h-5" />} />
                                            <MenuSection title="Dessert & Sweet Treats" items={pkg.dessert || []} icon={<Coffee className="w-5 h-5" />} />
                                            <MenuSection title="Beverages" items={pkg.drinks || []} icon={<Wine className="w-5 h-5" />} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 p-5 flex justify-center">
                                    <QuoteDialog
                                        packageName={pkg.name}
                                        trigger={
                                            <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                                Book This Menu <ArrowRight className="w-5 h-5" />
                                            </button>
                                        }
                                    />
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Floating Custom Quote Button */}
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
