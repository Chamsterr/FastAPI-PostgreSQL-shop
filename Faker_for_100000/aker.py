from faker import Faker
import psycopg2

fake = Faker()

conn = psycopg2.connect(database="Store", user="postgres", password="1", host="127.0.0.1", port="8888")
cur = conn.cursor()

for _ in range(50000):
    email = fake.email()
    username = fake.user_name()
    registered_at = fake.date_time_this_decade()
    hashed_password = fake.password(length=12)
    is_active = True
    is_superuser = False
    is_verified = False

    cur.execute(
        f'INSERT INTO "user" (email, username, registered_at, hashed_password, is_active, is_superuser, is_verified) VALUES (%s, %s, %s, %s, %s, %s, %s)',
        (email, username, registered_at, hashed_password, is_active, is_superuser, is_verified)
    )

conn.commit()

cur.close()
conn.close()