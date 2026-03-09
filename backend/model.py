import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

class NutritionModel:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.classes = []
        self.nutrition_table = None
        self.transform = self.get_transform()
        self.load_model()
        self.load_nutrition_table()
    
    def get_transform(self):
        """Transform للصور - نفس Colab"""
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def load_model(self):
        """تحميل MobileNetV3 model - نفس Colab"""
        model_path = os.getenv("MODEL_PATH", "mobilenetv3_large_food101.pth")
        
        try:
            # تحميل checkpoint
            checkpoint = torch.load(model_path, map_location=self.device)
            
            # استخراج classes
            self.classes = checkpoint["classes"]
            num_classes = len(self.classes)
            
            # إنشاء model
            self.model = models.mobilenet_v3_large(weights=None)  # updated parameter
            self.model.classifier[3] = nn.Linear(
                self.model.classifier[3].in_features,
                num_classes
            )
            
            # تحميل الأوزان
            self.model.load_state_dict(checkpoint["model_state"])
            self.model = self.model.to(self.device)
            self.model.eval()
            
            print(f"✅ Model Loaded Successfully from {model_path}")
            print(f"📊 Classes: {len(self.classes)}")
            
        except Exception as e:
            print(f"⚠️ Could not load model: {e}")
            self.model = None
    
    def load_nutrition_table(self):
        """تحميل جدول التغذية"""
        csv_path = os.getenv("NUTRITION_CSV_PATH", "clean_nutrition_usda.csv")
        
        try:
            self.nutrition_table = pd.read_csv(csv_path)
            print(f"✅ Nutrition Table Loaded: {len(self.nutrition_table)} foods")
        except Exception as e:
            print(f"⚠️ Could not load nutrition table: {e}")
            self.nutrition_table = None
    
    def predict_food(self, image_path: str):
        """التعرف على الطعام من صورة - نفس Colab"""
        if self.model is None:
            return {"error": "Model not loaded", "success": False}
        
        try:
            # تحميل وتحويل الصورة
            image = Image.open(image_path).convert("RGB")
            image_tensor = self.transform(image)
            image_tensor = image_tensor.unsqueeze(0).to(self.device)
            
            # التنبؤ
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probs = torch.softmax(outputs, dim=1)
                confidence, pred = torch.max(probs, 1)
            
            predicted_class = self.classes[pred.item()]
            confidence_score = confidence.item()
            
            # الحصول على معلومات التغذية
            nutrition = self.get_nutrition(predicted_class)
            
            return {
                'success': True,
                'food_name': predicted_class.replace('_', ' ').title(),
                'confidence': f"{confidence_score * 100:.2f}%",
                'confidence_score': confidence_score,
                'nutrition': nutrition
            }
        
        except Exception as e:
            return {'error': str(e), 'success': False}
    
    def get_nutrition(self, food_name: str):
        """الحصول على معلومات التغذية - نفس Colab"""
        if self.nutrition_table is None:
            return {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "note": "Nutrition table not loaded"
            }
        
        try:
            # البحث في جدول التغذية
            food_search = food_name.replace("_", " ")
            results = self.nutrition_table[
                self.nutrition_table["description"].str.contains(
                    food_search, case=False, na=False
                )
            ]
            
            if len(results) == 0:
                return {
                    "calories": 0,
                    "protein": 0,
                    "carbs": 0,
                    "fat": 0,
                    "note": "Nutrition data not found"
                }
            
            # أفضل تطابق
            best_match = results.iloc[0]
            
            return {
                "calories": float(best_match["calories"]),
                "protein": float(best_match["protein"]),
                "carbs": float(best_match["carbs"]),
                "fat": float(best_match["fat"]),
                "serving": "per 100g"
            }
        
        except Exception as e:
            return {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "error": str(e)
            }
    
    def calculate_basic_nutrition(self, user_data: dict):
        """حساب الاحتياجات الغذائية اليومية"""
        weight = user_data.get('weight', 70)
        height = user_data.get('height', 170)
        age = user_data.get('age', 25)
        gender = user_data.get('gender', 'male')
        goal = user_data.get('goal', 'maintain')
        activity = user_data.get('activity_level', 'moderate')
        
        # BMR (Mifflin-St Jeor)
        if gender == 'male':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        # TDEE
        activity_multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        }
        tdee = bmr * activity_multipliers.get(activity, 1.55)
        
        # Goal adjustment
        if goal == 'lose_weight':
            calories = tdee - 500
        elif goal == 'gain_muscle':
            calories = tdee + 300
        else:
            calories = tdee
        
        # Macros
        protein_grams = weight * 2
        protein_calories = protein_grams * 4
        fats_calories = calories * 0.25
        fats_grams = fats_calories / 9
        carbs_calories = calories - protein_calories - fats_calories
        carbs_grams = carbs_calories / 4
        
        return {
            'calories': round(calories),
            'protein': round(protein_grams),
            'carbs': round(carbs_grams),
            'fats': round(fats_grams),
            'bmr': round(bmr),
            'tdee': round(tdee)
        }
    
    def generate_meal_plan(self, nutrition_data: dict):
        """توزيع السعرات على الوجبات"""
        total_calories = nutrition_data['calories']
        total_protein = nutrition_data['protein']
        total_carbs = nutrition_data['carbs']
        total_fats = nutrition_data['fats']
        
        meals = {
            'breakfast': {
                'calories': round(total_calories * 0.25),
                'protein': round(total_protein * 0.25),
                'carbs': round(total_carbs * 0.30),
                'fats': round(total_fats * 0.20),
                'time': '7:00 AM - 9:00 AM'
            },
            'lunch': {
                'calories': round(total_calories * 0.35),
                'protein': round(total_protein * 0.40),
                'carbs': round(total_carbs * 0.35),
                'fats': round(total_fats * 0.35),
                'time': '12:00 PM - 2:00 PM'
            },
            'dinner': {
                'calories': round(total_calories * 0.30),
                'protein': round(total_protein * 0.30),
                'carbs': round(total_carbs * 0.25),
                'fats': round(total_fats * 0.35),
                'time': '6:00 PM - 8:00 PM'
            },
            'snacks': {
                'calories': round(total_calories * 0.10),
                'protein': round(total_protein * 0.05),
                'carbs': round(total_carbs * 0.10),
                'fats': round(total_fats * 0.10),
                'time': 'Throughout the day'
            }
        }
        return meals

# إنشاء instance واحد
nutrition_model = NutritionModel()