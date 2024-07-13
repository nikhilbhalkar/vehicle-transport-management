import express from "express";
import { shouldadmin, shouldlogedin } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router()

router.get("/shouldlogin",verifyToken, shouldlogedin);

router.get("/shouldadmin",shouldadmin);


export default router;