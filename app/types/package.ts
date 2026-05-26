export interface Package {
    id: string;
    name: string;
    price: string;
    description?: string;
    starch: string[];
    protein: string[];
    vegetables: string[];
    dessert: string[];
    drinks: string[];
    color: string;
    popular?: boolean;
    images: string[];
}

export type PackageInput = Omit<Package, "id">;
