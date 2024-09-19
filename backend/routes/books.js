import { Router } from "express";
const router = Router();
import auth from '../middleware/auth.js';
import multer from '../middleware/multer-config.js';
import {compressAndResizeImage} from '../middleware/sharp.js'
import { getAllBooks, getOneBook, createBook, modifyBook, deleteBook, rateBook, bestRatedBooks} from "../controllers/books.js";

router.get("/", getAllBooks);
router.get("/bestrating", bestRatedBooks)
router.get("/:id", getOneBook);
router.post("/", auth, multer, compressAndResizeImage, createBook);
router.post("/:id/rating", auth, rateBook)
router.put("/:id", auth, multer, compressAndResizeImage, modifyBook);
router.delete("/:id", auth, multer, deleteBook);


export default router;
