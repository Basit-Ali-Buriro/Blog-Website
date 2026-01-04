import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function POST(request) {
    try {
        const { email, password, name } = await request.json()

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Email, password, and name are required" },
                { status: 400 }
            );
        }
        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            )
        }
        await dbConnect()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            )
        }
        const newUser = new User({
            email: email.toLowerCase(),
            password, // Password will be hashed by the pre-save hook in User model
            name,
            role: "user", // Default role
        });

        await newUser.save();
        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "An error occurred during signup" },
            { status: 500 }
        );
    }

}