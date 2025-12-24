import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Leaf, Coffee, Wine, ChefHat } from "lucide-react";

interface MenuSectionProps {
    title: string;
    items: string[];
    icon: React.ReactNode;
    colorClass?: string;
}

const MenuSection = ({ title, items, icon, colorClass = "text-primary" }: MenuSectionProps) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-4 last:mb-0">
            <h4 className={`flex items-center gap-2 mb-2 font-serif text-lg font-semibold ${colorClass}`}>
                {icon} {title}
            </h4>
            <ul className="pl-8 space-y-1 list-none">
                {items.map((item, idx) => (
                    <li key={idx} className="relative text-muted-foreground text-sm md:text-base before:content-['•'] before:absolute before:-left-4 before:text-secondary">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export interface PackageData {
    name: string;
    price: string;
    description?: string;
    starch: string[];
    protein: string[];
    vegetables: string[];
    dessert?: string[];
    drinks?: string[];
    color: string; // Tailwind class for border/accent
}

const PackageCard = ({ pkg }: { pkg: PackageData }) => {
    return (
        <Card className={`overflow-hidden border-t-4 shadow-lg hover:shadow-xl transition-all duration-300 ${pkg.color}`}>
            <CardHeader className="text-center bg-muted/30 pb-6">
                <Badge variant="outline" className="w-fit mx-auto mb-2 border-primary/20 bg-background text-primary font-serif">
                    Premium Catering
                </Badge>
                <CardTitle className="text-3xl font-serif font-bold text-primary tracking-wide">
                    {pkg.name}
                </CardTitle>
                <div className="mt-2 text-2xl font-bold text-secondary">
                    {pkg.price}
                </div>
                {pkg.description && (
                    <p className="text-muted-foreground italic mt-2 text-sm">{pkg.description}</p>
                )}
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-background to-muted/10">
                <MenuSection
                    title="Starch"
                    items={pkg.starch}
                    icon={<ChefHat className="w-5 h-5" />}
                />
                <MenuSection
                    title="Proteins"
                    items={pkg.protein}
                    icon={<Utensils className="w-5 h-5" />}
                />
                <MenuSection
                    title="Vegetables"
                    items={pkg.vegetables}
                    icon={<Leaf className="w-5 h-5" />}
                />
                <MenuSection
                    title="Dessert"
                    items={pkg.dessert || []}
                    icon={<Coffee className="w-5 h-5" />}
                />
                <MenuSection
                    title="Drinks"
                    items={pkg.drinks || []}
                    icon={<Wine className="w-5 h-5" />}
                />
            </CardContent>
        </Card>
    );
};

export default PackageCard;
