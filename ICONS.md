# PWA Icons for Word Club

## Quick Start

You need two icon files for the PWA to work properly:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

## Option 1: Generate Icons (Easiest)

1. Open `generate-icons.html` in your browser
2. Right-click each canvas and save as PNG:
   - Save first canvas as `icon-192.png`
   - Save second canvas as `icon-512.png`
3. Place both files in the root directory (next to `index.html`)

## Option 2: Use Online Tool (Best Quality)

Visit **[PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)**:
1. Upload any 512x512 image (or create one)
2. It generates all required PWA icons automatically
3. Download the zip file
4. Extract `icon-192.png` and `icon-512.png` to your project root

## Option 3: Design Your Own

Use Figma, Canva, or any image editor:

### Design Specs:
- **Size**: 512x512 pixels (then resize to 192x192 for smaller version)
- **Background**: Purple gradient (#9333ea to #ec4899)
- **Content**: Large "W" or "WC" in white
- **Format**: PNG with transparency
- **Border Radius**: 20-25% for modern look (optional)

### Quick Figma Steps:
1. Create 512x512 frame
2. Add purple gradient background
3. Add white "W" text (300-400px font size, bold)
4. Add "CLUB" subtitle (60px font size)
5. Export as PNG

## Temporary Solution

Until you create custom icons, you can use emoji or text-based placeholder:
- Create a simple square image with purple background
- Add "WC" or "📚" text/emoji
- Export at 512x512, then resize to 192x192

## Icon Checklist

- [ ] Created `icon-192.png`
- [ ] Created `icon-512.png`
- [ ] Both files in project root directory
- [ ] Icons use purple/pink theme colors
- [ ] Tested PWA installation

## Testing

After adding icons:
1. Push to GitHub
2. Visit your GitHub Pages URL
3. Look for "Install" button in browser address bar
4. Install the PWA
5. Check that icon appears correctly on home screen/desktop
