Medical Organizer - Complete User Flow (Revised)
User Flow Diagram
text
┌─────────────────────────────────────────────────────────────┐
│ APP LAUNCH │
│ - Splash screen │
│ - Check authentication │
└─────────────────┬───────────────────────────────────────────┘
│
┌─────────┴─────────┐
│ │
NOT LOGGED IN LOGGED IN
│ │
↓ ↓
┌──────────────┐ ┌──────────────────┐
│ ONBOARDING/ │ │ Has Documents? │
│ AUTH SCREEN │ └────┬─────────┬───┘
└──────────────┘ │ │
│ NO│ │YES
└────────────────┘ │
│ │
↓ ↓
┌──────────────┐ ┌──────────────┐
│ EMPTY HOME │ │ HOME SCREEN │
│ (First Time) │ │ (Dashboard) │
└──────────────┘ └──────────────┘
│ │
┌─────────┴────────────────┴──────────────┬──────────────┐
│ │ │ │
↓ ↓ ↓ ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ UPLOAD │ │ SEARCH │ │ REMINDERS │ │ SETTINGS │
│ FLOW │ │ HISTORY │ │ │ │ │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
Complete Screen Flows

1. First Time User Experience
   Onboarding (3 Screens)
   Screen 1:

text
┌─────────────────────────────────────┐
│ │
│ │
│ [Illustration: │
│ Medical documents │
│ neatly organized] │
│ │
│ Organize All Your │
│ Medical Documents │
│ │
│ Keep prescriptions, lab reports, │
│ and bills in one secure place. │
│ │
│ [Next →] │
│ [Skip] │
└─────────────────────────────────────┘
Screen 2:

text
┌─────────────────────────────────────┐
│ │
│ [Illustration: │
│ Search with magnifying │
│ glass] │
│ │
│ Search Your Medical History │
│ │
│ Find any document instantly │
│ with smart search. │
│ │
│ [Next →] │
│ [← Back] [Skip] │
└─────────────────────────────────────┘
Screen 3:

text
┌─────────────────────────────────────┐
│ │
│ [Illustration: │
│ Phone with notification] │
│ │
│ Never Miss a Medication │
│ │
│ Set custom reminders for your │
│ medications. You're in control. │
│ │
│ [Get Started →] │
│ [← Back] │
└─────────────────────────────────────┘
Authentication
text
┌─────────────────────────────────────┐
│ Medical Organizer │
├─────────────────────────────────────┤
│ │
│ [App Logo] │
│ │
│ Your Medical Records, │
│ Always With You │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📧 Continue with Email │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ 🔐 Continue with Google │ │
│ └─────────────────────────────┘ │
│ │
│ By continuing, you agree to our │
│ Terms & Privacy Policy │
│ │
└─────────────────────────────────────┘ 2. Home Screen States
A. Empty State (No Documents)
text
┌─────────────────────────────────────┐
│ Medical Organizer [👤] │
├─────────────────────────────────────┤
│ │
│ [Illustration: │
│ Empty folder with │
│ upload icon] │
│ │
│ Welcome, John! 👋 │
│ │
│ Start by uploading your first │
│ medical document │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📸 Upload Document │ │
│ └─────────────────────────────┘ │
│ │
│ What can you upload? │
│ • Prescriptions │
│ • Lab Reports │
│ • Hospital Bills │
│ • Insurance Documents │
│ │
│ [🏠 Home] [🔔] [⚙️] [👤] │
└─────────────────────────────────────┘
B. Home Screen (With Documents)
text
┌─────────────────────────────────────┐
│ Medical Organizer [👤] │
├─────────────────────────────────────┤
│ │
│ Hello, John 👋 │
│ │
│ 📊 Quick Stats │
│ ┌──────┬──────┬──────────────┐ │
│ │ 12 │ 3 │ 2 │ │
│ │ Docs │ Meds │ Reminders │ │
│ └──────┴──────┴──────────────┘ │
│ │
│ 🔍 [Search your medical history] │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📸 Upload New Document │ │
│ └─────────────────────────────┘ │
│ │
│ Recent Documents │
│ ┌─────────────────────────────┐ │
│ │ 💊 Prescription │ │
│ │ May 7, 2026 │ │
│ │ Dr. Kumar • Apollo Hospital │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🧪 Lab Report │ │
│ │ May 1, 2026 │ │
│ │ Complete Blood Count │ │
│ └─────────────────────────────┘ │
│ │
│ [See All Documents →] │
│ │
│ [🏠] [🔔 2] [⚙️] [👤] │
└─────────────────────────────────────┘ 3. Upload Document Flow
Step 1: Choose Upload Method
text
┌─────────────────────────────────────┐
│ Upload Document [✕] │
├─────────────────────────────────────┤
│ │
│ How would you like to upload? │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📷 Take Photo │ │
│ │ Use camera to capture │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ 🖼️ Choose from Gallery │ │
│ │ Select existing photo │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📄 Choose PDF File │ │
│ │ Upload digital document │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Step 2: Preview & Confirm
text
┌─────────────────────────────────────┐
│ Confirm Upload [✕] │
├─────────────────────────────────────┤
│ │
│ ┌─────────────────────────────┐ │
│ │ │ │
│ │ [Preview Image] │ │
│ │ Prescription document │ │
│ │ │ │
│ │ Tap to adjust │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Looks Good, Upload │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ 🔄 Retake Photo │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Step 3: Processing
text
┌─────────────────────────────────────┐
│ Processing Document... │
├─────────────────────────────────────┤
│ │
│ [Animated Spinner] │
│ │
│ ✓ Uploading image... │
│ ⏳ Reading text... │
│ ⏳ Analyzing document... │
│ ⏳ Extracting information... │
│ │
│ This usually takes 10-15 seconds │
│ │
│ 💡 Tip: We support documents in │
│ Hindi, English, and 15+ other │
│ Indian languages! │
│ │
└─────────────────────────────────────┘
Step 4: Results (Prescription with Medications)
text
┌─────────────────────────────────────┐
│ Document Processed! ✓ [✕] │
├─────────────────────────────────────┤
│ │
│ 📋 Type: Prescription │
│ 📅 Date: May 7, 2026 │
│ 🏥 Apollo Hospital │
│ 👨‍⚕️ Dr. Kumar │
│ │
│ 💊 Medications Found (2): │
│ │
│ ┌─────────────────────────────┐ │
│ │ Metformin 500mg │ │
│ │ Twice daily, for 30 days │ │
│ │ │ │
│ │ [➕ Set Reminder] │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ Aspirin 75mg │ │
│ │ Once daily, ongoing │ │
│ │ │ │
│ │ [➕ Set Reminder] │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ View Full Document Details │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Done │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Step 5: Set Reminder (If User Clicks "Set Reminder")
text
┌─────────────────────────────────────┐
│ Set Medication Reminder [←] │
├─────────────────────────────────────┤
│ │
│ 💊 Metformin 500mg │
│ Twice daily for 30 days │
│ │
│ 📅 Start Date: │
│ ┌─────────────────────────────┐ │
│ │ May 7, 2026 [Edit] │ │
│ └─────────────────────────────┘ │
│ │
│ 📅 End Date: │
│ ┌─────────────────────────────┐ │
│ │ June 6, 2026 [Edit] │ │
│ └─────────────────────────────┘ │
│ │
│ ⏰ When should we remind you? │
│ │
│ First dose: │
│ ┌─────────────────────────────┐ │
│ │ 🕐 08:00 AM [Edit]│ │
│ └─────────────────────────────┘ │
│ │
│ Second dose: │
│ ┌─────────────────────────────┐ │
│ │ 🕐 08:00 PM [Edit]│ │
│ └─────────────────────────────┘ │
│ │
│ [ ] Remind me 3 days before end │
│ to refill prescription │
│ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Save Reminder │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Confirmation Toast
text
┌─────────────────────────────────────┐
│ │
│ ✓ Reminder saved successfully! │
│ │
└─────────────────────────────────────┘
Results (Non-Prescription Document)
text
┌─────────────────────────────────────┐
│ Document Processed! ✓ [✕] │
├─────────────────────────────────────┤
│ │
│ 📋 Type: Lab Report │
│ 📅 Date: May 7, 2026 │
│ 🏥 Apollo Diagnostics │
│ │
│ Test: Complete Blood Count (CBC) │
│ │
│ Extracted Information: │
│ • Hemoglobin: 14.5 g/dL │
│ • WBC Count: 7,200/μL │
│ • Platelet Count: 250,000/μL │
│ │
│ ┌─────────────────────────────┐ │
│ │ View Full Document │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Done │ │
│ └─────────────────────────────┘ │
│ │
│ 💡 No medications found. This │
│ document is saved for search. │
│ │
└─────────────────────────────────────┘ 4. Search Flow
Empty Search (No Documents)
text
┌─────────────────────────────────────┐
│ Search [←] │
├─────────────────────────────────────┤
│ │
│ 🔍 [Search...____________] │
│ │
│ │
│ [Illustration: │
│ Magnifying glass on │
│ empty folder] │
│ │
│ No Documents Yet │
│ │
│ Upload your first document to │
│ start building your medical │
│ history. │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📸 Upload Document │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Search Screen (With Documents, No Query)
text
┌─────────────────────────────────────┐
│ Search [←] │
├─────────────────────────────────────┤
│ │
│ 🔍 [Search your medical history__] │
│ │
│ Recent Searches: │
│ • diabetes medication │
│ • blood test results │
│ • Dr. Kumar prescriptions │
│ │
│ Quick Filters: │
│ [💊 Prescriptions] [🧪 Lab Reports] │
│ [🏥 Bills] [📄 All] │
│ │
│ Browse by Date: │
│ [This Month] [Last 3 Months] [2025]│
│ │
└─────────────────────────────────────┘
Search Results
text
┌─────────────────────────────────────┐
│ Search: "diabetes" [←] │
├─────────────────────────────────────┤
│ │
│ 🔍 [diabetes_____________] [✕] │
│ │
│ Found 3 documents │
│ │
│ ┌─────────────────────────────┐ │
│ │ 💊 Prescription │ │
│ │ May 7, 2026 │ │
│ │ "Metformin 500mg for │ │
│ │ diabetes management..." │ │
│ │ Match: 95% [→] │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ 🧪 Lab Report │ │
│ │ Apr 15, 2026 │ │
│ │ "HbA1c test - diabetes │ │
│ │ control monitoring" │ │
│ │ Match: 87% [→] │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ 💊 Prescription │ │
│ │ Mar 20, 2026 │ │
│ │ "Insulin dosage adjustment │ │
│ │ for type 2 diabetes" │ │
│ │ Match: 82% [→] │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘ 5. Reminders Screen States
Empty State (No Reminders)
text
┌─────────────────────────────────────┐
│ Medication Reminders [←] │
├─────────────────────────────────────┤
│ │
│ │
│ [Illustration: │
│ Bell with checkmark] │
│ │
│ No Active Reminders │
│ │
│ Set reminders when you upload │
│ prescriptions, or add manually. │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📸 Upload Prescription │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ ➕ Add Reminder Manually │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Reminders Screen (With Active Reminders)
text
┌─────────────────────────────────────┐
│ Medication Reminders [←] │
├─────────────────────────────────────┤
│ │
│ ⏰ Next Reminder: │
│ ┌─────────────────────────────┐ │
│ │ 💊 Metformin 500mg │ │
│ │ Today, 8:00 PM (in 3 hours) │ │
│ │ [✓ Mark as Taken] │ │
│ └─────────────────────────────┘ │
│ │
│ Upcoming Today: │
│ No more reminders today ✓ │
│ │
│ Tomorrow: │
│ ┌─────────────────────────────┐ │
│ │ 💊 Metformin 500mg │ │
│ │ 8:00 AM, 8:00 PM │ │
│ └─────────────────────────────┘ │
│ │
│ Active Medications (3): │
│ │
│ ┌─────────────────────────────┐ │
│ │ 💊 Metformin │ │
│ │ 500mg, twice daily │ │
│ │ 25 days remaining │ │
│ │ Ends: June 6 │ │
│ │ [⚙️ Edit] [🗑️ Stop] │ │
│ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ ➕ Add New Reminder │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Add Manual Reminder
text
┌─────────────────────────────────────┐
│ Add Reminder Manually [←] │
├─────────────────────────────────────┤
│ │
│ Medicine Name: │
│ ┌─────────────────────────────┐ │
│ │ Vitamin D3**\*\***\_**\*\*** │ │
│ └─────────────────────────────┘ │
│ │
│ Dosage (optional): │
│ ┌─────────────────────────────┐ │
│ │ 60,000 IU**\*\***\_\_**\*\*** │ │
│ └─────────────────────────────┘ │
│ │
│ How often? │
│ ○ Daily │
│ ○ Twice daily │
│ ○ Three times daily │
│ ● Weekly │
│ ○ Custom │
│ │
│ Day of week: │
│ [S] [M] [T] [W] [T] [F] [●S] │
│ │
│ Reminder Time: │
│ ┌─────────────────────────────┐ │
│ │ 🕐 10:00 AM [Edit]│ │
│ └─────────────────────────────┘ │
│ │
│ Duration: │
│ ○ Ongoing (no end date) │
│ ● Specific duration │
│ ┌───────┬───────────────────┐ │
│ │ 12 │ weeks [▼] │ │
│ └───────┴───────────────────┘ │
│ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Save Reminder │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘ 6. Settings Screen
text
┌─────────────────────────────────────┐
│ Settings [←] │
├─────────────────────────────────────┤
│ │
│ Account │
│ ┌─────────────────────────────┐ │
│ │ John Doe │ │
│ │ john.doe@email.com │ │
│ │ [Edit Profile] │ │
│ └─────────────────────────────┘ │
│ │
│ Notifications │
│ ┌─────────────────────────────┐ │
│ │ [●] Medication Reminders │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [●] Push Notifications │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [●] Refill Alerts │ │
│ │ 3 days before end │ │
│ └─────────────────────────────┘ │
│ │
│ Default Reminder Times │
│ ┌─────────────────────────────┐ │
│ │ Morning: 08:00 AM [Edit] │ │
│ │ Afternoon: 02:00 PM [Edit] │ │
│ │ Evening: 08:00 PM [Edit] │ │
│ │ Night: 10:00 PM [Edit] │ │
│ └─────────────────────────────┘ │
│ │
│ Privacy & Security │
│ ┌─────────────────────────────┐ │
│ │ [●] Biometric Lock │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Backup & Export Data │ │
│ └─────────────────────────────┘ │
│ │
│ About │
│ Version 1.0.0 │
│ Privacy Policy • Terms of Service │
│ │
│ ┌─────────────────────────────┐ │
│ │ 🚪 Log Out │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘ 7. Document Detail View
text
┌─────────────────────────────────────┐
│ Prescription [←] [⋮] │
├─────────────────────────────────────┤
│ │
│ ┌─────────────────────────────┐ │
│ │ │ │
│ │ [Document Image] │ │
│ │ Pinch to zoom │ │
│ │ │ │
│ └─────────────────────────────┘ │
│ │
│ 📅 Date: May 7, 2026 │
│ 🏥 Hospital: Apollo Hospital │
│ 👨‍⚕️ Doctor: Dr. Rajesh Kumar │
│ │
│ 💊 Medications (2): │
│ ┌─────────────────────────────┐ │
│ │ • Metformin 500mg │ │
│ │ 2x daily • 30 days │ │
│ │ [View Reminder] │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ • Aspirin 75mg │ │
│ │ Once daily • Ongoing │ │
│ │ [+ Set Reminder] │ │
│ └─────────────────────────────┘ │
│ │
│ 📝 Full Extracted Text: │
│ "Patient: John Doe │
│ Age: 45 years │
│ Diagnosis: Type 2 Diabetes │
│ │
│ Rx: │
│ 1. Metformin 500mg │
│ Tab BD (After meals) │
│ Duration: 30 days... │
│ │
│ [Show More] │
│ │
│ ┌─────────────────────────────┐ │
│ │ 📤 Share │ │
│ └─────────────────────────────┘ │
│ │
└─────────────────────────────────────┘
Menu Options (⋮):

Edit Details

Download Image

Delete Document

8. Push Notification
   text
   ┌─────────────────────────────────────┐
   │ Medical Organizer 8:00 PM │
   ├─────────────────────────────────────┤
   │ 💊 Medication Reminder │
   │ │
   │ Time to take Metformin 500mg │
   │ │
   │ [Mark as Taken] [Snooze 15 min] │
   └─────────────────────────────────────┘
   After tapping notification → Opens to Reminders screen with that medication highlighted

Complete User Journey Examples
Journey 1: First Time User Uploads Prescription
Downloads app → Sees onboarding (3 screens)

Signs up with Google → Goes to empty home screen

Taps "Upload Document" → Chooses "Take Photo"

Captures prescription → Confirms image

Waits 10-15 seconds → Processing screen

Sees results: Prescription with 2 medications found

Taps "Set Reminder" on Metformin

Edits times to 8 AM and 9 PM → Saves

Sees confirmation toast

Taps "Done" → Returns to home (now shows 1 document, 1 medication)

Next day 8 AM → Gets push notification

Marks as taken

Journey 2: User Searches for Old Document
Opens app → Home screen

Taps search bar

Types "blood test"

Sees 3 lab reports with similarity scores

Taps top result (95% match)

Views full lab report details

Taps image to zoom and read values

Journey 3: User Adds Manual Reminder
Opens app → Taps Reminders tab

Taps "Add Reminder Manually"

Fills in:

Medicine: Vitamin D3

Dosage: 60,000 IU

Frequency: Weekly (Saturday)

Time: 10 AM

Duration: 12 weeks

Taps "Save Reminder"

Sees new reminder in list

│ 🏠 🔍 ➕ 🔔² 👤 │
│ ■Home Search Upload Alert You│ ← Blue underline/bold
