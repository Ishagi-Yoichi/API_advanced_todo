import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export async function createUser(req,res) {
    try {
        
        const{name, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            
            return res.status(400).json({ error: "Email already exists" });
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
        console.log('User Created:', newUser.name);
        
        const token = jwt.sign({email:newUser.email,id:newUser.id},"task",{
            expiresIn:"1h",
        });
        return res.status(200).json({message:"User Created Successfully",token});
        
    } catch (error) {
        console.error("User Not Created", error);
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}
//login userr
export async function loginUser(req,res) {
    try{
        const {email,password} = req.body;
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if(user){
            const pwmatch = await bcrypt.compare(password,user.password);
            if(!pwmatch){
                return res.status(401).json({error:"Authentication Failed"})
            }
            const token = jwt.sign({id:user.id,email:user.email},"task",{
                expiresIn:"1h",
            });
            return res.status(200).json({message:"Login Successful",token});
        }else{
            res.status(404).send({message:"user doesn't exist"});
        }
    }catch(error){
        console.error("Login error",error.message);
        res.status(500).send({message:"Some error occurred"});
    }
    finally{
        await prisma.$disconnect();
    }
};
