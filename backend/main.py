from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import shutil
import os

from supabase_db import db
from model import nutrition_model

# ========== إنشاء FastAPI App ==========
app = FastAPI(
    title="Fitness App API",
    description="Backend API for Fitness Tracking App with AI Nutrition",
    version="1.0.0"
)

# ========== CORS ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== SCHEMAS ==========
class UserProfile(BaseModel):
    id: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    target_weight: Optional[float] = None
    goal: Optional[str] = None

class NutritionRequest(BaseModel):
    age: int
    weight: float
    height: float
    gender: str
    goal: str
    activity_level: str

class WorkoutLog(BaseModel):
    user_id: str
    name: str
    type: str
    duration: int
    calories_burned: Optional[int] = 0
    date: str
    notes: Optional[str] = None

class NutritionLog(BaseModel):
    user_id: str
    meal_type: str
    food_name: str
    calories: int
    protein: float
    carbs: float
    fats: float
    date: str

class ProgressLog(BaseModel):
    user_id: str
    weight: float
    date: str
    notes: Optional[str] = None

# ========== BASIC ROUTES ==========

@app.get("/")
async def root():
    return {
        "message": "Fitness App API 🏋️",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "ai_nutrition": "/ai/nutrition-plan",
            "recognize_food": "/ai/recognize-food"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": nutrition_model.model is not None,
        "nutrition_table_loaded": nutrition_model.nutrition_table is not None
    }

# ========== PROFILE ==========

@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    """جلب بيانات المستخدم"""
    profile = db.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"profile": profile}

@app.put("/profile/{user_id}")
async def update_profile(user_id: str, profile: dict):
    """تحديث بيانات المستخدم"""
    updated = db.update_profile(user_id, profile)
    return {"success": True, "profile": updated}

# ========== AI NUTRITION ==========

@app.post("/ai/nutrition-plan")
async def get_nutrition_plan(request: NutritionRequest):
    """الحصول على خطة غذائية من AI"""
    try:
        nutrition = nutrition_model.calculate_basic_nutrition(request.dict())
        meal_plan = nutrition_model.generate_meal_plan(nutrition)
        
        return {
            "success": True,
            "user_data": request.dict(),
            "daily_nutrition": nutrition,
            "meal_plan": meal_plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/meal-suggestions/{user_id}")
async def get_meal_suggestions(user_id: str):
    """اقتراحات وجبات بناءً على بروفايل المستخدم"""
    profile = db.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    nutrition = nutrition_model.calculate_basic_nutrition(profile)
    meal_plan = nutrition_model.generate_meal_plan(nutrition)
    
    return {
        "success": True,
        "meal_plan": meal_plan,
        "daily_nutrition": nutrition
    }

# ========== IMAGE RECOGNITION ==========

@app.post("/ai/recognize-food")
async def recognize_food(file: UploadFile = File(...)):
    """التعرف على الطعام من صورة"""
    
    # حفظ الصورة مؤقتاً
    temp_path = f"temp_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # التعرف على الطعام
        result = nutrition_model.predict_food(temp_path)
        
        # حذف الملف المؤقت
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return result
    
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/food-info/{food_name}")
async def get_food_info(food_name: str):
    """الحصول على معلومات تغذية لطعام محدد"""
    nutrition = nutrition_model.get_nutrition(food_name)
    return {
        "food_name": food_name.replace('_', ' ').title(),
        "nutrition": nutrition
    }

# ========== WORKOUTS ==========

@app.get("/workouts/{user_id}")
async def get_workouts(user_id: str, limit: int = 20):
    """جلب تمارين المستخدم"""
    workouts = db.get_workouts(user_id, limit)
    return {"workouts": workouts}

@app.post("/workouts")
async def add_workout(workout: WorkoutLog):
    """إضافة تمرين جديد"""
    result = db.add_workout(workout.dict())
    return {"success": True, "workout": result}

@app.delete("/workouts/{workout_id}/{user_id}")
async def delete_workout(workout_id: str, user_id: str):
    """حذف تمرين"""
    result = db.delete_workout(workout_id, user_id)
    return {"success": True, "deleted": result}

# ========== NUTRITION LOGS ==========

@app.get("/nutrition-logs/{user_id}")
async def get_nutrition_logs(user_id: str, date: Optional[str] = None):
    """جلب سجل التغذية"""
    logs = db.get_nutrition_logs(user_id, date)
    
    if date:
        summary = db.get_daily_nutrition_summary(user_id, date)
        return {"logs": logs, "summary": summary}
    
    return {"logs": logs}

@app.post("/nutrition-logs")
async def add_nutrition_log(log: NutritionLog):
    """إضافة سجل تغذية"""
    result = db.add_nutrition_log(log.dict())
    return {"success": True, "log": result}

@app.get("/nutrition-logs/summary/{user_id}/{date}")
async def get_daily_summary(user_id: str, date: str):
    """ملخص التغذية اليومية"""
    summary = db.get_daily_nutrition_summary(user_id, date)
    return {"date": date, "summary": summary}

# ========== FOOD SEARCH ==========

@app.get("/foods/search")
async def search_foods(query: str, limit: int = 10):
    """البحث عن أطعمة"""
    foods = db.search_foods(query, limit)
    return {"foods": foods}

@app.get("/foods/{food_id}")
async def get_food(food_id: int):
    """جلب طعام محدد"""
    food = db.get_food_by_id(food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"food": food}

# ========== PROGRESS TRACKING ==========

@app.get("/progress/{user_id}")
async def get_progress(user_id: str, limit: int = 30):
    """جلب سجل التقدم"""
    progress = db.get_progress(user_id, limit)
    return {"progress": progress}

@app.post("/progress")
async def add_progress(progress: ProgressLog):
    """إضافة سجل تقدم"""
    result = db.add_progress(progress.dict())
    return {"success": True, "progress": result}

@app.get("/progress/weight/{user_id}")
async def get_weight_progress(user_id: str):
    """تقدم الوزن فقط (للرسم البياني)"""
    weight_data = db.get_weight_progress(user_id)
    return {"weight_progress": weight_data}

# ========== MAIN ==========

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)