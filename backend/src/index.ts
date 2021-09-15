import { Student } from "./types.d";
import express, { Application, Request, Response } from "express";
import { Firestore } from "@google-cloud/firestore";

const db = new Firestore({
  projectId: "csc-8-326008",
  keyFilename: "./keys.json",
});
const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BASE_URL = "/api/v1";

// Test Endpoint
app.get(`${BASE_URL}/`, async (req: Request, res: Response) => {
  return res.status(200).send({
    message: "Testing Express app!",
  });
});

// Add a student to the database.
app.post(`${BASE_URL}/add-student`, async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const dbRef = await db.collection("Students").add(req.body as Student);
    if (dbRef.id) {
      return res.status(200).send({
        status: "SUCCESS",
        message: "Student added to database successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "ERROR",
      message:
        "There was an error while adding the student to the database. Please try again!",
    });
  }
});

try {
  app.listen(port, (): void => {
    console.log(`Successfully connected to port ${port}`);
  });
} catch (error) {
  console.log(error);
}
