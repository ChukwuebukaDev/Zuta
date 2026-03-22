import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });
    }

    // 🔥 Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const { password, ...safeUser } = user;

    return new Response(JSON.stringify({ user: safeUser, token }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
    });
  }
}
