# Testing Guide - AI Closet App

## 🚀 Quick Start Testing

### Step 1: Start Backend Server

**Open Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:3000
Database initialized
```

✅ **Success:** Backend is running

---

### Step 2: Start Frontend App

**Open Terminal 2 (new terminal):**
```bash
npm start
```

**Expected Output:**
```
› Metro waiting on exp://...
› Press w │ open web
› Press s │ switch to development build
```

**Then press `w` for web browser**

**Expected:** Browser opens at `http://localhost:8081`

✅ **Success:** Frontend is running

---

## 📱 Testing Checklist

### ✅ Test 1: Onboarding Flow

1. **First Launch:**
   - App should show onboarding screen
   - Should display features (Wardrobe, AI Fits, Calendar, etc.)
   - "Get Started" button should work

2. **Complete Onboarding:**
   - Tap "Get Started"
   - Should navigate to main app

✅ **Pass:** Onboarding works correctly

---

### ✅ Test 2: Authentication

#### 2.1 Create Account

1. **Navigate to Login:**
   - If not logged in, should see login screen
   - Should have "Sign up" option

2. **Test Email Validation:**
   - Enter invalid email (e.g., "test")
   - ✅ Should show error: "Please enter a valid email address"
   - Enter valid email (e.g., "test@example.com")
   - ✅ Error should disappear

3. **Test Password Complexity:**
   - Enter weak password (e.g., "123")
   - ✅ Should show requirements checklist:
     - ❌ Minimum 8 characters
     - ❌ Uppercase letter
     - ❌ Lowercase letter
     - ❌ Number
     - ❌ Special character
   
   - Enter strong password (e.g., "Test123!@#")
   - ✅ All requirements should check off

4. **Create Account:**
   - Enter valid email: `test@example.com`
   - Enter strong password: `Test123!@#`
   - Tap "Sign Up"
   - ✅ Should create account successfully
   - ✅ Should navigate to main app

#### 2.2 Login

1. **Logout:**
   - Go to Profile tab
   - Tap logout (if available)
   - OR restart app

2. **Login:**
   - Enter email: `test@example.com`
   - Enter password: `Test123!@#`
   - Tap "Sign In"
   - ✅ Should login successfully

#### 2.3 User Already Exists

1. **Try to create duplicate account:**
   - Enter same email: `test@example.com`
   - Enter password: `Test123!@#`
   - Tap "Sign Up"
   - ✅ Should show error: "An account with this email already exists"
   - ✅ Should suggest switching to login mode

✅ **Pass:** Authentication works correctly

---

### ✅ Test 3: Backend URL Configuration

1. **Navigate to Settings:**
   - Go to Profile tab
   - Tap "Settings"
   - Expand "Backend Server URL"

2. **Configure URL:**
   - Current URL should show (or be empty)
   - Enter: `http://localhost:3000/api` (for same computer)
   - OR: `http://YOUR_IP:3000/api` (for mobile device)
   - Tap "Save"
   - ✅ Should save successfully

3. **Verify Connection:**
   - Try creating account or adding item
   - ✅ Should sync with backend

✅ **Pass:** Backend URL configuration works

---

### ✅ Test 4: Add Clothing Item

#### 4.1 Basic Add

1. **Navigate to Add Item:**
   - Go to Closet tab
   - Tap "+" or "Add Item" button
   - Should open Add Item screen

2. **Add Photo:**
   - Tap "Choose from Gallery" or "Take Photo"
   - Select or take a photo
   - ✅ Photo should appear in preview
   - ✅ Should show "Analyzing image..." briefly
   - ✅ Should auto-fill some attributes (category, color, season)

3. **Fill Details:**
   - Category: Select "Tops" (or any category)
   - Color: Select "Blue" (or any color)
   - Brand: Enter "Nike"
   - Size: Enter "M"
   - Season: Select "All Season"
   - Cost: Enter "50"
   - Tags: Add "casual", "comfortable"

4. **Save Item:**
   - Tap "Save" or "Add Item"
   - ✅ Should save successfully
   - ✅ Should navigate back to Closet
   - ✅ Item should appear in wardrobe

#### 4.2 Drag and Drop (Web Only)

1. **On Web Browser:**
   - Go to Add Item screen
   - Drag image file onto drop zone
   - ✅ Should upload image
   - ✅ Should trigger auto-analysis

✅ **Pass:** Add clothing item works

---

### ✅ Test 5: View Wardrobe

1. **View Items:**
   - Go to Closet tab
   - ✅ Should see all added items
   - ✅ Items should display with photos

2. **Filter Items:**
   - Tap filter chips (Category, Color, Season)
   - ✅ Should filter items accordingly
   - ✅ Clear filters should show all items

3. **View Item Details:**
   - Tap on an item card
   - ✅ Should show item details (if implemented)
   - OR should navigate to edit screen

✅ **Pass:** Wardrobe viewing works

---

### ✅ Test 6: AI Outfit Generation

1. **Navigate to Fits:**
   - Go to Fits tab
   - Should see outfit generation screen

2. **Generate Outfits:**
   - Select occasion: "Casual" (or any)
   - Select weather: "Sunny" (or any)
   - Select mood: "Comfortable" (or any)
   - Tap "Generate Outfits"
   - ✅ Should show loading state
   - ✅ Should generate 3-5 outfit suggestions

3. **View Outfits:**
   - ✅ Each outfit should show:
     - Outfit preview (layered items)
     - Style explanation
     - Total cost
     - Items used

4. **Save Outfit:**
   - Tap "Save Outfit" on any outfit
   - ✅ Should save successfully
   - ✅ Should show confirmation

5. **Regenerate:**
   - Tap "Regenerate" or generate again
   - ✅ Should generate new outfits

6. **Lock Items:**
   - Tap lock icon on any item (if available)
   - Generate again
   - ✅ Locked items should appear in all outfits

✅ **Pass:** AI outfit generation works

---

### ✅ Test 7: Calendar & Usage Tracking

1. **Navigate to Calendar:**
   - Go to Calendar tab
   - ✅ Should show calendar view

2. **Log Outfit:**
   - Tap on a date
   - Select an outfit (or create one)
   - ✅ Should log outfit to that date

3. **View History:**
   - Navigate to different months
   - ✅ Should show logged outfits
   - ✅ Should show wear count

4. **View Statistics:**
   - Check item wear counts
   - ✅ Should show how many times each item was worn
   - ✅ Should calculate cost-per-wear

✅ **Pass:** Calendar and tracking work

---

### ✅ Test 8: Cross-Platform Testing

#### 8.1 Web Browser

1. **Access on Computer:**
   - `http://localhost:8081`
   - ✅ Should load app
   - ✅ All features should work

2. **Access on Mobile Browser:**
   - Find computer IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - On mobile browser: `http://YOUR_IP:8081`
   - ✅ Should load app
   - ✅ Should work (may need to configure backend URL)

#### 8.2 Expo Go App

1. **Install Expo Go:**
   - Install from App Store (iOS) or Play Store (Android)

2. **Connect:**
   - In Expo terminal, press `s`
   - Select `tunnel` or `lan`
   - Scan QR code with Expo Go
   - OR manually enter: `exp://YOUR_IP:8081`

3. **Test:**
   - ✅ App should load
   - ✅ All features should work
   - ✅ Photos should work (camera/gallery)

✅ **Pass:** Cross-platform works

---

### ✅ Test 9: Data Sync

1. **Add Item on Device 1:**
   - Add a clothing item
   - ✅ Should save

2. **Check on Device 2:**
   - Login with same account
   - ✅ Item should appear (if backend sync working)

3. **Edit on Device 2:**
   - Edit the item
   - ✅ Should update

4. **Check on Device 1:**
   - Refresh or reload
   - ✅ Changes should appear

✅ **Pass:** Data sync works

---

### ✅ Test 10: Error Handling

1. **Network Error:**
   - Stop backend server
   - Try to add item
   - ✅ Should show error message
   - ✅ Should fall back to local storage

2. **Invalid Input:**
   - Try to submit form with empty fields
   - ✅ Should show validation errors

3. **Image Upload Error:**
   - Try to upload invalid file
   - ✅ Should show error message

✅ **Pass:** Error handling works

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"

**Solution:**
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check backend URL in Profile → Settings
3. Verify URL format: `http://YOUR_IP:3000/api`

### Issue: "Network error" when creating account

**Solution:**
1. Backend must be running
2. Check backend terminal for errors
3. Verify CORS is configured correctly

### Issue: Images not uploading

**Solution:**
1. Check permissions (camera/gallery)
2. On web: Try drag-and-drop
3. On mobile: Use Expo Go app for full functionality

### Issue: Outfits not generating

**Solution:**
1. Make sure you have clothing items in wardrobe
2. Check console for errors
3. Verify AI service is working (currently mock)

### Issue: Data not syncing

**Solution:**
1. Make sure you're logged in
2. Check backend URL configuration
3. Verify backend is running
4. Check network connection

---

## 📊 Testing Summary

### Core Features ✅
- [ ] Onboarding flow
- [ ] Authentication (signup/login)
- [ ] Add clothing items
- [ ] View wardrobe
- [ ] Filter items
- [ ] AI outfit generation
- [ ] Save outfits
- [ ] Calendar view
- [ ] Usage tracking
- [ ] Settings

### Platform Testing ✅
- [ ] Web browser (computer)
- [ ] Web browser (mobile)
- [ ] Expo Go (iOS)
- [ ] Expo Go (Android)

### Edge Cases ✅
- [ ] Empty wardrobe
- [ ] Network errors
- [ ] Invalid input
- [ ] Image upload errors
- [ ] Data sync conflicts

---

## 🎯 Quick Test Script

**5-Minute Quick Test:**

1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Start frontend: `npm start` → press `w`
3. ✅ Create account: `test@example.com` / `Test123!@#`
4. ✅ Add item: Upload photo, fill details, save
5. ✅ Generate outfit: Go to Fits, generate outfits
6. ✅ Save outfit: Save one outfit
7. ✅ View calendar: Check calendar tab

**If all pass → App is working! 🎉**

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

✅ Authentication: [ ] Pass [ ] Fail
✅ Add Items: [ ] Pass [ ] Fail
✅ View Wardrobe: [ ] Pass [ ] Fail
✅ Generate Outfits: [ ] Pass [ ] Fail
✅ Calendar: [ ] Pass [ ] Fail
✅ Cross-Platform: [ ] Pass [ ] Fail
✅ Data Sync: [ ] Pass [ ] Fail

Issues Found:
_________________________________
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
```

---

**Ready to test! Start with the Quick Test Script above.** 🚀


