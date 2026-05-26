import { listPackages } from "@/lib/packages";
import PackagesClient from "./PackagesClient";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
    const packages = await listPackages();
    return <PackagesClient packages={packages} />;
}
