import storage from "./storage";
import { Package, PackageInput } from "@/app/types/package";

export async function listPackages(): Promise<Package[]> {
    return storage.packages.list();
}

export async function getPackage(id: string): Promise<Package | null> {
    return storage.packages.get(id);
}

export async function createPackage(input: PackageInput): Promise<Package> {
    return storage.packages.create(input);
}

export async function updatePackage(
    id: string,
    input: PackageInput,
): Promise<Package | null> {
    return storage.packages.update(id, input);
}

export async function deletePackage(id: string): Promise<boolean> {
    return storage.packages.delete(id);
}
