import { NextRequest } from "next/server";
import { POST as createTask, GET as getTasks } from "../app/api/tasks/route";
import { POST as login } from "../app/api/auth/login/route";
import User from "../models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

// beforeAll(async () => {
//   await dbConnect();
//   // Clear the user database and create a test user with hashed password
//   await User.deleteMany({});
//   const hashedPassword = await bcrypt.hash("123", 10); // Hashing the password
//   const user = await User.create({
//     email: "uzairsarwar10@gmail.com",
//     password: hashedPassword,
//   });
//   console.log("Test user created:", user); // Log the user
// });
jest.setTimeout(10000);
describe("Tasks API", () => {
  let token: string;

  beforeAll(async () => {
    // Log in to retrieve the token using the correct credentials
    const req = new NextRequest(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "uzairsarwar10@gmail.com",
          password: "123",
        }),
      })
    );

    const res = await login(req);
    token = res.cookies.get("token")?.value || ""; // Capture the token
    expect(res.status).toBe(200); // Ensure login was successful
  });

  it("should create a new task", async () => {
    const req = new NextRequest(
      new Request("http://localhost/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({
          title: "New Task",
          description: "This is a new task",
          dueDate: new Date().toISOString(),
          completed: false,
        }),
      })
    );

    const res = await createTask(req);
    expect(res.status).toBe(201); // Expect created status
    const json = await res.json();
    expect(json.title).toBe("New Task");
  });

  it("should fetch tasks", async () => {
    const req = new NextRequest(
      new Request("http://localhost/api/tasks", {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
      })
    );

    const res = await getTasks(req);
    expect(res.status).toBe(200); // Expect success status
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true); // Expect the response to be an array
  });
});
