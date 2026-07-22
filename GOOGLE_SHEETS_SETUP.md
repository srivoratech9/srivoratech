# Google Sheets Setup — SriVoraTech Application Forms

## Quick Setup (5 minutes, no credentials needed)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **"SriVoraTech Applications"**

### Step 2: Add Google Apps Script
1. In the spreadsheet, go to **Extensions → Apps Script**
2. Delete any default code in the editor
3. Copy-paste the entire contents of `google-apps-script.js` from this project
4. Click **Save** (Ctrl+S)

### Step 3: Deploy as Web App
1. Click **Deploy → New Deployment**
2. Click the gear icon and select **"Web App"**
3. Set:
   - **Description**: "SriVoraTech Applications"
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/AKf.../exec`)

### Step 4: Paste URL in Code
1. Open `src/utils/submitToSheet.js`
2. Paste the URL in the `GOOGLE_SCRIPT_URL` constant:
   ```js
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec'
   ```
3. Save the file

### Step 5: Test
1. Open `http://localhost:5173`
2. Navigate to the **Contact / Join Our Team** section
3. Fill out a Fresher or Experienced application form
4. Submit — the data should appear in your Google Sheet within seconds

## Google Sheet Columns

| Column | Description |
|--------|-------------|
| Timestamp | When the form was submitted |
| Type | Fresher or Experienced |
| Full Name | Applicant's full name |
| Email | Email address |
| Phone | Phone number |
| Address | Home address |
| Category | Department category |
| Role | Specific role applied for |
| Years of Experience | Experience level |
| Skills | Skills and technologies |
| Portfolio | Portfolio URL |
| Why SriVoraTech | Motivation / notes |
| Notice Period | Notice period (experienced only) |

## Troubleshooting

- **"TypeError: Cannot read properties of null"**: Make sure you deployed as Web App, not API Executable
- **No data appearing**: Re-deploy after editing the script (Deploy → Manage Deployments → Edit → New Version)
- **CORS errors**: The `no-cors` mode in submitToSheet.js handles this automatically
