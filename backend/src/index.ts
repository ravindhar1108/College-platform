import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(express.json());

// Auth Routes
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: "User already exists or invalid data" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// College Routes
app.get("/api/colleges", async (req: Request, res: Response) => {
  try {
    const { search, state, minFee, maxFee, minRating, sortBy } = req.query;

    const where: any = {};
    if (search) {
      where.name = { contains: String(search), mode: "insensitive" };
    }
    if (state) {
      where.location = String(state);
    }
    if (minFee || maxFee) {
      where.ugFee = {
        gte: minFee ? parseInt(String(minFee)) : undefined,
        lte: maxFee ? parseInt(String(maxFee)) : undefined,
      };
    }
    if (minRating) {
      where.rating = { gte: parseFloat(String(minRating)) };
    }

    const colleges = await prisma.college.findMany({
      where,
      orderBy: sortBy ? { [String(sortBy)]: "desc" } : undefined,
      include: { courses: true, reviews: true },
    });

    res.json({ data: colleges, meta: { total: colleges.length } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching colleges" });
  }
});

app.get("/api/colleges/stats", async (req: Request, res: Response) => {
  try {
    const colleges = await prisma.college.findMany();
    const states = Array.from(new Set(colleges.map((c: any) => c.location)));
    const fees = colleges.map((c: any) => c.ugFee);
    const minFee = fees.length > 0 ? Math.min(...fees) : 0;
    const maxFee = fees.length > 0 ? Math.max(...fees) : 0;

    res.json({
      minFee,
      maxFee,
      states,
      totalColleges: colleges.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

app.get("/api/colleges/:id", async (req: Request, res: Response) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: parseInt(String(req.params.id)) },
      include: { courses: true, reviews: true },
    });
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: "Error fetching college" });
  }
});

app.post("/api/colleges/compare", async (req: Request, res: Response) => {
  try {
    const { collegeIds } = req.body;
    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds.map((id: any) => parseInt(id)) } },
      include: { courses: true, reviews: true },
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Error comparing colleges" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
