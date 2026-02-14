from app.db.session import SessionLocal
from app.db.models import User

def fix_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            if user.notify_on_arrival is None:
                user.notify_on_arrival = True
            if user.notify_on_departure is None:
                user.notify_on_departure = True
            if user.notify_on_delay is None:
                user.notify_on_delay = True
            if user.notify_via_email is None:
                user.notify_via_email = True
            if user.notify_via_whatsapp is None:
                user.notify_via_whatsapp = False
        db.commit()
        print(f"Fixed {len(users)} users.")
    finally:
        db.close()

if __name__ == "__main__":
    fix_users()
