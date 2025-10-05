import  express from "express";
import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from "../controllers/todoController.js";
const router = express.Router();

router.post("/createTodo",createTodo);
router.delete("/deleteTodo",deleteTodo);
router.get("/getTodo",getAllTodos);
router.get("/getTodoId",getTodoById);
router.put("/updateTodo",updateTodo);


export default router;