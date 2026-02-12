# Cornell Specimen Explorer - Installation Guide

This guide will help you set up and run the Cornell Specimen Explorer application on your computer, even if you're not familiar with coding.

## What You'll Need

Before starting, you'll need to install some software on your computer:

### 1. Install Node.js

Node.js is the runtime environment that allows you to run this application.

**For Windows:**
1. Go to https://nodejs.org/
2. Download the "LTS" (Long Term Support) version - look for the button that says "Recommended For Most Users"
3. Run the downloaded installer (.msi file)
4. Follow the installation wizard, accepting all default settings
5. Click "Finish" when complete

**For Mac:**
1. Go to https://nodejs.org/
2. Download the "LTS" version for macOS
3. Open the downloaded .pkg file
4. Follow the installation wizard
5. Click "Finish" when complete

**For Linux:**
1. Open Terminal
2. Run these commands:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

**Verify Installation:**
1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Type: `node --version` and press Enter
3. You should see a version number like `v18.17.0` or higher
4. Type: `npm --version` and press Enter
5. You should see a version number like `9.6.7` or higher

### 2. Get the Application Files

You need to have all the application files in a folder on your computer. If you received these files in a ZIP archive:

1. Right-click the ZIP file
2. Select "Extract All..." (Windows) or double-click (Mac)
3. Choose a location you'll remember (like your Documents folder)
4. Extract the files

## Setting Up the Application

### Step 1: Open Your Terminal/Command Prompt

**Windows:**
1. Press the Windows key
2. Type "Command Prompt" or "cmd"
3. Press Enter

**Mac:**
1. Press Command + Space
2. Type "Terminal"
3. Press Enter

**Linux:**
1. Press Ctrl + Alt + T

### Step 2: Navigate to the Application Folder

You need to navigate to where you extracted the application files.

1. In the terminal, type `cd` followed by a space
2. Then drag and drop the application folder into the terminal window
   - OR type the full path manually, for example:
     - Windows: `cd C:\Users\YourName\Documents\codex_test`
     - Mac/Linux: `cd ~/Documents/codex_test`
3. Press Enter

**To verify you're in the right folder:**
- Type `dir` (Windows) or `ls` (Mac/Linux) and press Enter
- You should see files like `package.json`, `README.md`, and folders like `src`, `public`

### Step 3: Install Dependencies

The application needs additional software libraries to run. Install them with this command:

```bash
npm install
```

**What to expect:**
- This will take 2-5 minutes
- You'll see lots of text scrolling by - this is normal
- Wait until you see a message like "added XXX packages" and your command prompt returns

**If you see any errors:**
- Make sure you're in the correct folder (see Step 2)
- Make sure Node.js installed correctly (check with `node --version`)
- Try running `npm cache clean --force` then run `npm install` again

### Step 4: Prepare Your Data File

The application needs a CSV file with specimen data:

1. Make sure you have a file named `fish_collection.csv` 
2. Place it in the `public` folder inside your application directory
   - The full path should look like: `your-app-folder/public/fish_collection.csv`

**Note:** According to the README, a sample file should already be there. If not, you'll need to add your own CSV file.

## Running the Application

### Start the Application

Once everything is installed, start the application with this command:

```bash
npm run dev
```

**What to expect:**
- After a few seconds, you should see messages like:
  ```
  VITE ready in XXX ms
  
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ```

### Open in Your Browser

1. Look for the line that says `Local: http://localhost:5173/` (the number might be different)
2. Hold Ctrl (Windows/Linux) or Command (Mac) and click on that link
   - OR manually open your web browser and type `http://localhost:5173/` in the address bar
3. The Cornell Specimen Explorer should now load in your browser!

## Using the Application

Once the application is running:

### Dashboard View
- You'll see collection statistics
- Charts showing family distributions
- Cumulative specimen collection over time

### Specimen Search View
- Click "Specimen Search" in the top navigation
- Use the filters on the left to search for specific specimens
- View results in the table
- See specimen locations on the map
- Click on table rows or map markers to highlight specimens
- Export your filtered results to CSV

## Stopping the Application

When you're done:

1. Go back to your Terminal/Command Prompt window
2. Press `Ctrl + C` (works on Windows, Mac, and Linux)
3. If asked "Terminate batch job? (Y/N)", type `Y` and press Enter
4. You can now close the terminal window

## Troubleshooting

### "Port already in use" error
- Another program is using port 5173
- Try closing other development servers
- Or the application might already be running in another terminal window

### White/blank page in browser
- Make sure the terminal shows "VITE ready"
- Check that `fish_collection.csv` exists in the `public` folder
- Try refreshing your browser (press F5 or Ctrl+R / Command+R)
- Check the browser console for errors (press F12, click "Console" tab)

### Missing data or "Unable to load CSV"
- Verify `fish_collection.csv` is in the correct location: `public/fish_collection.csv`
- Make sure the CSV file is properly formatted
- Check that the file isn't corrupted

### Charts not displaying
- Make sure `recharts` package was installed correctly
- In the terminal (while in the app folder), run: `npm install recharts`
- Restart the application

### Map not loading
- Check your internet connection (map tiles are loaded from OpenStreetMap)
- Wait a few seconds - tiles may take time to load

### Package installation errors
- Delete the `node_modules` folder
- Delete the `package-lock.json` file
- Run `npm install` again

## Getting Help

If you continue to have issues:

1. Make sure you followed all steps in order
2. Verify Node.js version is 18 or higher: `node --version`
3. Try running `npm install` again
4. Check that you're in the correct folder when running commands
5. Restart your computer and try again

## Summary of Commands

Here's a quick reference of all commands you'll use:

```bash
# Navigate to app folder
cd path/to/your/app

# Install dependencies (first time only)
npm install

# Start the application
npm run dev

# Stop the application
Press Ctrl + C
```

---

**Congratulations!** You should now have the Cornell Specimen Explorer running on your computer. The application will continue running until you stop it with Ctrl+C.
