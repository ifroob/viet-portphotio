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
            "title": "Professional Portrait Session",
            "description": "A skilled photographer capturing the perfect moment during a professional portrait session",
            "image_url": "https://images.unsplash.com/photo-1743446770828-180040aba491?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHBvcnRmb2xpb3xlbnwwfHx8fDE3NTI0MjU1MTF8MA&ixlib=rb-4.1.0&q=85",
            "camera_settings": {
                "aperture": "f/1.8",
                "shutter_speed": "1/200s",
                "iso": "ISO 400",
                "lens": "Fujifilm XF 35mm f/1.4",
                "focal_length": "35mm"
            }
        },
        {
            "title": "Natural Light Portrait",
            "description": "Beautiful portrait captured with natural lighting showcasing soft, even skin tones",
            "image_url": "https://images.unsplash.com/photo-1607865077798-50b8d3c253fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxwaG90b2dyYXBoeSUyMHBvcnRmb2xpb3xlbnwwfHx8fDE3NTI0MjU1MTF8MA&ixlib=rb-4.1.0&q=85",
            "camera_settings": {
                "aperture": "f/2.8",
                "shutter_speed": "1/125s",
                "iso": "ISO 200",
                "lens": "Fujifilm XF 56mm f/1.2",
                "focal_length": "56mm"
            }
        },
        {
            "title": "Artistic Still Life",
            "description": "Creative composition showcasing artistic vision with painting and natural elements",
            "image_url": "https://images.unsplash.com/photo-1505934763054-93cd118ee9dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxwaG90b2dyYXBoeSUyMHBvcnRmb2xpb3xlbnwwfHx8fDE3NTI0MjU1MTF8MA&ixlib=rb-4.1.0&q=85",
            "camera_settings": {
                "aperture": "f/5.6",
                "shutter_speed": "1/60s",
                "iso": "ISO 100",
                "lens": "Fujifilm XF 16-55mm f/2.8",
                "focal_length": "35mm"
            }
        },
        {
            "title": "Professional Equipment Setup",
            "description": "High-quality Sony DSLR camera with professional lenses showcasing technical excellence",
            "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjYW1lcmF8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "camera_settings": {
                "aperture": "f/8",
                "shutter_speed": "1/60s",
                "iso": "ISO 200",
                "lens": "Sony FE 24-70mm f/2.8",
                "focal_length": "50mm"
            }
        },
        {
            "title": "Fujifilm X-Series Camera",
            "description": "Professional Fujifilm camera system demonstrating technical expertise and equipment mastery",
            "image_url": "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxjYW1lcmF8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "camera_settings": {
                "aperture": "f/4",
                "shutter_speed": "1/125s",
                "iso": "ISO 800",
                "lens": "Fujifilm XF 23mm f/1.4",
                "focal_length": "23mm"
            }
        },
        {
            "title": "Vintage Camera Heritage",
            "description": "Classic vintage camera representing the rich history and tradition of photography",
            "image_url": "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxjYW1lcmF8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "camera_settings": {
                "aperture": "f/11",
                "shutter_speed": "1/30s",
                "iso": "ISO 400",
                "lens": "Vintage 50mm f/1.4",
                "focal_length": "50mm"
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