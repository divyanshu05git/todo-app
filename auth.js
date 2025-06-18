const express=require("express")
const jwt=require("jsonwebtoken")
const cors=require("cors")

const app=express();
app.use(express.json());
app.use(cors());

const JWT_SECRET="secret1234"

let users=[]
let todos={}

function auth(req,res,next){
    const token=req.headers['authorization'].split(' ')[1];

    if(token){
            jwt.verify(token,JWT_SECRET,(err,data)=>{
                if(err){
                    res.status(401).send({
                        message:"Unauthorized"
                    })
                }
                else{
                    req.user=data;
                    next();
                }
            });
        }
    else{
        res.status(401).send({
            message:"Unauthorized"
        })
    }
}

app.post("/signup",(req,res)=>{
    const {username,password}=req.body;

    if(users.find(u=>u.username===username)){
        res.status(409).json({
            message:"username already exists"
        })
        return ;
    }
    users.push({username,password});
    res.json({
        message:"Signup done go to signin box"
    })
})

app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const user=users.find(u=>u.username===username&&u.password===password)

    if(user){
        const token=jwt.sign({
            username:username,
        },JWT_SECRET);
        
        res.json({
            message:"signin done",
            token:token
        })
    }
    else{
        res.status(401).json({
            message:"Invalid credentials"
        })
    }

})

app.post("/todos",auth,(req,res)=>{
    const username=req.user.username
    const task=req.body; //{title:"Buy milk"}

    if(!todos[username]) todos[username]=[];
    
    todos[username].push({
        title:task.title
    })

    res.json({
        message:"Todo added"
    })
})

app.get("/todos", auth, (req, res) => {
    const username = req.user.username;
    res.json(todos[username] || []);
});


app.delete("/todos/first",auth,(req,res)=>{
    todos[req.user.username].splice(0,1);
    res.json({
        message:"first todo is deleted"
    })
})

app.delete("/todos/last",auth,(req,res)=>{
    todos[req.user.username].splice(todos[req.user.username].length-1,1);
    res.json({
        message:"last todo is deleted"
    })
})
app.listen(3000)