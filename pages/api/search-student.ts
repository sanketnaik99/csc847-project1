// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { DocumentData, Firestore } from "@google-cloud/firestore";
import { Student } from "./types";

type StandardResponse = {
  status: string;
  message: string;
};

type StudentResponse = StandardResponse & { students: Student[] };

const db = new Firestore({
  projectId: "csc-8-326008",
  // keyFilename: "./keys.json",
  credentials: {
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
  },
});

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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<StudentResponse>
) => {
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
      res.status(200).send({
        status: "SUCCESS",
        message: "Successfully retrieved student data.",
        students: filteredStudents,
      });
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
      res.status(200).send({
        status: "SUCCESS",
        message: "Successfully retrieved student data.",
        students: filteredStudents,
      });
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
      res.status(200).send({
        status: "SUCCESS",
        message: "Successfully retrieved student data.",
        students: filteredStudents,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "ERROR",
      message: "Error retrieving student data",
      students: [],
    });
  }
};

export default handler;
