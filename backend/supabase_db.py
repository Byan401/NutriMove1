from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

class SupabaseDB:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        
        if not url or not key:
            print("⚠️ Warning: SUPABASE_URL or SUPABASE_KEY not found in .env")
            self.client = None
        else:
            self.client: Client = create_client(url, key)
            print("✅ Supabase connected successfully")
    
    # ========== PROFILES ==========
    def get_profile(self, user_id: str):
        """جلب بيانات المستخدم"""
        if not self.client:
            return None
        response = self.client.table('profiles').select('*').eq('id', user_id).execute()
        return response.data[0] if response.data else None
    
    def update_profile(self, user_id: str, data: dict):
        """تحديث بيانات المستخدم"""
        if not self.client:
            return None
        response = self.client.table('profiles').update(data).eq('id', user_id).execute()
        return response.data
    
    def create_profile(self, profile_data: dict):
        """إنشاء بروفايل جديد"""
        if not self.client:
            return None
        response = self.client.table('profiles').insert(profile_data).execute()
        return response.data
    
    # ========== WORKOUTS ==========
    def get_workouts(self, user_id: str, limit: int = 20):
        """جلب تمارين المستخدم"""
        if not self.client:
            return []
        response = self.client.table('workouts')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('date', desc=True)\
            .limit(limit)\
            .execute()
        return response.data
    
    def add_workout(self, workout_data: dict):
        """إضافة تمرين جديد"""
        if not self.client:
            return None
        response = self.client.table('workouts').insert(workout_data).execute()
        return response.data
    
    def delete_workout(self, workout_id: str, user_id: str):
        """حذف تمرين"""
        if not self.client:
            return None
        response = self.client.table('workouts')\
            .delete()\
            .eq('id', workout_id)\
            .eq('user_id', user_id)\
            .execute()
        return response.data
    
    # ========== NUTRITION LOGS ==========
    def get_nutrition_logs(self, user_id: str, date: str = None):
        """جلب سجل التغذية"""
        if not self.client:
            return []
        query = self.client.table('nutrition_logs').select('*').eq('user_id', user_id)
        
        if date:
            query = query.eq('date', date)
        
        response = query.order('created_at', desc=True).execute()
        return response.data
    
    def add_nutrition_log(self, log_data: dict):
        """إضافة سجل تغذية"""
        if not self.client:
            return None
        response = self.client.table('nutrition_logs').insert(log_data).execute()
        return response.data
    
    def get_daily_nutrition_summary(self, user_id: str, date: str):
        """ملخص التغذية اليومية"""
        logs = self.get_nutrition_logs(user_id, date)
        
        total = {
            'calories': sum(log.get('calories', 0) for log in logs),
            'protein': sum(log.get('protein', 0) for log in logs),
            'carbs': sum(log.get('carbs', 0) for log in logs),
            'fats': sum(log.get('fats', 0) for log in logs),
            'meals_count': len(logs)
        }
        return total
    
    # ========== PROGRESS TRACKING ==========
    def get_progress(self, user_id: str, limit: int = 30):
        """جلب سجل التقدم"""
        if not self.client:
            return []
        response = self.client.table('progress_tracking')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('date', desc=True)\
            .limit(limit)\
            .execute()
        return response.data
    
    def add_progress(self, progress_data: dict):
        """إضافة سجل تقدم"""
        if not self.client:
            return None
        response = self.client.table('progress_tracking').insert(progress_data).execute()
        return response.data
    
    def get_weight_progress(self, user_id: str):
        """جلب تقدم الوزن فقط"""
        progress = self.get_progress(user_id)
        return [
            {'date': p['date'], 'weight': p['weight']} 
            for p in progress if p.get('weight')
        ]
    
    # ========== NUTRITION TABLE (CSV) ==========
    def search_foods(self, query: str, limit: int = 10):
        """البحث في جدول الأطعمة"""
        if not self.client:
            return []
        response = self.client.table('nutrition')\
            .select('*')\
            .ilike('food_name', f'%{query}%')\
            .limit(limit)\
            .execute()
        return response.data
    
    def get_food_by_id(self, food_id: int):
        """جلب طعام محدد"""
        if not self.client:
            return None
        response = self.client.table('nutrition')\
            .select('*')\
            .eq('id', food_id)\
            .execute()
        return response.data[0] if response.data else None

# ========== إنشاء instance ==========
# هذا السطر مهم جداً! ✅
db = SupabaseDB()