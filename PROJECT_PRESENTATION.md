# NutriMove Fitness & Nutrition Tracking Application
## Professional Project Overview

---

## 1. Project Summary

**NutriMove** is a comprehensive mobile fitness and nutrition tracking application designed to help users achieve their health and fitness goals through intelligent calorie management, meal tracking with AI food recognition, and personalized nutrition planning.

The application combines **real-time nutrition analysis, personalized recommendations, and visual progress tracking** to provide users with actionable insights for their fitness journey.

---

## 2. Core Objectives

✅ **Personalized Calorie Management** - Calculate individualized daily calorie targets based on user metrics  
✅ **AI-Powered Nutrition Tracking** - Recognize food items from camera images and log nutrition automatically  
✅ **Smart Recommendations** - Provide context-aware food suggestions aligned with user goals  
✅ **Progress Monitoring** - Track daily, weekly, and monthly fitness/nutrition progress  
✅ **Secure User Management** - Implement authentication and personalized user profiles  

---

## 3. Technical Architecture

### **Frontend (React Native + TypeScript)**
- **Framework:** Expo with React Native
- **State Management:** Zustand for efficient state handling
- **Styling:** TailwindCSS with NativeWind for cross-platform consistency
- **Features:**
  - Authentication system (sign-in, sign-up, protected routes)
  - Tab-based navigation (Home, Nutrition, Workout, Calendar, Profile)
  - Real-time data sync with Supabase
  - Camera integration for food recognition

### **Backend (Python FastAPI)**
- **Framework:** FastAPI for high-performance REST API
- **AI/ML:** MobileNetV3 neural network for food classification
- **Database:** Supabase (PostgreSQL)
- **Features:**
  - Food recognition endpoint using pre-trained model
  - Personalized nutrition plan calculation
  - User profile and workout/nutrition logging endpoints

### **Database (Supabase/PostgreSQL)**
- User authentication and profiles
- Nutrition logs with meal classifications
- Workout tracking data
- Daily reports and progress tracking

---

## 4. Key Features & Implementation

### **4.1 Mifflin-St Jeor BMR Calculation** ⭐
The application uses the **Mifflin-St Jeor Equation** - the most accurate and widely used formula for calculating Basal Metabolic Rate:

**For Men:** BMR = 10W + 6.25H - 5A + 5  
**For Women:** BMR = 10W + 6.25H - 5A - 161

Where:
- W = Weight (kg)
- H = Height (cm)
- A = Age (years)

**TDEE Calculation:** BMR × Activity Multiplier
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

**Goal-Based Adjustments:**
- Lose Weight: TDEE - 500 cal
- Maintain: TDEE
- Gain Muscle: TDEE + 300 cal

### **4.2 AI Food Recognition**
- **Model:** MobileNetV3 Large trained on Food-101 dataset
- **Process:** Users capture food image → Model predicts food item → Nutrition data retrieved from USDA database
- **Accuracy:** Pre-trained model optimized for mobile deployment

### **4.3 Daily Report System**
Generates comprehensive daily analysis including:
- Total calories consumed vs. target
- Macronutrient breakdown (protein, carbs, fats)
- Workout calories burned
- Meal-by-meal breakdown
- AI feedback and recommendations
- Diet quality assessment

### **4.4 User Authentication Flow**
- JWT-based authentication with Supabase
- Protected routes for authenticated users
- Persistent session management
- Secure password handling

### **4.5 Onboarding System**
Multi-step user profile setup:
- Personal information (age, gender, height, weight)
- Fitness goals (lose weight, maintain, gain muscle)
- Activity level selection
- Target weight setting

---

## 5. User Experience Flow

```
1. Authentication (Sign-up/Sign-in)
   ↓
2. Onboarding (Complete Profile)
   ↓
3. Dashboard (Home Screen)
   ├─ View today's progress
   ├─ Log meals via camera
   └─ Track workouts
   ↓
4. Nutrition Tab
   ├─ Food recognition
   ├─ Log meals
   └─ View daily report with AI analysis
   ↓
5. Workout Tab
   ├─ Log exercises
   └─ Track calories burned
   ↓
6. Calendar View
   ├─ Historical data
   └─ Pattern analysis
   ↓
7. Profile Tab
   └─ Update settings & view stats
```

---

## 6. Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Mobile Frontend** | React Native, Expo, TypeScript, TailwindCSS |
| **State Management** | Zustand, React Hooks |
| **Backend API** | Python, FastAPI, Uvicorn |
| **AI/ML** | MobileNetV3, PyTorch, Food-101 dataset |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (JWT) |
| **Real-time Sync** | Supabase Realtime subscriptions |
| **Styling** | NativeWind, Tailwind CSS |

---

## 7. Key Algorithms & Formulas

### **Calorie Target Calculation**
```
BMR = (Gender-specific Mifflin-St Jeor formula)
TDEE = BMR × Activity Multiplier
Target Calories = TDEE + Goal Adjustment
```

### **Macronutrient Distribution**
- **Lose Weight:** 35% protein, 35% carbs, 30% fats
- **Gain Muscle:** 30% protein, 45% carbs, 25% fats
- **Maintain:** 25% protein, 50% carbs, 25% fats

### **Diet Quality Assessment**
- Compares consumed calories against target
- Calculates macronutrient adherence
- Generates urgency levels (low/medium/high)
- Provides personalized AI feedback

---

## 8. Data Flow Architecture

```
┌─────────────┐
│   User App  │
└──────┬──────┘
       │ (API Requests)
       ↓
┌──────────────────────┐
│   FastAPI Backend    │
│  - Food Recognition  │
│  - Nutrition Calc    │
│  - User Management   │
└──────┬───────────────┘
       │ (Database Queries)
       ↓
┌─────────────────┐
│ Supabase/       │
│ PostgreSQL DB   │
└─────────────────┘
```

---

## 9. Project Deliverables

✅ **Mobile Application**
- Full-featured React Native app with Expo
- Multi-screen navigation
- Real-time data synchronization

✅ **Backend API**
- RESTful endpoints for all features
- Food recognition using deep learning
- Personalized nutrition calculation

✅ **Database Schema**
- User profiles and authentication
- Nutrition logs with image storage
- Workout tracking
- Daily reports

✅ **AI Integration**
- Food detection model
- USDA nutrition database integration
- Personalized recommendations engine

---

## 10. Challenges Addressed

| Challenge | Solution |
|-----------|----------|
| Food Recognition Accuracy | Pre-trained MobileNetV3 model with Food-101 dataset |
| Personalized Calorie Targets | Mifflin-St Jeor equation with TDEE calculation |
| Real-time Data Sync | Supabase real-time subscriptions |
| Cross-platform Compatibility | React Native + NativeWind |
| Secure Authentication | JWT-based auth with Supabase |
| Mobile Performance | Optimized AI model (MobileNetV3) for deployment |

---

## 11. Project Metrics & Features

- **User Management:** Sign-up, authentication, profile customization
- **Features:** 5 main tabs (Home, Nutrition, Workout, Calendar, Profile)
- **Screens:** 15+ distinct screens covering full user journey
- **API Endpoints:** 20+ endpoints for nutrition, workouts, users, profiles
- **AI Models:** 1 pre-trained model (MobileNetV3 Food-101)
- **Database Tables:** 6+ tables (users, profiles, nutrition_logs, workouts, etc.)

---

## 12. Future Enhancements

🔮 Social features (friend connections, competition)  
🔮 Barcode scanning for packaged foods  
🔮 Integration with fitness wearables  
🔮 Advanced analytics and trend analysis  
🔮 Meal planning recommendations  
🔮 Community challenges and leaderboards  

---

## 13. How to Explain Key Differentiators

### When discussing **Personalization:**
*"The app calculates a truly personalized calorie target using the Mifflin-St Jeor equation, which factors in each user's weight, height, age, gender, and activity level. This is far more accurate than generic recommendations."*

### When discussing **AI Features:**
*"We integrated MobileNetV3, a state-of-the-art neural network trained on 101 food categories, enabling users to simply photograph their meal and get automatic nutrition logging."*

### When discussing **Technical Architecture:**
*"We separated concerns between a React Native frontend for user experience and a Python FastAPI backend for heavy computation and AI processing, communicating via REST APIs with a PostgreSQL database for persistence."*

### When discussing **Accuracy:**
*"By implementing the Mifflin-St Jeor equation (the gold standard in nutrition science published in 1990), combined with Harris-Benedict activity multipliers, our calorie calculations are scientifically validated."*

---

## 14. Implementation Highlights

✨ **Clean Architecture:** Separated concerns with service layers, custom hooks, and type-safe TypeScript  
✨ **Reusable Components:** Modular UI components for calendar, nutrition tracking, workout logging  
✨ **Error Handling:** Comprehensive error management with user-friendly feedback  
✨ **Performance:** Optimized rendering, efficient database queries, lightweight AI model  
✨ **Security:** JWT authentication, secure password handling, protected API routes  

---

## Conclusion

NutriMove represents a comprehensive solution that combines **mobile app development, machine learning, nutritional science, and database design** to create a practical tool that helps users achieve their fitness goals through intelligent tracking and personalized recommendations.

The project demonstrates proficiency in full-stack development, AI integration, and user experience design while addressing real-world fitness industry needs.
