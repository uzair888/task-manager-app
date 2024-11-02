import { NextRequest } from "next/server";
import { POST as login } from "../app/api/auth/login/route"; // Adjust import path

jest.setTimeout(10000);
describe("Auth API", () => {
  it("should fail login with invalid credentials", async () => {
    const req = new NextRequest(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "wrong@example.com",
          password: "wrongpassword",
        }),
      })
    );

    const res = await login(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.message).toBe("Invalid email or password");
  });
});
