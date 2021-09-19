"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var firestore_1 = require("@google-cloud/firestore");
var cors_1 = __importDefault(require("cors"));
var db = new firestore_1.Firestore({
    projectId: "csc-8-326008",
    keyFilename: "./keys.json",
});
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
var BASE_URL = "/api/v1";
// Test Endpoint
app.get(BASE_URL + "/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.status(200).send({
                message: "Testing Express app!",
            })];
    });
}); });
// Add a student to the database.
app.post(BASE_URL + "/add-student", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dbRef, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.collection("Students").add(req.body)];
            case 2:
                dbRef = _a.sent();
                if (dbRef.id) {
                    return [2 /*return*/, res.status(200).send({
                            status: "SUCCESS",
                            message: "Student added to database successfully.",
                        })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).send({
                        status: "ERROR",
                        message: "There was an error while adding the student to the database. Please try again!",
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Fetch all students from the database.
app.get(BASE_URL + "/get-students", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, studentDocs_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, db.collection("Students").get()];
            case 1:
                ref = _a.sent();
                studentDocs_1 = [];
                return [4 /*yield*/, ref.docs.forEach(function (doc) {
                        studentDocs_1.push(doc.data());
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).send({
                        students: studentDocs_1,
                        status: "SUCCESS",
                        message: "Successfully retrieved student data.",
                    })];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(500).send({
                        students: null,
                        status: "ERROR",
                        message: "There was an error while retrieving student data. Please try again.",
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Filters docs according to remaining properties if multiple search queries are present
var filterDocs = function (docs, firstName, lastName, sid) { return __awaiter(void 0, void 0, void 0, function () {
    var filteredData, students, _i, filteredData_1, item;
    return __generator(this, function (_a) {
        filteredData = [];
        if (firstName) {
            filteredData = docs.filter(function (doc) {
                return doc.data().firstNameNC.slice(0, firstName.length) ===
                    firstName.toLowerCase();
            });
        }
        if (lastName) {
            filteredData = docs.filter(function (doc) {
                return doc.data().lastNameNC.slice(0, lastName.length) ===
                    lastName.toLowerCase();
            });
        }
        if (sid) {
            filteredData = docs.filter(function (doc) {
                return doc.data().sidSTR.slice(0, sid.toString().length) === sid.toString();
            });
        }
        students = [];
        for (_i = 0, filteredData_1 = filteredData; _i < filteredData_1.length; _i++) {
            item = filteredData_1[_i];
            students.push(item.data());
        }
        return [2 /*return*/, students];
    });
}); };
// Search for a Student in the Database.
app.post(BASE_URL + "/search-student", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, filteredStudents, data, filteredStudents, data, filteredStudents, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                if (!req.body.firstName) return [3 /*break*/, 3];
                console.log("First Name is present");
                return [4 /*yield*/, db
                        .collection("Students")
                        .where("firstNameNC", ">=", req.body.firstName.toLowerCase())
                        .get()];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, filterDocs(data.docs, req.body.firstName, req.body.lastName, req.body.sid)];
            case 2:
                filteredStudents = _a.sent();
                res.status(200).send({ status: "SUCCESS", students: filteredStudents });
                return [3 /*break*/, 9];
            case 3:
                if (!req.body.lastName) return [3 /*break*/, 6];
                console.log("Last Name is present");
                return [4 /*yield*/, db
                        .collection("Students")
                        .where("lastNameNC", ">=", req.body.lastName.toLowerCase())
                        .get()];
            case 4:
                data = _a.sent();
                return [4 /*yield*/, filterDocs(data.docs, req.body.firstName, req.body.lastName, req.body.sid)];
            case 5:
                filteredStudents = _a.sent();
                res.status(200).send({ status: "SUCCESS", students: filteredStudents });
                return [3 /*break*/, 9];
            case 6:
                console.log("SID is present");
                return [4 /*yield*/, db
                        .collection("Students")
                        .where("sidSTR", ">=", req.body.sid.toString())
                        .get()];
            case 7:
                data = _a.sent();
                return [4 /*yield*/, filterDocs(data.docs, req.body.firstName, req.body.lastName, req.body.sid)];
            case 8:
                filteredStudents = _a.sent();
                res.status(200).send({ status: "SUCCESS", students: filteredStudents });
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(500).send({ status: "ERROR" })];
            case 11: return [2 /*return*/];
        }
    });
}); });
try {
    app.listen(port, function () {
        console.log("Successfully connected to port " + port);
    });
}
catch (error) {
    console.log(error);
}
