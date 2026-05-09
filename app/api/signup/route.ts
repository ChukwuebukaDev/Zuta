import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";

// 1. Define the validation schema
const signUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(), // Match your schema (optional or required)
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 2. Validate input
    const validation = signUpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() }, 
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validation.data;

    // 3. Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists,log in instead" },
        { status: 400 }
      );
    }

    // 4. Hash and Create
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        // phone, // Uncomment if 'phone' is in your Prisma schema
        password: hashedPassword,
      },
    });

    // 5. Success response (Exclude password)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    }, { status: 201 }); // 201 Created is better for new records

  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}