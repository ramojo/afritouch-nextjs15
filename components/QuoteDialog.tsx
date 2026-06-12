"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuoteDialogProps {
    packageName?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

const QuoteDialog = ({ packageName, isOpen, onOpenChange, trigger }: QuoteDialogProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [guestCount, setGuestCount] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    whatsapp,
                    packageName,
                    guestCount,
                    eventDate,
                    location,
                    notes,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error || "Something went wrong. Please try again.");
            }

            setSuccess(true);
            // Reset the form fields after a successful send.
            setName("");
            setPhone("");
            setWhatsapp("");
            setEmail("");
            setGuestCount("");
            setEventDate("");
            setLocation("");
            setNotes("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send inquiry.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <DialogTitle className="font-serif text-2xl text-primary">Request a Quote</DialogTitle>
                    <DialogDescription>
                        Send us an inquiry about the <span className="font-semibold text-foreground">{packageName}</span>. We'll get back to you shortly.
                    </DialogDescription>
                </DialogHeader>
                {success ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                            ✓
                        </div>
                        <h3 className="font-serif text-xl text-primary">Inquiry sent!</h3>
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
                        <div className="grid gap-2">
                            <Label htmlFor="guestCount">Guest Count</Label>
                            <Input
                                id="guestCount"
                                type="number"
                                min="1"
                                value={guestCount}
                                onChange={(e) => setGuestCount(e.target.value)}
                                placeholder="e.g., 50"
                                required
                            />
                        </div>
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
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                            {isSubmitting ? "Sending..." : "Send Inquiry"}
                        </Button>
                    </DialogFooter>
                </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default QuoteDialog;
