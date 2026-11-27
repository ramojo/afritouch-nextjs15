import { listMenuItems } from "@/lib/menu-items";
import CustomMenuBuilder from "./CustomMenuBuilder";

export const dynamic = "force-dynamic";

export default async function CustomMenuPage() {
    const items = await listMenuItems({ active: true });

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20 px-4 py-10 pt-28 md:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl">
                        Build Your Own Menu
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                        Choose the dishes you love, drag them into your menu and see
                        an instant per-person cost. Send us the finished menu and
                        we&apos;ll take care of the rest.
                    </p>
                </div>
                <CustomMenuBuilder items={items} />
            </div>
        </div>
    );
}
