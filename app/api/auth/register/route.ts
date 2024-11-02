import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();
  const trimmedEmail = email ? email.trim() : "";
  if (
    !trimmedEmail ||
    !password ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
  ) {
    return NextResponse.json(
      { error: "A valid email and password are required." },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email: trimmedEmail });
  if (existingUser) {
    return NextResponse.json(
      { error: "User with this email already exists." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email: trimmedEmail, password: hashedPassword });
  await newUser.save();

  return NextResponse.json({ token: generateToken(newUser._id) });
}
