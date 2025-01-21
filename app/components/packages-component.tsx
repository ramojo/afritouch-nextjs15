'use client'

import React, { useState } from 'react';
import MealPackages from '@/app/packages/page';
import { Package } from '@/app/types/package';

const PackagesComponent = () => {
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

    const handlePackageSelect = (pkg: Package) => {
        setSelectedPackage(pkg);
        // Logic to open the modal or perform another action
    };

    return (
        <div>
            <MealPackages onPackageSelect={handlePackageSelect} />
            {selectedPackage && (
                <div>
                    {/* Render modal or details for the selected package */}
                    <h2>{selectedPackage.title}</h2>
                    <p>{selectedPackage.details}</p>
                </div>
            )}
        </div>
    );
};

export default PackagesComponent;