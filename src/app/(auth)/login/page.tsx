"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await signIn("credentials", {
            email: form.email,
            password: form.password,
            callbackUrl: "/dashboard",
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-semibold mb-6">Login</h1>

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

                <button className="w-full bg-blue-600 text-white p-3 rounded-xl">Login</button>
            </form>
        </div>
    );
}