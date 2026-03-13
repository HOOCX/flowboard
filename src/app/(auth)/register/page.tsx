"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(form),
        });

        await signIn("credentials", {
            email: form.email,
            password: form.password,
            callbackUrl: "/dashboard",
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-semibold mb-6">Create an Account</h1>

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e) => setForm({...form, email: e.target.value})}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e) => setForm({...form, password: e.target.value})}
                />

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl">
                    Register
                </button>
            </form>
        </div>
    );
}