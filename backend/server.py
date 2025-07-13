from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: str
    camera_settings: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PhotoCreate(BaseModel):
    title: str
    description: str
    image_url: str
    camera_settings: dict

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    photo_id: str
    name: str
    comment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CommentCreate(BaseModel):
    photo_id: str
    name: str
    comment: str

class PhotoRecipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    settings: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PhotoRecipeCreate(BaseModel):
    name: str
    settings: dict

# Existing routes
@api_router.get("/")
async def root():
    return {"message": "Brian's Photography Portfolio API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Photo routes
@api_router.get("/photos", response_model=List[Photo])
async def get_photos():
    photos = await db.photos.find().to_list(1000)
    return [Photo(**photo) for photo in photos]

@api_router.post("/photos", response_model=Photo)
async def create_photo(photo: PhotoCreate):
    photo_dict = photo.dict()
    photo_obj = Photo(**photo_dict)
    _ = await db.photos.insert_one(photo_obj.dict())
    return photo_obj

@api_router.get("/photos/{photo_id}", response_model=Photo)
async def get_photo(photo_id: str):
    photo = await db.photos.find_one({"id": photo_id})
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    return Photo(**photo)

# Comment routes
@api_router.get("/photos/{photo_id}/comments", response_model=List[Comment])
async def get_comments(photo_id: str):
    comments = await db.comments.find({"photo_id": photo_id}).to_list(1000)
    return [Comment(**comment) for comment in comments]

@api_router.post("/photos/{photo_id}/comments", response_model=Comment)
async def create_comment(photo_id: str, comment: CommentCreate):
    comment_dict = comment.dict()
    comment_dict["photo_id"] = photo_id
    comment_obj = Comment(**comment_dict)
    _ = await db.comments.insert_one(comment_obj.dict())
    return comment_obj

@api_router.get("/comments", response_model=List[Comment])
async def get_all_comments():
    comments = await db.comments.find().to_list(1000)
    return [Comment(**comment) for comment in comments]

# Photo Recipe routes
@api_router.get("/recipes", response_model=List[PhotoRecipe])
async def get_recipes():
    recipes = await db.recipes.find().to_list(1000)
    return [PhotoRecipe(**recipe) for recipe in recipes]

@api_router.post("/recipes", response_model=PhotoRecipe)
async def create_recipe(recipe: PhotoRecipeCreate):
    recipe_dict = recipe.dict()
    recipe_obj = PhotoRecipe(**recipe_dict)
    _ = await db.recipes.insert_one(recipe_obj.dict())
    return recipe_obj

@api_router.get("/recipes/{recipe_id}", response_model=PhotoRecipe)
async def get_recipe(recipe_id: str):
    recipe = await db.recipes.find_one({"id": recipe_id})
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return PhotoRecipe(**recipe)

# Initialize sample data
@api_router.post("/init-sample-data")
async def init_sample_data():
    # Sample photos with camera settings
    sample_photos = [
        {
            "title": "Golden Hour Portrait",
            "description": "A beautiful portrait captured during golden hour with soft natural lighting",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
            "camera_settings": {
                "aperture": "f/1.8",
                "shutter_speed": "1/200s",
                "iso": "ISO 400",
                "lens": "Fujifilm XF 35mm f/1.4",
                "focal_length": "35mm"
            }
        },
        {
            "title": "City Landscape",
            "description": "Urban landscape with dramatic sky and architectural elements",
            "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
            "camera_settings": {
                "aperture": "f/8",
                "shutter_speed": "1/60s",
                "iso": "ISO 200",
                "lens": "Fujifilm XF 16-55mm f/2.8",
                "focal_length": "24mm"
            }
        },
        {
            "title": "Nature Macro",
            "description": "Close-up macro shot of morning dew on leaves",
            "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
            "camera_settings": {
                "aperture": "f/2.8",
                "shutter_speed": "1/125s",
                "iso": "ISO 100",
                "lens": "Fujifilm XF 80mm f/2.8 Macro",
                "focal_length": "80mm"
            }
        }
    ]
    
    # Insert sample photos
    for photo_data in sample_photos:
        photo_obj = Photo(**photo_data)
        await db.photos.insert_one(photo_obj.dict())
    
    return {"message": "Sample data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()