import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { Task as ITask } from "@/types/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, dueDate, completed } =
    (await req.json()) as ITask;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log(decoded, "userrrriiid");

    const newTask = new Task({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      description,
      dueDate,
      completed,
    });
    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;

    const tasks = await Task.find({ userId });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
