# Quick Project Explanation (2-3 minutes)

## Elevator Pitch

**"NutriMove is an AI-powered fitness tracking application that helps users achieve their health goals through personalized calorie management and intelligent meal tracking.**

**The app uses three core technologies: First, it implements the Mifflin-St Jeor equation to calculate each user's personalized daily calorie target based on their weight, height, age, and activity level. Second, it uses a pre-trained MobileNetV3 neural network to recognize food from camera images and automatically log nutrition. Third, it provides daily AI-generated analysis with personalized recommendations.**

**The tech stack combines React Native for the mobile frontend, Python FastAPI for the backend, and PostgreSQL for data persistence. The result is a complete end-to-end system that makes nutrition tracking effortless and science-based."**

---

## 30-Second Version

*"NutriMove is a fitness tracking app that combines AI and nutrition science. Users can photograph their meals and the app automatically logs calories and nutrients using deep learning. The app calculates personalized calorie targets using the Mifflin-St Jeor equation and provides daily feedback to keep users on track with their fitness goals."*

---

## Key Points to Emphasize

1. **Personalization via Science**
   - Use Mifflin-St Jeor equation (industry standard)
   - Individualized TDEE calculation
   - Not generic, one-size-fits-all recommendations

2. **AI Integration**
   - Computer vision for food recognition
   - MobileNetV3 deep learning model
   - Automatic nutrition extraction

3. **Full-Stack Development**
   - React Native mobile app
   - Python backend with FastAPI
   - PostgreSQL database
   - Shows end-to-end competency

4. **User-Centric Design**
   - Onboarding system captures user metrics
   - Daily reports with actionable insights
   - Multiple features (nutrition, workouts, calendar, progress)

---

## If Asked About Challenges

**"The main challenges were:**
- **Accuracy:** Ensuring the food recognition model works across different lighting and angles - solved by using a pre-trained model on 101 food categories
- **Personalization:** Making calorie targets accurate for diverse users - solved by implementing the scientifically-validated Mifflin-St Jeor equation
- **Real-time Sync:** Keeping data synchronized across devices - solved using Supabase's real-time subscription features
- **Mobile Performance:** Running AI inference on mobile devices - solved by using the lightweight MobileNetV3 model"

---

## If Asked About Your Proudest Achievement

**"I'm most proud of integrating the AI food recognition system seamlessly into the mobile app. Getting a complex deep learning model to run efficiently on a mobile device while maintaining accuracy required careful model selection (MobileNetV3), optimization, and testing. It's a feature that genuinely improves user experience by eliminating tedious manual food logging."**

---

## If Asked Why This Project Matters

**"Fitness and nutrition tracking apps are widely used, but most rely on manual data entry or generic calorie recommendations. This project addresses that by combining automation (AI food recognition) with personalization (Mifflin-St Jeor calculations), making it easier for users to stay consistent with their goals. The market shows this is valuable - billions are spent on fitness apps annually."**

---

## If Asked About Technical Decisions

**"I chose React Native with Expo because:**
- Single codebase for iOS/Android
- Fast development iteration
- Large ecosystem and community support

**I chose Python FastAPI for the backend because:**
- Excellent for AI/ML integration
- Built-in automatic API documentation
- High performance with async support

**I chose Supabase because:**
- PostgreSQL reliability
- Built-in authentication
- Real-time capabilities
- Free tier for development"**
