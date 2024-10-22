import express from "express";
import { DocumentController } from "../controllers/document.controller";
import userMiddleware from "../middlewares/user.middleware";

const document = express.Router();

document.post("/save", DocumentController.saveDocument);
document.get("/all", userMiddleware.hasAllRoles(["receptionist", "operator"]), DocumentController.getAllDocumentByUser)
document.get("/:id", userMiddleware.hasAllRoles(["receptionist", "operator"]), DocumentController.getDocumentById)
document.post("/generateLink/:id",userMiddleware.hasAllRoles(["receptionist","operator"]),DocumentController.convertDocumentToLink)
export default document;
