'use client'

import PackageLayout from '@/app/packages/layout';
import { Package } from '@/app/types/package';
import { useState } from 'react';
import Modal from '@/app/packages/modal';

const packages: Package[] = [
    {
        id: 1,
        title: "Bronze",
        price: "KES 600",
        details: `Starch:
                Pilau
                Vegetable Rice
                Chapati
                A choice of Mukimo, Mashed Potatoes or Parsley Potatoes
            Protein:
                Beef stew
            Vegetables:
                Vegetable Salad or Cooked Vegetables

            Fruits:
                Fruit in season`,
        imageUrl: undefined,
        description: 'Basic Meal Package',
    },
    {
        id: 2,
        title: "Silver",
        price: "KES 700",
        details: `Starch:\n Pilau\n Rice garnished with vegetables\n Chapati\n A choice of Mukimo, Mashed Potatoes or Parsley Potatoes\n\nProtein:\n Beef Stew\n Chicken\n\nVegetables:\n Vegetable Salad or Cooked Vegetables\n\nDesert:\n Fruit in season`,
        imageUrl: undefined,
        description: 'Silver Meal Package',
    },
    {
        id: 3,
        title: "Gold",
        price: "KES 1200",
        details: `Starch:\n Swahili Rice\n Vegetable stir-fried Rice\n White and brown Chapati\n Extra Starch Option\n\nProteins:\n Beef stew\n Chicken\n Goat fry, Pork, or Fish\n\nVegetables:\n Stir Fried Vegetables\n\nDesert:\n Fruit Cuts\n\nDrinks:\n Soda\n Water`,
        imageUrl: undefined,
        description: 'Gold Meal Package',
    },
    {
        id: 4,
        title: "Gold Plus",
        price: "KES 1800",
        details: `Starch:\n Swahili Rice\n Chinese stir-fried rice\n White and brown Chapati\n Extra Starch Options\n\nProteins:\n Beef Stew\n Chicken\n Goat fry, Pork or Fish\n\nVegetables:\n Vegetarian option\n Assortment of Stir Fried Vegetables\n\nDesert:\n Fruit Cuts or Ice Cream\n\nDrinks:\n Soda\n Water\n Fresh Juice`,
        imageUrl: undefined,
        description: 'Gold Plus Meal Package',
    },
    {
        id: 5,
        title: "Platinum",
        price: "KES 2800",
        details: `<h3>Starter:</h3>\n Signature soup served with bread rolls\n\nStarch:\n Swahili Rice\n Chinese stir-fried rice\n White and brown Chapati\n Extra Starch Options\n\nProteins:\n Beef Stew\n Chicken\n Goat fry, Pork or Fish\n\nVegetables:\n Vegetarian Option\n Assortment of Stir Fried Vegetables\n\nDessert:\n Cake & Custard\n Fruit Cuts\n Ice Cream\n\nDrinks:\n Soda\n Water\n Fresh Juice`,
        imageUrl: undefined,
        description: 'Platinum Meal Package',
    },
    {
        id: 6,
        title: "Children Options",
        price: "Varies",
        details: `\n Fries\n Bhajias\n Sausages\n Meatballs\n Chicken nuggets\n Fish fingers\n Carrot & pineapple salad\n\nDrinks:\n Fruit\n Fresh juice\n Soda\n Water`,
        imageUrl: undefined,
        description: 'Children Options',
    },
];

// Define the type for package colors
type PackageColors = {
    [key: string]: string; // Key is the package name, value is the color class
};

const packageColors: PackageColors = {
    Bronze: "bg-gradient-to-r from-yellow-100 via yellow-400 to-yellow-800",
    Silver: "bg-gradient-to-r from-zinc-100 via zinc-300 to-zinc-400",
    Gold: "bg-gradient-to-r from-amber-100 via amber-400 to-amber-500",
    "Gold Plus": "bg-gradient-to-r from-amber-100 via amber-200 to-amber-300",
    Platinum: "bg-gradient-to-r from-slate-100 via slate-300 to-slate-500",
    "Children Options": "bg-gradient-to-r from-purple-100 via purple-200 to-purple-500",
};

const MealPackages = ({ onPackageSelect }: { onPackageSelect: (pkg: Package) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState<Package | null>(null);

    const openModal = (pkg: Package) => {
        setCurrentPackage(pkg);
        setIsModalOpen(true);
        onPackageSelect(pkg);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPackage(null);
    };

    return (
        <PackageLayout>
            {isModalOpen && (
                <Modal onClose={closeModal} package={currentPackage} />
            )}
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <h1 className="text-3xl font-bold mb-6">Package Options</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`rounded-lg shadow-md p-4 ${packageColors[pkg.title] || 'bg-gray-200'} hover:shadow-lg transition duration-200 transform hover:scale-105 cursor-pointer`}
                            onClick={() => openModal(pkg)}
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{pkg.title}</h3>
                            <p className="text-gray-600">{pkg.price}</p>
                            {/* <button className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200">Select</button> */}
                        </div>
                    ))}
                </div>
            </div>
        </PackageLayout>
    );
};

export default MealPackages;
