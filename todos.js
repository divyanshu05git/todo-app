let todos=[]
async function signup(){
    const username=document.getElementById("signup-username").value;
    const password=document.getElementById("signup-password").value;
    try{
        const response=await axios({
            url:"http://localhost:3000/signup",
            method:"POST",
            data:{
                username:username,
                password:password
            }
        })
        alert("you are signed up")
    }
    catch(err){
        if(err.response&&err.response.status===409){
            alert("username already exist")
        }
        else{
            alert("Signed up failed ,something went wrong")
        }
    }
}

async function signin(){
    const username=document.getElementById("signin-username").value;
    const password=document.getElementById("signin-password").value;

    try{
        const response=await axios({
            url:"http://localhost:3000/signin",
            method:"POST",
            data:{
                username:username,
                password:password
            }
        })

        const token=response.data.token;

        localStorage.setItem("token",token);
        localStorage.setItem("username",username);

        document.getElementById("signup").style.display = "none";
        document.getElementById("signin").style.display = "none";
        document.getElementById("todo-section").style.display = "block";

        await loadTodos();
        alert("you are signed in")

    }
    catch(err){
        if(err.response&&err.response.status===401){
            alert("invalid credentials")
        }
        else{
            alert("sign in failed")
        }
    }
}

async function loadTodos(){
    try{
        const token=localStorage.getItem("token");
        const response=await axios.get("http://localhost:3000/todos",{
            headers:{Authorization:`Bearer ${token}`}
        })

        todos=response.data;
        render();
    }catch(err){
        alert("failed to load todos")
    }
}

async function addTodo(){
    const input=document.getElementById("input");
    const token=localStorage.getItem("token");

    try{
        await axios({
            url:"http://localhost:3000/todos",
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`
            },
            data:{
                title:input.value
            }
        })
        await loadTodos();
    }
    catch(err){
        alert("Failed to add Todo")
    }
}

async function deleteFirst(){
    const token=localStorage.getItem("token")

    try{
        await axios.delete("http://localhost:3000/todos/first",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        await loadTodos();
    }catch(err){
        alert("Failed to delete first todo")
    }
}

async function deleteLast(){
    const token=localStorage.getItem("token")

    try{
        await axios.delete("http://localhost:3000/todos/last",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        await loadTodos();
    }catch(err){
        alert("Failed to delete  todo")
    }
}

function render(){
    const list=document.querySelector("#lists")
    list.innerHTML=""
    for(let i=0;i<todos.length;i++){
        const li=createComponent(todos[i])
        list.appendChild(li);
    }
}

function createComponent(task){
    const li=document.createElement("li")
    const h1=document.createElement("h1")

    h1.innerHTML=task.title
    li.appendChild(h1);

    return li;
}



