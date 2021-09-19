import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { object, string, number } from "yup";
import { Student } from ".";

const AddStudent = () => {
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const studentSchema = object().shape({
    sid: number().required("A student ID is required."),
    firstName: string()
      .required("The first name is required")
      .min(3, "Please enter a valid first name.")
      .max(25, "Please enter a valid first name."),
    lastName: string()
      .required("The last name is required.")
      .min(3, "Please enter a valid last name.")
      .max(30, "Please enter a valid last name."),
    email: string()
      .email("Please enter a valid email address.")
      .required("An email is required."),
    mailingAddress: string()
      .required("A mailling address is required")
      .min(5, "Please enter a valid address."),
    gpa: number()
      .required("A GPA is required.")
      .min(0, "Please enter a valid GPA")
      .max(4, "The GPA cannot be more than 4.0"),
  });

  // Form Submit Handler
  const handleFormSubmit = async (values: Student, resetForm: any) => {
    setLoading(true);
    const student: Student = {
      ...values,
      firstNameNC: values.firstName.toLowerCase(),
      lastNameNC: values.lastName.toLowerCase(),
      sidSTR: values.sid.toString(),
    };
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/add-student`,
      student
    );
    console.log(data);
    if (data.status == 200) {
      console.log(resetForm);
      resetForm({});
    }
    setLoading(false);
    setStatus(data.data.status);
    setMessage(data.data.message);
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-20 w-full">
        <h1 className="text-3xl font-bold px-3">Add Student</h1>
        <h4 className="text-xl font-medium text-gray-600 pt-3 text-center px-3">
          Fill out the form below to add a new student&apos;s information to the
          database.
        </h4>
        <Formik
          initialValues={{
            sid: 0,
            firstName: "",
            lastName: "",
            email: "",
            mailingAddress: "",
            gpa: 0,
          }}
          validationSchema={studentSchema}
          onSubmit={(values, { resetForm }) =>
            handleFormSubmit(values, resetForm)
          }
        >
          {({ errors, touched, handleChange, handleSubmit, values }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center mt-5"
            >
              {/* Student ID Field */}
              <div className="relative mb-4 px-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <label
                  htmlFor="sid"
                  className="leading-7 text-sm text-gray-600"
                >
                  Student ID
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  id="sid"
                  name="sid"
                  value={values.sid}
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                {errors.sid && touched.sid ? (
                  <div className="text-red-500">{errors.sid}</div>
                ) : null}
              </div>
              {/* First Name Field */}
              <div className="relative mb-4 px-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <label
                  htmlFor="f-name"
                  className="leading-7 text-sm text-gray-600"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="f-name"
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                {errors.firstName && touched.firstName ? (
                  <div className="text-red-500">{errors.firstName}</div>
                ) : null}
              </div>
              {/* Last Name Field */}
              <div className="relative mb-4 px-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <label
                  htmlFor="l-name"
                  className="leading-7 text-sm text-gray-600"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="l-name"
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                {errors.lastName && touched.lastName ? (
                  <div className="text-red-500">{errors.lastName}</div>
                ) : null}
              </div>
              {/* Email Field */}
              <div className="relative mb-4 px-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                {errors.email && touched.email ? (
                  <div className="text-red-500">{errors.email}</div>
                ) : null}
              </div>
              {/* Mailing Address Field */}
              <div className="relative mb-4 px-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <label
                  htmlFor="address"
                  className="leading-7 text-sm text-gray-600"
                >
                  Mailing Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={values.mailingAddress}
                  onChange={handleChange}
                  name="mailingAddress"
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                {errors.mailingAddress && touched.mailingAddress ? (
                  <div className="text-red-500">{errors.mailingAddress}</div>
                ) : null}
              </div>
              {/* GPA Field */}
              <div className="relative mb-4 px-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <label
                  htmlFor="gpa"
                  className="leading-7 text-sm text-gray-600"
                >
                  GPA
                </label>
                <input
                  type="number"
                  id="gpa"
                  step="0.01"
                  name="gpa"
                  value={values.gpa}
                  onChange={handleChange}
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                {errors.gpa && touched.gpa ? (
                  <div className="text-red-500">{errors.gpa}</div>
                ) : null}
              </div>

              {/* SUBMIT and Loading Button */}
              {isLoading ? (
                <div className="rounded-lg bg-blue-600 text-white px-10 py-3 mt-4 hover:bg-blue-700 hover:shadow-md">
                  <div className="sk-fading-circle">
                    <div className="sk-circle1 sk-circle"></div>
                    <div className="sk-circle2 sk-circle"></div>
                    <div className="sk-circle3 sk-circle"></div>
                    <div className="sk-circle4 sk-circle"></div>
                    <div className="sk-circle5 sk-circle"></div>
                    <div className="sk-circle6 sk-circle"></div>
                    <div className="sk-circle7 sk-circle"></div>
                    <div className="sk-circle8 sk-circle"></div>
                    <div className="sk-circle9 sk-circle"></div>
                    <div className="sk-circle10 sk-circle"></div>
                    <div className="sk-circle11 sk-circle"></div>
                    <div className="sk-circle12 sk-circle"></div>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  onClick={() => handleSubmit}
                  className="rounded-lg bg-blue-600 text-white px-10 py-3 mt-4 hover:bg-blue-700 hover:shadow-md"
                >
                  Submit
                </button>
              )}

              {/* SUCCESS OR ERROR MESSAGE */}
              {message ? (
                <p
                  className={[
                    `mt-4 px-4 text-center font-sans text-md font-semibold `,
                    status == "SUCCESS" ? "text-green-700" : "text-red-600",
                  ].join(" ")}
                >
                  {message}
                </p>
              ) : null}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddStudent;
