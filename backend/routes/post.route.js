import express from "express";
import {verifyToken} from "../middleware/verifytoken.js"
import { addpost, deletepost, getpost, getposts, updatepost } from "../controllers/post.controller.js";


const router = express.Router()

router.get("/",getposts);
router.get("/:id",getpost);
router.post("/",verifyToken,addpost);
router.put("/:id",verifyToken,updatepost);
router.delete("/:id",verifyToken,deletepost);




export default router;