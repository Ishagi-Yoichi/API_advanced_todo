import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

async function createUser(req,res) {
    try {
        
        const{name, email, password} = req.body();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            console.log("User already exists with this email");
            return { error: "Email already exists" };
        }

        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
            },
        });
        console.log('User Created:', newUser);
        res.status(200).send({message:"User Created Sucessfully!"});
        const token = jwt.sign({newUser:email},"task",{
            expiresIn:"1h",
        });
        res.status(200).json({token});
        return newUser;
    } catch (error) {
        console.log("User Not Created", error);
        res.status(500).send({message:"Some error occureed"})
        return { error: error.message };
    } finally {
        await prisma.$disconnect();
    }
}

async function loginUser(email,password) {
    
}