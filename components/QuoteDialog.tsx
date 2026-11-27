"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuoteKind, QuoteLineItem } from "@/app/types/quote";
import { estimatedQuoteTotal } from "@/lib/menu-catalog";
import { formatKes } from "@/lib/utils";

interface QuoteDialogProps {
    packageName?: string;
    packageId?: string;
    kind?: QuoteKind;
    /** Selected dishes for a custom menu; priced by the server on submission. */
    lineItems?: QuoteLineItem[];
    /** When supplied by a builder, guest count is fixed and shown as a summary. */
    guestCount?: number;
    title?: string;
    description?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

const QuoteDialog = ({
    packageName,
    packageId,
    kind = "package",
    lineItems,
    guestCount,
    title = "Request a Quote",
    description,
    isOpen,
    onOpenChange,
    trigger,
}: QuoteDialogProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [guestCountInput, setGuestCountInput] = useState(
        guestCount != null ? String(guestCount) : "",
    );
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (guestCount != null) setGuestCountInput(String(guestCount));
    }, [guestCount]);

    const effectiveGuestCount = guestCount ?? (Number(guestCountInput) || 0);
    const estimate = lineItems?.length
        ? estimatedQuoteTotal(effectiveGuestCount, lineItems)
        : null;
    const pendingCount = lineItems?.filter((li) => li.pendingCosting).length ?? 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const pkg = packageName || (kind === "custom" ? "Custom Menu" : "General Inquiry");
        const menuLines = (lineItems ?? []).map((li) => {
            const price = li.pendingCosting
                ? "Awaiting price"
                : li.unitPrice != null
                    ? `${formatKes(li.unitPrice)} / person`
                    : "—";
            return `  - ${li.name}: ${price}`;
        });

        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    whatsapp,
                    packageId,
                    packageName: pkg,
                    kind,
                    guestCount: effectiveGuestCount,
                    eventDate,
                    location,
                    notes,
                    lineItems: lineItems?.map((li) => ({
                        itemId: li.itemId,
                        name: li.name,
                        category: li.category,
                        custom: li.custom,
                        unitPrice: li.unitPrice,
                        pendingCosting: li.pendingCosting,
                    })),
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                // If email service is not configured, fallback to mailto:
                if (data?.error === "EMAIL_NOT_CONFIGURED") {
                    const subject = encodeURIComponent(`Quote Request: ${pkg} — ${name}`);
                    const body = encodeURIComponent(
                        `Name: ${name}\n` +
                        `Email: ${email}\n` +
                        `Phone: ${phone}\n` +
                        `WhatsApp: ${whatsapp || "N/A"}\n` +
                        `Package: ${pkg}\n` +
                        `Guest Count: ${effectiveGuestCount || "N/A"}\n` +
                        `Event Date: ${eventDate || "N/A"}\n` +
                        `Location: ${location || "N/A"}\n` +
                        (menuLines.length ? `Menu Items:\n${menuLines.join("\n")}\n` : "") +
                        (estimate != null ? `Estimated total: ${formatKes(estimate)}\n` : "") +
                        `Notes: ${notes || "N/A"}`
                    );
                    window.open(`mailto:info@afritouchcaterers.co.ke?subject=${subject}&body=${body}`, "_blank");
                    setSuccess(true);
                    resetForm();
                    setIsSubmitting(false);
                    return;
                }
                throw new Error(
                    data?.warning ||
                        data?.message ||
                        data?.error ||
                        "Something went wrong. Please try again.",
                );
            }

            setSuccess(true);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send inquiry.");
        } finally {
            setIsSubmitting(false);
        }
    };

    function resetForm() {
        setName("");
        setPhone("");
        setWhatsapp("");
        setEmail("");
        if (guestCount == null) setGuestCountInput("");
        setEventDate("");
        setLocation("");
        setNotes("");
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Clear transient state when the dialog closes.
            setSuccess(false);
            setError(null);
        }
        onOpenChange?.(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-primary">{title}</DialogTitle>
                    <DialogDescription>
                        {description ?? (
                            <>
                                Send us an inquiry about the{" "}
                                <span className="font-semibold text-foreground">{packageName}</span>.
                                We&apos;ll get back to you shortly.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {success ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                            ✓
                        </div>
                        <h3 className="font-serif text-xl text-primary">Request sent!</h3>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            Thank you, {name || "there"}. We&apos;ve received your request and
                            will get back to you shortly at the contact details you provided.
                        </p>
                        <Button
                            type="button"
                            onClick={() => handleOpenChange(false)}
                            className="mt-2 bg-primary text-white hover:bg-primary/90"
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {lineItems && lineItems.length > 0 && (
                        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                            <p className="font-semibold text-primary">Your custom menu</p>
                            <ul className="mt-2 space-y-1 text-muted-foreground">
                                {lineItems.map((li, idx) => (
                                    <li key={`${li.itemId ?? li.name}-${idx}`} className="flex justify-between gap-3">
                                        <span>{li.name}</span>
                                        <span>{li.pendingCosting ? "Awaiting price" : `${formatKes(li.unitPrice ?? 0)} / person`}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex justify-between border-t pt-3 font-semibold text-primary">
                                <span>Estimated total</span>
                                <span>{estimate != null ? formatKes(estimate) : "Awaiting costing"}</span>
                            </div>
                            {pendingCount > 0 && (
                                <p className="mt-2 text-xs text-amber-700">
                                    {pendingCount} dish{pendingCount === 1 ? "" : "es"} still need costing. We&apos;ll confirm the final price with you.
                                </p>
                            )}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your Phone Number"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <Input
                                id="whatsapp"
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="If different from phone number"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {guestCount != null ? (
                            <div className="grid gap-2">
                                <Label>Guest Count</Label>
                                <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm">
                                    {guestCount} guests
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <Label htmlFor="guestCount">Guest Count</Label>
                                <Input
                                    id="guestCount"
                                    type="number"
                                    min="1"
                                    value={guestCountInput}
                                    onChange={(e) => setGuestCountInput(e.target.value)}
                                    placeholder="e.g., 50"
                                    required
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="eventDate">Event Date</Label>
                            <Input
                                id="eventDate"
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">Event Location</Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Venue or address"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any specific dietary requirements, preferences, or special requests..."
                            className="min-h-[80px]"
                        />
                    </div>
                    {error && (
                        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || (lineItems?.length ?? 0) === 0 && kind === "custom"} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                            {isSubmitting ? "Sending..." : kind === "custom" ? "Send My Menu Request" : "Send Inquiry"}
                        </Button>
                    </DialogFooter>
                </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default QuoteDialog;
