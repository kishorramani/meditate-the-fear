# Horror Images for Kiroween

Add Halloween-themed horror images to this directory:

- `horror1.jpg` - Creepy face or ghost
- `horror2.jpg` - Dark shadow figure
- `horror3.jpg` - Demon or monster
- `horror4.jpg` - Haunted scene
- `horror5.jpg` - Scary eyes in darkness
- `horror6.jpg` - Distorted face
- `horror7.jpg` - Creepy doll or clown
- `horror8.jpg` - Graveyard or haunted house

These images will randomly appear during horror mode events.

## Recommended Image Sizes

### For Best Performance on Mobile:
- **Resolution:** 1080x1920px (portrait) or 1920x1080px (landscape)
- **File Size:** 100-300 KB (compressed)
- **Format:** JPG (better compression) or PNG (if transparency needed)

### Size Guidelines:
| Device Type | Recommended Size | Max File Size |
|-------------|------------------|---------------|
| **Mobile (Portrait)** | 1080x1920px | 200 KB |
| **Mobile (Landscape)** | 1920x1080px | 200 KB |
| **Tablet** | 1536x2048px | 300 KB |
| **Desktop** | 1920x1080px | 400 KB |

### Why These Sizes?
- **1080x1920px** matches most modern phone screens (Full HD)
- Smaller file sizes = faster loading on mobile networks
- Images are displayed full-screen with opacity, so high resolution isn't critical
- Compressed JPGs load faster than large PNGs

## How to Optimize Images

### Online Tools (Free):
1. **TinyJPG** - https://tinyjpg.com/
   - Upload your image
   - Download compressed version
   - Reduces file size by 50-70%

2. **Squoosh** - https://squoosh.app/
   - Drag and drop image
   - Adjust quality slider to ~70-80%
   - Download optimized image

3. **ImageOptim** (Mac) - https://imageoptim.com/
   - Drag images to app
   - Automatically compresses

### Command Line (Advanced):
```bash
# Install ImageMagick
brew install imagemagick  # Mac
sudo apt install imagemagick  # Linux

# Resize and compress
magick input.jpg -resize 1080x1920 -quality 80 horror1.jpg
```

## Image Style Tips
- **Dark backgrounds** work best (black, dark gray)
- **High contrast** - bright elements on dark background
- **Center the subject** - will be visible on all screen sizes
- **Avoid text** - may not be readable when blended
- **Portrait orientation** preferred for mobile

## Recommended Sources
- https://unsplash.com/s/photos/halloween-horror
- https://pexels.com/search/scary/
- https://pixabay.com/images/search/horror/
- https://freepik.com (search: horror, halloween, scary)

## Quick Setup
1. Download 8 horror images from sources above
2. Resize to 1080x1920px
3. Compress to under 200 KB each
4. Rename to horror1.jpg through horror8.jpg
5. Place in this directory

## Testing
After adding images, test on your phone:
- Images should load quickly (under 1 second)
- Should be visible but not too bright
- Should work in both portrait and landscape

## Image Requirements Summary
✅ Format: JPG or PNG
✅ Size: 1080x1920px (portrait) or 1920x1080px (landscape)
✅ File Size: 100-300 KB per image
✅ Total: 8 images (horror1.jpg to horror8.jpg)
✅ Dark, high-contrast images
✅ Royalty-free or properly licensed
