// Google Apps Script — SriVoraTech Multi-Tab Application & Ratings Receiver
// Paste this into Google Sheets > Extensions > Apps Script
// Then Deploy > New Deployment > Web App > Execute as "Me" > Access "Anyone"

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};
    
    // Parse incoming JSON or URL-encoded payload
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var type = String(data.type || '').toLowerCase();
    var targetSheet = null;

    // 1. Try to find the exact tab based on form application type or ratings
    if (type.indexOf('fresher') !== -1) {
      targetSheet = ss.getSheetByName('FresherApplications') || ss.getSheetByName('Fresher');
    } else if (type.indexOf('exp') !== -1) {
      targetSheet = ss.getSheetByName('ExperienceApplications') || ss.getSheetByName('ExperiencedApplications') || ss.getSheetByName('Experienced');
    } else if (type.indexOf('contact') !== -1) {
      targetSheet = ss.getSheetByName('ContactForm') || ss.getSheetByName('Contact');
    } else if (type.indexOf('rating') !== -1 || type.indexOf('review') !== -1) {
      targetSheet = ss.getSheetByName('Ratings') || ss.getSheetByName('Reviews') || ss.getSheetByName('WebsiteRating');
      if (!targetSheet) {
        targetSheet = ss.insertSheet('Ratings');
      }
    }

    // 2. Fallback to active sheet if tab name not found
    if (!targetSheet) {
      targetSheet = ss.getActiveSheet();
    }

    // Build combined helper variables
    var fullName = data.fullName || data.name || '';
    if (!fullName && (data.firstName || data.lastName)) {
      fullName = ((data.firstName || '') + ' ' + (data.lastName || '')).trim();
    }
    
    var resumeUrl = data.resumeLink || data.resume || (data.resume_filename ? 'Uploaded: ' + data.resume_filename : '');
    var roleVal = data.role || data.designation || '';
    var skillsVal = data.skills || (data.category && roleVal ? data.category + ' - ' + roleVal : '');
    var collegeVal = data.college || data.company || '';
    var degreeVal = data.degree || data.designation || '';

    // If sheet is completely empty, initialize headers based on tab type
    if (targetSheet.getLastRow() === 0) {
      var defaultHeaders = [];
      if (type.indexOf('rating') !== -1 || type.indexOf('review') !== -1) {
        defaultHeaders = ['Timestamp', 'Full Name', 'Email', 'Star Rating', 'Review Message', 'Company', 'Status'];
      } else {
        defaultHeaders = [
          'Timestamp',
          'Full Name',
          'Email',
          'Phone',
          'College / Company',
          'Degree / Designation',
          'Graduation Year / Exp',
          'Skills',
          'Portfolio / Resume Link',
          'Why SriVoraTech',
          'Notice Period'
        ];
      }
      targetSheet.appendRow(defaultHeaders);
      targetSheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight('bold');
    }

    // Read existing Header Row 1 from the target sheet
    var lastCol = Math.max(targetSheet.getLastColumn(), 1);
    var headers = targetSheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Map incoming data dynamically to every header in the target sheet
    var newRow = headers.map(function(header) {
      var h = String(header).toLowerCase().trim();

      // Column A Timestamp check
      if (h.indexOf('time') !== -1 || h.indexOf('date') !== -1 || h.indexOf('submitted') !== -1 || h === 'a1' || h === 'a2' || h === 'a3') {
        return new Date().toLocaleString();
      }
      if (h.indexOf('full name') !== -1 || h === 'name') {
        return fullName;
      }
      if (h.indexOf('star') !== -1 || h.indexOf('rating') !== -1) {
        return data.star || data.rating || 5;
      }
      if (h.indexOf('comment') !== -1 || h.indexOf('review') !== -1 || h.indexOf('message') !== -1) {
        return data.comment || data.message || data.whySriVoraTech || '';
      }
      if (h.indexOf('status') !== -1) {
        return data.status || 'Approved';
      }
      if (h.indexOf('first name') !== -1) {
        return data.firstName || (fullName.split(' ')[0] || '');
      }
      if (h.indexOf('last name') !== -1) {
        return data.lastName || (fullName.split(' ').slice(1).join(' ') || '');
      }
      if (h.indexOf('email') !== -1) {
        return data.email || '';
      }
      if (h.indexOf('phone') !== -1 || h.indexOf('mobile') !== -1 || h.indexOf('contact') !== -1) {
        return data.phone || '';
      }
      if (h.indexOf('college') !== -1 || h.indexOf('university') !== -1 || h.indexOf('school') !== -1) {
        return collegeVal;
      }
      if (h.indexOf('company') !== -1 || h.indexOf('organization') !== -1) {
        return data.company || collegeVal;
      }
      if (h.indexOf('degree') !== -1 || h.indexOf('branch') !== -1) {
        return degreeVal;
      }
      if (h.indexOf('designation') !== -1 || h.indexOf('title') !== -1) {
        return data.designation || roleVal;
      }
      if (h.indexOf('graduation') !== -1 || h.indexOf('year') !== -1) {
        return data.graduationYear || data.yearsOfExperience || '';
      }
      if (h.indexOf('experience') !== -1 || h.indexOf('exp') !== -1) {
        return data.yearsOfExperience || data.graduationYear || '';
      }
      if (h.indexOf('skill') !== -1) {
        return skillsVal;
      }
      if (h.indexOf('portfolio') !== -1 || h.indexOf('github') !== -1 || h.indexOf('linkedin') !== -1 || h.indexOf('website') !== -1) {
        if (data.portfolio && resumeUrl) {
          return data.portfolio + ' | Resume: ' + resumeUrl;
        }
        return data.portfolio || resumeUrl;
      }
      if (h.indexOf('resume') !== -1 || h.indexOf('cv') !== -1) {
        return resumeUrl;
      }
      if (h.indexOf('why') !== -1 || h.indexOf('srivoratech') !== -1 || h.indexOf('reason') !== -1) {
        return data.whySriVoraTech || '';
      }
      if (h.indexOf('interested') !== -1 || h.indexOf('role') !== -1 || h.indexOf('category') !== -1) {
        return roleVal || data.category || '';
      }
      if (h.indexOf('address') !== -1) {
        return data.address || '';
      }
      if (h.indexOf('notice') !== -1) {
        return data.noticePeriod || '';
      }
      if (h.indexOf('type') !== -1) {
        return data.type || 'Rating';
      }

      // Exact match fallback
      for (var key in data) {
        if (key.toLowerCase() === h) return data[key];
      }

      return '';
    });

    // Append the mapped data row to the target sheet tab
    targetSheet.appendRow(newRow);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Data saved successfully to ' + targetSheet.getName() })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
    
    if (action === 'getReviews' || action === 'ratings') {
      var sheet = ss.getSheetByName('Ratings') || ss.getSheetByName('Reviews') || ss.getSheetByName('WebsiteRating');
      if (!sheet || sheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({ success: true, reviews: [] })).setMimeType(ContentService.MimeType.JSON);
      }
      
      var rows = sheet.getDataRange().getValues();
      var headers = rows[0].map(function(h) { return String(h).toLowerCase().trim(); });
      var reviews = [];
      
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var item = {};
        for (var j = 0; j < headers.length; j++) {
          item[headers[j]] = row[j];
        }
        reviews.push({
          id: i,
          name: item['full name'] || item['name'] || 'Customer',
          email: item['email'] || '',
          star: parseInt(item['star rating'] || item['rating'] || item['star'] || 5, 10),
          comment: item['review message'] || item['comment'] || item['message'] || '',
          company: item['company'] || '',
          status: item['status'] || 'Approved',
          date: item['timestamp'] || item['date'] || 'Jul 20, 2026',
          timestamp: new Date(item['timestamp'] || Date.now()).getTime()
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, reviews: reviews })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok', message: 'SriVoraTech Multi-Tab Sheets API is running' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

