# Brian's Photography Portfolio

A full-stack photography portfolio application built with FastAPI backend and React frontend, featuring a main portfolio, blogging system, and extended photo gallery.

## Features

- **Portfolio**: Showcases featured photography work with detailed camera settings
- **Blog**: SEO-optimized articles about photography techniques and experiences
- **More Photos**: Extended gallery with categorized photo collections
- **Recipe Tweaker**: Interactive tool to experiment with camera settings
- **Comments**: Visitor feedback system for portfolio photos

## Tech Stack

- **Backend**: FastAPI with Python 3.11
- **Frontend**: React with Tailwind CSS
- **Database**: MongoDB
- **Infrastructure**: Supervisord for process management

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn package manager

### Installation

1. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd frontend
yarn install
```

3. Start all services:
```bash
sudo supervisorctl restart all
```

4. Initialize sample data:
```bash
curl -X POST http://localhost:8001/api/init-sample-data
```

## Contributing

### Adding New Blog Articles

You can contribute blog articles in two ways:

#### Method 1: API Endpoint (Recommended)

Use the blog API to create new articles:

```bash
curl -X POST "http://localhost:8001/api/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Article Title",
    "content": "Your article content in markdown format...",
    "excerpt": "Brief summary of the article",
    "slug": "your-article-slug",
    "tags": ["photography", "tutorial", "tips"],
    "featured_image": "https://example.com/image.jpg",
    "meta_description": "SEO description for search engines"
  }'
```

#### Method 2: Direct Database Insert

Add articles directly to the sample data in `backend/server.py`:

```python
# Add to sample_articles array in init_sample_data function
{
    "title": "Your Article Title",
    "content": """Your article content here...
    
    ## Use Markdown Headers
    
    Write your content in markdown format with:
    - **Bold text**
    - *Italic text*
    - Proper paragraph breaks
    
    ## Code Examples
    
    Include code blocks and technical details as needed.
    """,
    "excerpt": "Brief summary that appears in article listings",
    "slug": "your-article-slug",
    "tags": ["photography", "tutorial", "lighting"],
    "featured_image": "https://images.unsplash.com/your-image-url",
    "meta_description": "SEO-friendly description under 160 characters"
}
```

### Adding New Gallery Photos

Add photos to the More Photos section:

```bash
curl -X POST "http://localhost:8001/api/gallery" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Photo Title",
    "image_url": "https://example.com/photo.jpg",
    "description": "Optional description",
    "category": "portrait"
  }'
```

Available categories: `portrait`, `landscape`, `street`, `architecture`, `macro`, `wedding`, `urban`, `abstract`, `general`

### Article Writing Guidelines

#### Content Structure
- Use clear, descriptive headings (`## Heading`)
- Include practical examples and tips
- Add technical details when relevant
- Keep paragraphs concise and readable

#### SEO Best Practices
- **Title**: Clear, keyword-rich titles (under 60 characters)
- **Excerpt**: Compelling summary (under 200 characters)
- **Slug**: URL-friendly version of title (lowercase, hyphens)
- **Meta Description**: Search-friendly description (under 160 characters)
- **Tags**: Relevant keywords for categorization

#### Image Requirements
- **Featured Image**: High-quality, relevant image (1200x600px recommended)
- **Format**: JPEG or PNG
- **Source**: Use Unsplash or similar for stock photos
- **Alt Text**: Descriptive alt text for accessibility

### Content Ideas

#### Photography Tutorials
- Camera settings for different scenarios
- Lighting techniques and tips
- Post-processing workflows
- Equipment reviews and comparisons

#### Behind the Scenes
- Photo shoot experiences
- Challenges and solutions
- Creative process insights
- Technical problem-solving

#### Equipment Reviews
- Camera and lens reviews
- Accessory recommendations
- Software comparisons
- Budget vs. premium gear

### Development Guidelines

#### Code Style
- Follow existing code formatting
- Use meaningful variable names
- Add comments for complex logic
- Test changes thoroughly

#### API Endpoints
- Blog: `/api/articles`
- Gallery: `/api/gallery`
- Portfolio: `/api/photos`
- Comments: `/api/comments`

#### Database Schema
- Articles: `title`, `content`, `excerpt`, `slug`, `tags`, `publish_date`, `featured_image`, `meta_description`
- Gallery: `title`, `image_url`, `description`, `category`, `timestamp`
- Photos: `title`, `description`, `image_url`, `camera_settings`, `timestamp`

### Testing

1. Test backend API endpoints:
```bash
curl http://localhost:8001/api/articles
curl http://localhost:8001/api/gallery
```

2. Test frontend components:
```bash
cd frontend
yarn test
```

3. Verify SEO meta tags:
- Check `<title>` and `<meta>` tags in browser
- Validate with SEO tools
- Test social media sharing

### Deployment

The application uses Supervisord for process management:
- Backend runs on port 8001
- Frontend runs on port 3000
- MongoDB runs on default port 27017

Service commands:
```bash
sudo supervisorctl status
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all
```

## Project Structure

```
portphotio/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Portfolio.js
│   │   │   ├── Blog.js
│   │   │   ├── ArticleDetail.js
│   │   │   ├── MorePhotos.js
│   │   │   └── PhotoTweaker.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
└── README.md
```

## Support

For questions or issues:
1. Check existing articles for similar topics
2. Review the API documentation
3. Test changes in development environment
4. Ensure all services are running properly

Happy contributing! 📸
