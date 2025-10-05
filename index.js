import express from 'express';
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js"
const app = express();
app.use(express.json());
const PORT = 3000;

// let todos=[
//     {id:1,text:"Express routing",done:true},
//     {id:2,text:"Express middleware",done:false},
//     {id:3,text:"Express throttling",done:true}
// ]

app.use("/api/auth",userRoutes);
app.use("/todos",todoRoutes);

// app.get('/todos',(req,res)=>{
//     res.json(todos);
// })
// app.get('/todos/:id',(req,res)=>{
//     const id = parseInt(req.params.id);
//     const todo = todos.find((t)=>t.id===id);
//     if(!todo){
//         return res.status(404).json({error:"todo not found"});
//     }
//     res.json(todo);
// })

// app.post("/todos",(req,res)=>{
//     const newTodo={
//         id: todos.length+1,
//         text: req.body.text,
//         done:false,
//     };
//     todos.push(newTodo);
//     res.status(201).json(newTodo);
// })

// app.put('/todos/:id',(req,res)=>{
//     const id = parseInt(req.params.id);
//     const todo = todos.find((t)=>t.id ===id);
//     if(!todo) return res.status(404).json({error:"todo not found"});
//     else{
//         todo.text = req.body.text || todo.text;
//         todo.done = req.body.done ?? todo.done;
//         res.json(todo);
//     }
// })

// app.delete('/todos/:id',(req,res)=>{
//     const id = parseInt(req.params.id);
//     const index = todos.findIndex((t)=>t.id===id);
//     if(index==-1) return res.status(404).json({error:"todo not found"})
//         else{
//             const todo = todos.splice(index,1);
//             res.json(todos);
//         }
// });


app.listen(PORT,(error)=>{
    if(!error) console.log(`Listening on port ${PORT}`);
    else console.log("Error occureed,server can't start",error);
});
