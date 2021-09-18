import { Student } from "./types.d";
import express, { Application, Request, Response } from "express";
import { DocumentData, Firestore } from "@google-cloud/firestore";
import cors from "cors";

const db = new Firestore({
  projectId: "csc-8-326008",
  keyFilename: "./keys.json",
});
const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(cors());
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

// Fetch all students from the database.
app.get(`${BASE_URL}/get-students`, async (req: Request, res: Response) => {
  try {
    const ref = await db.collection("Students").get();
    let studentDocs: Student[] = [];
    await ref.docs.forEach((doc) => {
      studentDocs.push(doc.data() as Student);
    });
    return res.status(200).send({
      students: studentDocs,
      status: "SUCCESS",
      message: "Successfully retrieved student data.",
    });
  } catch (error) {
    return res.status(500).send({
      students: null,
      status: "ERROR",
      message:
        "There was an error while retrieving student data. Please try again.",
    });
  }
});

// Filters docs according to remaining properties if multiple search queries are present
const filterDocs = async (
  docs: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>[],
  firstName?: string,
  lastName?: string,
  sid?: number
) => {
  let filteredData: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>[] =
    [];

  if (firstName) {
    filteredData = docs.filter(
      (doc) =>
        doc.data().firstNameNC.slice(0, firstName.length) ===
        firstName.toLowerCase()
    );
  }
  if (lastName) {
    filteredData = docs.filter(
      (doc) =>
        doc.data().lastNameNC.slice(0, lastName.length) ===
        lastName.toLowerCase()
    );
  }
  if (sid) {
    filteredData = docs.filter(
      (doc) =>
        doc.data().sidSTR.slice(0, sid.toString().length) === sid.toString()
    );
  }
  // console.log(students[0].data());
  let students: Student[] = [];
  for (let item of filteredData) {
    students.push(item.data() as Student);
  }
  return students;
};

// Search for a Student in the Database.
app.post(`${BASE_URL}/search-student`, async (req: Request, res: Response) => {
  try {
    // Check if First Name is present.
    if (req.body.firstName) {
      console.log("First Name is present");
      const data = await db
        .collection("Students")
        .where("firstNameNC", ">=", req.body.firstName.toLowerCase())
        .get();
      const filteredStudents = await filterDocs(
        data.docs,
        req.body.firstName,
        req.body.lastName,
        req.body.sid
      );
      res.status(200).send({ status: "SUCCESS", students: filteredStudents });
    } else if (req.body.lastName) {
      console.log("Last Name is present");
      const data = await db
        .collection("Students")
        .where("lastNameNC", ">=", req.body.lastName.toLowerCase())
        .get();
      const filteredStudents = await filterDocs(
        data.docs,
        req.body.firstName,
        req.body.lastName,
        req.body.sid
      );
      res.status(200).send({ status: "SUCCESS", students: filteredStudents });
    } else {
      console.log("SID is present");
      const data = await db
        .collection("Students")
        .where("sidSTR", ">=", req.body.sid.toString())
        .get();
      const filteredStudents = await filterDocs(
        data.docs,
        req.body.firstName,
        req.body.lastName,
        req.body.sid
      );
      res.status(200).send({ status: "SUCCESS", students: filteredStudents });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "ERROR" });
  }
});

try {
  app.listen(port, (): void => {
    console.log(`Successfully connected to port ${port}`);
  });
} catch (error) {
  console.log(error);
}
