const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../index");
const User = require("../models/user");
const keys = require("./config/keys");
const { database } = keys;

// Configuration object for MongoDB connection
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
};

beforeAll(async () => {
  try {
    await mongoose.connect(database.url, mongoConfig);

    // Check connection status
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection failed");
    }
    console.log("Connected to MongoDB test database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.log("oke nha", MONGODB_URI);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Clean up test database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log("Closed MongoDB connection");
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
});

describe("Auth API Integration Tests", () => {
  let testUser;

  beforeEach(async () => {
    try {
      // Clear users collection before each test
      await User.deleteMany({});

      // Create a test user
      testUser = await User.create({
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        password: await bcrypt.hash("password123", 10),
      });
    } catch (error) {
      console.error("Error in test setup:", error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error("Error in test cleanup:", error);
      throw error;
    }
  });

  describe("POST /login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("testuser@example.com");
    });

    it("should return error for invalid email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invaliduser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("No user found for this email address.");
    });

    it("should return error for incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Password Incorrect");
    });

    it("should handle server errors gracefully", async () => {
      // Simulate database error by disconnecting mongoose
      await mongoose.connection.close();

      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);

      // Reconnect for other tests
      await mongoose.connect(MONGODB_URI, mongoConfig);
    });
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        email: "newuser@example.com",
        firstName: "New",
        lastName: "User",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe("newuser@example.com");

      // Verify user was actually saved to database
      const userInDb = await User.findOne({ email: "newuser@example.com" });
      expect(userInDb).toBeTruthy();
      expect(userInDb.firstName).toBe("New");
      expect(userInDb.lastName).toBe("User");
    });

    it("should return error for existing email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "testuser@example.com",
        firstName: "Duplicate",
        lastName: "User",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("That email address is already in use.");
    });

    it("should return error for missing required fields", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "missingfields@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/You must enter/);
    });

    it("should validate email format", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        firstName: "Test",
        lastName: "User",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/valid email/i);
    });
  });
});
