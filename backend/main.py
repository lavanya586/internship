from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import jwt
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "my_super_secret_key_123" 
ALGORITHM = "HS256"


USER_FILE = "users.json"
PROJECT_FILE = "projects.json"

def load_data(file_name):
    """Reads data from the specified JSON file."""
    if not os.path.exists(file_name):
        return []
    try:
        with open(file_name, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(file_name, data):
    """Writes data to the specified JSON file with indentation."""
    with open(file_name, "w") as f:
        json.dump(data, f, indent=4)

# 3. User Registration Endpoint
@app.post("/register")
async def register(user: dict = Body(...)):
    users = load_data(USER_FILE)
    if any(u["email"] == user["email"] for u in users):
        raise HTTPException(status_code=400, detail="User already exists!")
    users.append(user)
    save_data(USER_FILE, users)
    return {"message": "Success"}


@app.post("/login")
async def login(credentials: dict = Body(...)):
    users = load_data(USER_FILE)
    for user in users:
        if user["email"] == credentials["email"] and user["password"] == credentials["password"]:
            # Set token payload with expiration (24 Hours)
            payload = {
                "sub": user["email"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
            return {"access_token": token, "token_type": "bearer"}
            
    raise HTTPException(status_code=401, detail="Invalid Email or Password!")

@app.get("/projects")
async def get_projects():
    return load_data(PROJECT_FILE)


@app.post("/create-project")
async def create_project(project: dict = Body(...)):
    projects = load_data(PROJECT_FILE)
    projects.append(project)
    save_data(PROJECT_FILE, projects)
    return {"message": "Project added successfully"}

@app.delete("/delete-project/{project_name}")
async def delete_project(project_name: str):
    projects = load_data(PROJECT_FILE)
    
    # Filtering the list to exclude the specified project
    new_projects = [p for p in projects if p.get("name") != project_name]
    
    if len(new_projects) == len(projects):
        raise HTTPException(status_code=404, detail="Project not found")
        
    save_data(PROJECT_FILE, new_projects)
    return {"message": "Project deleted successfully"}


@app.put("/update-project-status/{project_name}")
async def update_project(project_name: str, data: dict = Body(...)):
    projects = load_data(PROJECT_FILE)
    for p in projects:
        if p.get("name") == project_name:
          
            p["status"] = data.get("status") 
            save_data(PROJECT_FILE, projects)
            return {"message": "Status updated successfully"}
    
    raise HTTPException(status_code=404, detail="Project not found")