import pandas as pd
import psycopg2
import ast

df = pd.read_csv('python/stored.csv')
diseases = df.iloc[:,0].values
symptoms = df.iloc[:,1].values

host = "ec2-52-72-34-184.compute-1.amazonaws.com"
dbname = "dbsfa958kpt335"
user = "mimsvndxbgrmep"
password = "01752f23d29059300fbb6b0a4d3eb3337dabc23780deffe5e5d3bad88adc3ddb"
sslmode = "require"
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")

cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS diseases;")
print("Finished dropping table (if existed)")

cursor.execute("CREATE TABLE diseases (name VARCHAR(200) PRIMARY KEY, symptoms text[]);")
print("Finished creating table")

for index in range(len(diseases)):
    symptom = ast.literal_eval(symptoms[index])
    print(symptom)
    cursor.execute("""INSERT INTO diseases (name,symptoms) VALUES (%(str)s, %(list)s);""",{'str': diseases[index],'list':symptom })

cursor.execute("SELECT * FROM diseases;")
rows = cursor.fetchall()

# Print all rows
for row in rows:
    print(str(row[0])+" "+str(row[1]))

conn.commit()
cursor.close()
conn.close()