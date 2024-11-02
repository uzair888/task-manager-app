import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { Task as ITask, ParamProps } from "@/types/index";

export async function GET(req: NextRequest, { params }: ParamProps) {
  await dbConnect();
  const { id } = await params;
  const tasks = await Task.find({ id });
  return NextResponse.json(tasks);
}
export async function PUT(req: NextRequest, { params }: ParamProps) {
  await dbConnect();
  const { id } = await params;
  const { title, description, dueDate, completed } =
    (await req.json()) as Partial<ITask>;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { title, description, dueDate, completed },
    { new: true }
  );
  return updatedTask
    ? NextResponse.json(updatedTask)
    : NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest, { params }: ParamProps) {
  await dbConnect();
  const { id } = await params;

  const deletedTask = await Task.findByIdAndDelete(id);
  return deletedTask
    ? NextResponse.json({ message: "Task deleted" })
    : NextResponse.json({ error: "Task not found" }, { status: 404 });
}
