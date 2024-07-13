import express from "express";
import { profilePosts,savePost,deleteUser, getUsers,getUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

router.get("/",getUsers);

//  router.get("/:id",verifyToken,getUser);

router.put("/:id",verifyToken,updateUser);

router.delete("/:id",verifyToken,deleteUser);

router.post("/save",verifyToken,savePost);

router.get("/profilePosts",verifyToken,profilePosts);


export default router;