# 📝 Customer Complaint Form System

A professional, multi-step complaint form system built with vanilla JavaScript, featuring advanced validation, file uploads, and a modern responsive design.

![Complaint Form Preview](preview.png)

## ✨ Features

### 📋 Multi-Step Form Interface
- **Progress Tracking** - Visual progress bar with step indicators
- **Step Navigation** - Next/Previous buttons with validation
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Transitions between steps

### ✅ Advanced Validation
- **Real-time Validation** - Instant feedback on input fields
- **Complex Pattern Matching** - Order numbers, product codes, emails
- **Conditional Validation** - Required fields based on selections
- **Character Counters** - For text areas with minimum requirements
- **File Validation** - Type and size restrictions (5MB max)

### 🎨 Modern UI Components
- **Custom Checkboxes & Radios** - Beautiful styled options with icons
- **File Upload Zone** - Drag & drop with visual feedback
- **Quantity Selector** - With +/- buttons
- **Priority Selector** - Visual priority cards
- **Success Modal** - Professional confirmation screen

### 📊 Form Features
- **Comprehensive Data Collection** - Personal, order, complaint, solution details
- **File Attachments** - Upload evidence (images, PDFs, documents)
- **Terms & Conditions** - Required acceptance
- **Data Persistence** - Form data preserved between steps

### 🛠️ Technical Features
- **Vanilla JavaScript** - No frameworks or libraries required
- **Modern CSS** - CSS Grid, Flexbox, Custom Properties, Animations
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Error Handling** - Comprehensive error messages and recovery

## 🚀 How to Use

### Step 1: Personal Information
1. Enter your full name
2. Provide a valid email address
3. Add phone number (optional)
4. Include customer ID (optional)
5. Click "Next"

### Step 2: Order Details
1. Enter order number (format: 2024######)
2. Select order date
3. Input product code (format: XX##-X###-XX#)
4. Set quantity using +/- buttons
5. Click "Next"

### Step 3: Complaint Details
1. Select complaint reason(s) - choose all that apply
2. Write detailed description (minimum 20 characters)
3. Upload evidence files (optional, drag & drop supported)
4. Click "Next"

### Step 4: Desired Solution
1. Choose preferred solution type
2. Add additional notes if needed
3. Select priority level (Low, Medium, High)
4. Accept terms and conditions
5. Click "Submit Complaint"

### After Submission
- Receive unique reference ID
- View complaint summary
- Print confirmation
- Start new complaint if needed

## 🔧 Validation Rules

### Required Fields:
- Full Name (non-empty)
- Email (valid format)
- Order Number (2024###### pattern)
- Order Date (valid date, not future)
- Product Code (XX##-X###-XX# pattern)
- Quantity (minimum 1)
- At least one complaint reason
- Complaint description (20+ characters)
- One solution selected
- Terms acceptance

### Optional Fields:
- Phone Number
- Customer ID
- File attachments
- Solution description

### File Restrictions:
- Maximum size: 5MB per file
- Accepted types: JPG, PNG, PDF, DOC, DOCX
- Maximum files: No limit (browser dependent)

## 💾 Data Handling

- All data is processed client-side
- No server required for demonstration
- In production, would connect to backend API
- Files are validated but not uploaded in demo

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🎨 Design System

### Colors:
- Primary: #4361ee (Blue)
- Secondary: #7209b7 (Purple)
- Success: #4cc9f0 (Light Blue)
- Danger: #f72585 (Pink)
- Warning: #f8961e (Orange)

### Typography:
- Primary Font: Poppins (Headings)
- Secondary Font: Roboto (Body)

### Components:
- Custom form controls
- Progress indicators
- Modal dialogs
- File upload zone
- Priority cards

## 📁 Project Structure
