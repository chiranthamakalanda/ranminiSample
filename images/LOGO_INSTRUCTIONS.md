# SLIIT Logo Setup Instructions

## Quick Fix for Logo Visibility

If the logo is not showing, follow these steps:

### Option 1: Add Your Logo File
1. Place your SLIIT logo file in this `images/` folder
2. Name it exactly: `sliit-logo.png`
3. Supported formats: `.png`, `.jpg`, `.svg`

### Option 2: Check File Path
The logo path in all HTML files is: `images/sliit-logo.png`

If your logo file has a different name, update it in all HTML files:
- `index.html`
- `attendance.html`
- `payroll.html`
- `agent-profile.html`
- `application-tracker.html`
- `roaster.html`

Look for: `<img src="images/sliit-logo.png" ...>`

### Option 3: Use Absolute Path
If relative path doesn't work, you can use:
- `./images/sliit-logo.png` (current directory)
- `/images/sliit-logo.png` (root directory)

### Fallback
If no logo file is found, the system will automatically show "SLIIT" text as a fallback.

### Recommended Logo Specifications
- **Format**: PNG with transparent background (preferred)
- **Size**: 200x200 pixels or similar square dimensions
- **File Size**: Under 100KB for fast loading
- **Aspect Ratio**: Square (1:1) works best

### Testing
1. Open any HTML file in a browser
2. Check browser console (F12) for any image loading errors
3. Verify the `images/` folder is in the same directory as your HTML files




