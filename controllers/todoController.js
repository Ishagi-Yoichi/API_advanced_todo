import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

// Get all todos for authenticated user
export async function getAllTodos(req, res) {
    try {
        const userId = req.user.id; // Assuming user is attached from auth middleware
        
        const todos = await prisma.todos.findMany({
            
            // orderBy: {
            //     createdAt: 'desc'
            // }
        });
        
        
        res.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Internal server error" });
    } //finally {
    //     await prisma.$disconnect();
    // }
}

// Get a single todo by ID
export async function getTodoById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const todo = await prisma.todo.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });
        
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        
        res.json(todo);
    } catch (error) {
        console.error("Error fetching todo:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}

// Create a new todo
export async function createTodo(req, res) {
    try {
        const { text } = req.body;
        const userId = req.user.id;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: "Text is required" });
        }
        
        const newTodo = await prisma.todo.create({
            data: {
                text: text.trim(),
                done: false,
                userId: userId
            }
        });
        
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}

// Update a todo
export async function updateTodo(req, res) {
    try {
        const { id } = req.params;
        const { text, done } = req.body;
        const userId = req.user.id;
        
        // Check if todo exists and belongs to user
        const existingTodo = await prisma.todo.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });
        
        if (!existingTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        
        // Update todo
        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...(text !== undefined && { text: text.trim() }),
                ...(done !== undefined && { done: Boolean(done) })
            }
        });
        
        res.json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}

// Delete a todo
export async function deleteTodo(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Check if todo exists and belongs to user
        const existingTodo = await prisma.todo.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });
        
        if (!existingTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        
        // Delete todo
        await prisma.todo.delete({
            where: {
                id: parseInt(id)
            }
        });
        
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}
