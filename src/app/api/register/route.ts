import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
        },
    });

    return new Response(JSON.stringify(user));
}