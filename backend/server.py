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
import psutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging early
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection - updated for Atlas
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'portfolio_db')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI(
    title="Brian's Photography Portfolio API",
    description="A comprehensive photography portfolio API with blog, gallery, and admin features",
    version="1.0.0"
)

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

class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    slug: str
    author: str = "Brian"
    tags: List[str] = []
    publish_date: datetime = Field(default_factory=datetime.utcnow)
    is_published: bool = True
    featured_image: Optional[str] = None
    meta_description: Optional[str] = None
    read_time: int = 5  # estimated read time in minutes

class ArticleCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    slug: str
    tags: List[str] = []
    is_published: bool = True
    featured_image: Optional[str] = None
    meta_description: Optional[str] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    slug: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    featured_image: Optional[str] = None
    meta_description: Optional[str] = None

class GalleryPhoto(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    image_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    category: str = "general"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class GalleryPhotoCreate(BaseModel):
    title: str
    image_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    category: str = "general"

# Health check endpoint for Railway
@app.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

# Monitoring endpoints
@api_router.get("/monitoring/usage")
async def get_usage_stats():
    """Get current resource usage stats"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "memory_used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 2),
        "disk_usage_percent": psutil.disk_usage('/').percent,
        "active_connections": len(psutil.net_connections()),
        "uptime_seconds": (datetime.utcnow() - datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
    }

@api_router.get("/monitoring/health-detailed")
async def detailed_health_check():
    """Detailed health check with resource usage"""
    try:
        # Test database connection
        await db.admin.command('ping')
        db_status = "connected"
        
        # Get collection counts
        photos_count = await db.photos.count_documents({})
        articles_count = await db.articles.count_documents({})
        comments_count = await db.comments.count_documents({})
        gallery_count = await db.gallery.count_documents({})
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": {
                "status": db_status,
                "photos": photos_count,
                "articles": articles_count,
                "comments": comments_count,
                "gallery": gallery_count
            },
            "system": {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_percent": psutil.virtual_memory().percent,
                "memory_used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")

@api_router.get("/monitoring/dashboard")
async def monitoring_dashboard():
    """Simple monitoring dashboard data"""
    
    # Get current usage
    usage_stats = {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "memory_used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 2),
        "active_connections": len(psutil.net_connections())
    }
    
    # Get database stats
    db_stats = {
        "photos": await db.photos.count_documents({}),
        "articles": await db.articles.count_documents({}),
        "comments": await db.comments.count_documents({}),
        "gallery": await db.gallery.count_documents({})
    }
    
    # Estimate monthly cost (rough calculation)
    estimated_monthly_cost = {
        "cpu_cost": round(usage_stats["cpu_percent"] * 0.01, 2),  # Rough estimate
        "memory_cost": round(usage_stats["memory_used_mb"] * 0.001, 2),  # Rough estimate
        "estimated_total": round(usage_stats["cpu_percent"] * 0.01 + usage_stats["memory_used_mb"] * 0.001, 2)
    }
    
    return {
        "usage": usage_stats,
        "database": db_stats,
        "cost_estimate": estimated_monthly_cost,
        "alerts": {
            "high_cpu": usage_stats["cpu_percent"] > 80,
            "high_memory": usage_stats["memory_percent"] > 80,
            "high_connections": usage_stats["active_connections"] > 100
        }
    }

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Brian's Photography Portfolio API", "status": "running"}

# Existing routes
@api_router.get("/")
async def api_root():
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

@api_router.get("/photos/{photo_id}", response_model=Photo)
async def get_photo(photo_id: str):
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return Photo(**photo)

@api_router.post("/photos", response_model=Photo)
async def create_photo(photo: PhotoCreate):
    photo_dict = photo.dict()
    photo_obj = Photo(**photo_dict)
    _ = await db.photos.insert_one(photo_obj.dict())
    return photo_obj

@api_router.put("/photos/{photo_id}", response_model=Photo)
async def update_photo(photo_id: str, photo_update: PhotoCreate):
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    update_dict = photo_update.dict()
    update_dict["timestamp"] = datetime.utcnow()
    
    await db.photos.update_one(
        {"id": photo_id},
        {"$set": update_dict}
    )
    
    updated_photo = await db.photos.find_one({"id": photo_id})
    return Photo(**updated_photo)

@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str):
    result = await db.photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}

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

# Blog Article routes
@api_router.get("/articles", response_model=List[Article])
async def get_articles(skip: int = 0, limit: int = 10, search: Optional[str] = None, tag: Optional[str] = None):
    query = {"is_published": True}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    if tag:
        query["tags"] = {"$in": [tag]}
    
    articles = await db.articles.find(query).sort("publish_date", -1).skip(skip).limit(limit).to_list(limit)
    return [Article(**article) for article in articles]

@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = await db.articles.find_one({"id": article_id})
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return Article(**article)

@api_router.get("/articles/slug/{slug}", response_model=Article)
async def get_article_by_slug(slug: str):
    article = await db.articles.find_one({"slug": slug, "is_published": True})
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return Article(**article)

@api_router.post("/articles", response_model=Article)
async def create_article(article: ArticleCreate):
    # Calculate read time based on content length
    word_count = len(article.content.split())
    read_time = max(1, word_count // 200)  # Average reading speed: 200 words per minute
    
    article_dict = article.dict()
    article_dict["read_time"] = read_time
    
    # Auto-generate meta description if not provided
    if not article_dict.get("meta_description"):
        article_dict["meta_description"] = article.excerpt[:160] + "..." if len(article.excerpt) > 160 else article.excerpt
    
    article_obj = Article(**article_dict)
    await db.articles.insert_one(article_obj.dict())
    return article_obj

@api_router.put("/articles/{article_id}", response_model=Article)
async def update_article(article_id: str, article_update: ArticleUpdate):
    existing_article = await db.articles.find_one({"id": article_id})
    if existing_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_dict = {k: v for k, v in article_update.dict().items() if v is not None}
    
    # Recalculate read time if content is updated
    if "content" in update_dict:
        word_count = len(update_dict["content"].split())
        update_dict["read_time"] = max(1, word_count // 200)
    
    await db.articles.update_one({"id": article_id}, {"$set": update_dict})
    updated_article = await db.articles.find_one({"id": article_id})
    return Article(**updated_article)

@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}

@api_router.get("/articles/tags/all")
async def get_all_tags():
    pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = await db.articles.aggregate(pipeline).to_list(100)
    return [{"tag": item["_id"], "count": item["count"]} for item in result]

# Gallery routes
@api_router.get("/gallery", response_model=List[GalleryPhoto])
async def get_gallery_photos(skip: int = 0, limit: int = 20, category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    
    photos = await db.gallery.find(query).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
    return [GalleryPhoto(**photo) for photo in photos]

@api_router.get("/gallery/{photo_id}", response_model=GalleryPhoto)
async def get_gallery_photo(photo_id: str):
    photo = await db.gallery.find_one({"id": photo_id})
    if photo is None:
        raise HTTPException(status_code=404, detail="Gallery photo not found")
    return GalleryPhoto(**photo)

@api_router.post("/gallery", response_model=GalleryPhoto)
async def create_gallery_photo(photo: GalleryPhotoCreate):
    photo_dict = photo.dict()
    photo_obj = GalleryPhoto(**photo_dict)
    await db.gallery.insert_one(photo_obj.dict())
    return photo_obj

@api_router.delete("/gallery/{photo_id}")
async def delete_gallery_photo(photo_id: str):
    result = await db.gallery.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery photo not found")
    return {"message": "Gallery photo deleted successfully"}

@api_router.get("/gallery/categories/all")
async def get_gallery_categories():
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = await db.gallery.aggregate(pipeline).to_list(100)
    return [{"category": item["_id"], "count": item["count"]} for item in result]

# Initialize sample data
@api_router.post("/init-sample-data")
async def init_sample_data():
    # Check if data already exists
    existing_photos = await db.photos.count_documents({})
    if existing_photos > 0:
        return {"message": "Sample data already exists"}
    
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
    
    # Sample blog articles
    sample_articles = [
        {
            "title": "The Art of Portrait Photography: Capturing Authentic Emotions",
            "content": """Portrait photography is more than just taking pictures of people—it's about capturing the essence of who they are. In my years of professional photography, I've learned that the key to great portraits lies not in the equipment you use, but in your ability to connect with your subjects and create an environment where they feel comfortable expressing themselves.

## Understanding Natural Light

Natural light is a portrait photographer's best friend. The golden hour, that magical time just after sunrise or before sunset, provides the most flattering light for portraits. The soft, warm light creates beautiful skin tones and adds a natural glow to your subjects.

When working with natural light, I always look for:
- Open shade for even lighting
- Reflected light from nearby surfaces
- Backlighting for dramatic silhouettes
- Window light for indoor portraits

## Building Rapport with Your Subject

The technical aspects of photography are important, but the human element is what makes portraits truly special. I spend time talking with my subjects before we start shooting. This helps them relax and shows me their personality, which I can then capture through my lens.

Some techniques I use:
- Start with casual conversation
- Give clear, positive direction
- Capture candid moments between poses
- Create a comfortable atmosphere

## Camera Settings for Portraits

While the connection with your subject is crucial, the technical execution must be flawless. Here are my go-to camera settings:

**Aperture**: I typically shoot between f/1.4 and f/2.8 for shallow depth of field
**Shutter Speed**: At least 1/focal length to avoid camera shake
**ISO**: Keep as low as possible while maintaining proper exposure
**Focus**: Single-point autofocus on the subject's nearest eye

## Post-Processing Philosophy

I believe in enhancing, not completely altering, the natural beauty of my subjects. My editing process focuses on:
- Subtle skin retouching
- Color grading for mood
- Sharpening the eyes
- Maintaining natural skin tones

Remember, the goal is to create images that look like the person, just on their best day.

## Conclusion

Great portrait photography combines technical skill with human connection. Master your camera settings, understand light, but most importantly, learn to see and capture the unique beauty in every person you photograph.""",
            "excerpt": "Discover the secrets of creating compelling portraits that capture authentic emotions and connect with viewers. Learn about lighting, composition, and building rapport with your subjects.",
            "slug": "art-of-portrait-photography-capturing-authentic-emotions",
            "tags": ["portrait", "photography", "lighting", "techniques", "natural light"],
            "featured_image": "https://images.unsplash.com/photo-1607865077798-50b8d3c253fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxwaG90b2dyYXBoeSUyMHBvcnRmb2xpb3xlbnwwfHx8fDE3NTI0MjU1MTF8MA&ixlib=rb-4.1.0&q=85",
            "meta_description": "Master the art of portrait photography with professional techniques for capturing authentic emotions, working with natural light, and building connection with your subjects."
        },
        {
            "title": "Fujifilm X-T4 Review: A Photographer's Perspective",
            "content": """After using the Fujifilm X-T4 for over a year in various shooting conditions, I can confidently say it's one of the best cameras I've ever owned. This review comes from real-world experience shooting everything from portraits to landscapes, in both professional and personal settings.

## Build Quality and Ergonomics

The X-T4 feels solid in hand with its weather-sealed magnesium alloy body. The grip is comfortable during long shooting sessions, and the button layout is intuitive once you get used to it. The fully articulating touchscreen is a game-changer for low-angle shots and video work.

**Pros:**
- Excellent build quality
- Weather sealing
- Comfortable grip
- Fully articulating screen

**Cons:**
- Menu system can be overwhelming initially
- Battery life could be better

## Image Quality

This is where the X-T4 truly shines. The 26.1MP APS-C sensor delivers exceptional image quality with excellent dynamic range and color reproduction. Fujifilm's film simulations are legendary, and they're one of the main reasons I switched to this system.

### Film Simulations I Use Most:
- **Classic Chrome**: For street photography and portraits
- **Astia/Soft**: For skin tones and natural colors
- **Velvia/Vivid**: For landscapes and vibrant scenes

## Autofocus Performance

The hybrid autofocus system is fast and accurate, especially for portraits. Face and eye detection work reliably, even in challenging light conditions. For moving subjects, the tracking performance is impressive for an APS-C camera.

## Video Capabilities

The X-T4 was my first serious foray into video, and it hasn't disappointed. 4K recording at 60fps with 10-bit internal recording opens up many creative possibilities. The in-body stabilization is particularly useful for handheld video work.

## Lens Ecosystem

Fujifilm's X-mount lens lineup is excellent. My current setup includes:
- **XF 35mm f/1.4 R**: My go-to lens for portraits
- **XF 16-55mm f/2.8 R LM WR**: Versatile zoom for various situations
- **XF 80mm f/2.8 R LM OIS WR Macro**: For close-up work

## Real-World Performance

I've used the X-T4 for:
- Wedding photography (secondary camera)
- Portrait sessions
- Street photography
- Landscape work
- Commercial projects

In all these scenarios, it has performed admirably. The image quality is consistently excellent, and the camera rarely gets in the way of creativity.

## Conclusion

The Fujifilm X-T4 is an excellent choice for photographers who value image quality, build quality, and creative control. While it may not have the absolute best autofocus or battery life, its strengths far outweigh its weaknesses.

**Rating: 4.5/5 stars**

Would I recommend it? Absolutely. Especially if you're looking to transition from full-frame or want a capable camera that doesn't compromise on image quality.""",
            "excerpt": "An in-depth review of the Fujifilm X-T4 from a professional photographer's perspective, covering image quality, build quality, autofocus performance, and real-world usage.",
            "slug": "fujifilm-xt4-review-photographers-perspective",
            "tags": ["camera review", "fujifilm", "x-t4", "equipment", "photography gear"],
            "featured_image": "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxjYW1lcmF8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "meta_description": "Comprehensive Fujifilm X-T4 review covering real-world performance, image quality, autofocus, and video capabilities from a professional photographer's perspective."
        },
        {
            "title": "5 Common Photography Mistakes and How to Avoid Them",
            "content": """Every photographer, regardless of experience level, makes mistakes. I've certainly made my share over the years. The key is learning from these mistakes and understanding how to avoid them in the future. Here are the five most common photography mistakes I see and how to fix them.

## 1. Focusing on the Wrong Part of the Image

**The Mistake**: Letting the camera decide where to focus instead of deliberately choosing your focus point.

**Why It Happens**: Many photographers rely on automatic focus modes without understanding how their camera's autofocus system works.

**The Fix**: 
- Switch to single-point autofocus
- Always focus on the most important part of your subject
- For portraits, focus on the nearest eye
- Use back-button focus for more control

## 2. Ignoring the Background

**The Mistake**: Concentrating so much on the subject that you forget to check what's behind them.

**Why It Happens**: Tunnel vision is common when you're excited about your subject.

**The Fix**:
- Always scan the entire frame before shooting
- Look for distracting elements
- Use shallow depth of field to blur busy backgrounds
- Change your position if the background is problematic

## 3. Not Understanding Light Direction

**The Mistake**: Shooting in harsh, unflattering light without considering its direction or quality.

**Why It Happens**: Beginners often focus on camera settings rather than light quality.

**The Fix**:
- Learn to see light direction: front, side, back, top, bottom
- Understand that soft light is usually more flattering
- Use open shade for even lighting
- Avoid harsh midday sun for portraits

## 4. Over-Editing Photos

**The Mistake**: Pushing sliders too far in post-processing, creating unnatural-looking images.

**Why It Happens**: Excitement about editing capabilities and not understanding restraint.

**The Fix**:
- Edit with purpose, not just because you can
- Step away from your computer and come back with fresh eyes
- Compare your edit to the original
- Remember that less is often more

## 5. Not Backing Up Photos

**The Mistake**: Keeping photos in only one location without proper backup.

**Why It Happens**: Thinking "it won't happen to me" until it does.

**The Fix**:
- Follow the 3-2-1 rule: 3 copies, 2 different media, 1 offsite
- Use cloud storage services
- Regularly check your backups
- Consider the value of your work

## Bonus Tip: Learn Your Camera

The biggest mistake of all is not taking time to truly understand your camera. Read the manual, practice with different settings, and don't rely solely on automatic modes.

## Conclusion

Making mistakes is part of the learning process. The photographers who improve fastest are those who recognize their mistakes, understand why they happened, and take steps to avoid them in the future. Remember, every professional photographer has made all these mistakes at some point—what matters is learning from them.""",
            "excerpt": "Learn about the five most common photography mistakes that hold back photographers at every level, and discover practical solutions to avoid them in your own work.",
            "slug": "5-common-photography-mistakes-how-to-avoid-them",
            "tags": ["photography tips", "beginner", "mistakes", "improvement", "technique"],
            "featured_image": "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxjYW1lcmF8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "meta_description": "Discover the five most common photography mistakes and learn practical solutions to avoid them. Essential tips for improving your photography skills."
        }
    ]
    
    # Insert sample articles
    for article_data in sample_articles:
        # Calculate read time
        word_count = len(article_data["content"].split())
        article_data["read_time"] = max(1, word_count // 200)
        
        article_obj = Article(**article_data)
        await db.articles.insert_one(article_obj.dict())
    
    # Sample gallery photos
    sample_gallery_photos = [
        {
            "title": "Urban Street Photography",
            "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBwaG90b2dyYXBoeXxlbnwwfHx8fDE3NTI0MjU1MTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Capturing the energy and movement of city life",
            "category": "street"
        },
        {
            "title": "Mountain Landscape",
            "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGV8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "description": "Majestic mountain peaks at sunrise",
            "category": "landscape"
        },
        {
            "title": "Candid Portrait",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdHxlbnwwfHx8fDE3NTI0MjU1MTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Natural expression captured in perfect light",
            "category": "portrait"
        },
        {
            "title": "Architectural Details",
            "image_url": "https://images.unsplash.com/photo-1481026469463-66327c86e544?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "description": "Modern architecture with geometric patterns",
            "category": "architecture"
        },
        {
            "title": "Golden Hour Landscape",
            "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBob3VyfGVufDB8fHx8MTc1MjQyNTUxOXww&ixlib=rb-4.1.0&q=85",
            "description": "Warm light painting the landscape",
            "category": "landscape"
        },
        {
            "title": "Black and White Portrait",
            "image_url": "https://images.unsplash.com/photo-1494790108755-2616c69c6ec4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzUyNDI1NTE5fDA&ixlib=rb-4.1.0&q=85",
            "description": "Timeless monochrome portrait",
            "category": "portrait"
        },
        {
            "title": "City Skyline",
            "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZXxlbnwwfHx8fDE3NTI0MjU1MTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Urban skyline at twilight",
            "category": "urban"
        },
        {
            "title": "Nature Macro",
            "image_url": "https://images.unsplash.com/photo-1426604966848-d7adac402bff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxtYWNybyUyMG5hdHVyZXxlbnwwfHx8fDE3NTI0MjU1MTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Intricate details in nature",
            "category": "macro"
        },
        {
            "title": "Wedding Photography",
            "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nfGVufDB8fHx8MTc1MjQyNTUxOXww&ixlib=rb-4.1.0&q=85",
            "description": "Capturing love and celebration",
            "category": "wedding"
        },
        {
            "title": "Abstract Photography",
            "image_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdHxlbnwwfHx8fDE3NTI0MjU1MTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Creative interpretation of light and form",
            "category": "abstract"
        }
    ]
    
    # Insert sample gallery photos
    for gallery_photo_data in sample_gallery_photos:
        gallery_photo_obj = GalleryPhoto(**gallery_photo_data)
        await db.gallery.insert_one(gallery_photo_obj.dict())
    
    return {"message": "Sample data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

# Configure CORS for production
origins = [
    "http://localhost:3000",  # Local development
    "https://localhost:3000",  # Local development with HTTPS
    "http://127.0.0.1:3000",  # Local development alternative
    "https://127.0.0.1:3000", # Local development alternative
]

# Add production origins
frontend_url = os.environ.get('FRONTEND_URL')
if frontend_url:
    origins.append(frontend_url)

# Add common deployment patterns
vercel_patterns = [
    "https://*.vercel.app",    # Vercel deployments
    "https://vercel.app",      # Vercel domain
]

netlify_patterns = [
    "https://*.netlify.app",   # Netlify deployments  
    "https://netlify.app",     # Netlify domain
]

# For development and testing, allow all origins (use with caution)
allow_all_origins = os.environ.get('ALLOW_ALL_ORIGINS', 'false').lower() == 'true'

if allow_all_origins:
    logger.warning("CORS is configured to allow all origins - only use for development!")
    origins = ["*"]
else:
    origins.extend(vercel_patterns)
    origins.extend(netlify_patterns)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize app and create database indexes"""
    logger.info("Starting Brian's Photography Portfolio API")
    logger.info(f"Database: {db_name}")
    
    # Create database indexes for better performance
    try:
        # Index for articles
        await db.articles.create_index([("slug", 1)], unique=True)
        await db.articles.create_index([("is_published", 1), ("publish_date", -1)])
        await db.articles.create_index([("tags", 1)])
        
        # Index for photos
        await db.photos.create_index([("timestamp", -1)])
        
        # Index for comments
        await db.comments.create_index([("photo_id", 1), ("timestamp", -1)])
        
        # Index for gallery
        await db.gallery.create_index([("category", 1), ("timestamp", -1)])
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Index creation failed (may already exist): {str(e)}")
    
    logger.info("API is ready to serve requests")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down database connection")
    client.close()