from app.database import SessionLocal  
from app import models  
db = SessionLocal()  
db.query(models.User).delete()  
db.commit()  
print('Deleted users')  
