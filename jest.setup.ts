// jest.setup.ts
import dotenv from "dotenv";

// Load environment variables from .env.test or .env
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
// If you're using any libraries that require global setup, you can initialize them here.
// For example, if you need to set up a testing library like "jest-dom" for better assertions:
// import "@testing-library/jest-dom/extend-expect";

// Mock any global objects or methods if needed
beforeAll(() => {
  // Mock the console.error method to suppress error messages in test output
  jest.spyOn(console, "error").mockImplementation((message) => {
    if (message.includes("Warning:")) return; // Suppress React warnings
    console.log(message); // Log other errors
  });

  // You can set up other global mocks or initializations here
});

// Clean up after all tests run
afterAll(() => {
  jest.restoreAllMocks(); // Restore original implementations of mocked functions
});
