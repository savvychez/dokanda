from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import requests
import time
import psycopg2
from googletrans import Translator

translator = Translator()
driver = webdriver.Chrome(executable_path=r'C:/Vatsal/Python/chromedriver.exe')
page = "https://www.nhsinform.scot/illnesses-and-conditions/a-to-z"

driver.get(page)
content = driver.page_source
soup = BeautifulSoup(content, features='html.parser')
names = []

for header in soup.findAll('h2', attrs={'class':'module__title'}):
    if header is not None and header.text is not None:
        names.append([(header.text+"").strip()])


print("finished")
# df = pd.DataFrame({'Name':names}) 
# df.to_csv('stored.csv', index=False, encoding='utf-8')
loc = 0
while loc!=3:
    print(loc)
    page = "https://www.google.com/search?q=symptoms+of+"+names[loc][0].replace(" ","+")
    driver.get(page)
    content = driver.page_source
    soup = BeautifulSoup(content, features='html.parser')

    results = soup.find('div', attrs={'class':'kp-blk c2xzTb Wnoohf OJXvsb'})
    if results is not None:
        results2 = results.findAll('li', attrs={'class':'TrT0Xe'})
        if results2 is not None:
            for li in results2:
                if li.text is not None:
                    text = li.text.strip().replace(".","")
                    if len(text)<50:
                        names[loc].append(text)

    if len(names[loc]) == 1:
        print("first")
        results = soup.findAll('div', attrs={'class':'m6vS6b PZPZlf'})
        if results is not None:
            for result in results:
                print("Not None Results")
                results2 = result.find('span', attrs={'class':'zA2Nl'})
                if results2 is not None:
                    print("Not None Results2")
                    print(str(results2.text))
                    if str(results2.text.strip()) == "Also common:" and result.text is not None:
                        text = result.text.strip()[12:].strip()
                        textArr = text.split(',')
                        for t in textArr:
                            names[loc].append(t.strip())
                            print("added single text")
    if len(names[loc]) == 1:                   
        names.pop(loc);
        loc-=1

    print(names[loc])
    for index in range(len(names[loc])):
        translation = translator.translate(names[loc][index], dest='id')
        names[loc][index] = names[loc][index]+"|"+translation.text
    loc+=1

print("finished2")

df = pd.DataFrame({'Name':names}) 
# df.to_csv('stored.csv', mode='a',index=False, encoding='utf-8')
df.to_csv('python/stored.csv', index=False, encoding='utf-8')







# host = "ec2-54-91-178-234.compute-1.amazonaws.com"
# dbname = "d1gmm2almcrrc6"
# user = "opclyjwzetlnbm"
# password = "6895f4f3cf73b0ecb356986c5415af350a1191b9698212e30699193f7ced4e09"
# sslmode = "require"
# conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
# conn = psycopg2.connect(conn_string) 
# print("Connection established")

# cursor = conn.cursor()

# cursor.execute("DROP TABLE IF EXISTS diseases;")
# print("Finished dropping table (if existed)")

# cursor.execute("CREATE TABLE diseases (name VARCHAR(50) PRIMARY KEY, symptoms text[]);")
# print("Finished creating table")
# arr = ["hi","bye"]
# cursor.execute("INSERT INTO diseases VALUES (%s,%s)", ("coughing",arr)) 
# cursor.execute("INSERT INTO diseases VALUES (%s,%s)", ("sneezing",arr)) 



# print("Inserted 3 rows of data")
# cursor.execute("SELECT * FROM diseases;")
# rows = cursor.fetchall()

# # Print all rows
# for row in rows:
#     print(str(row[0])+" "+str(row[1]))


# conn.commit()
# cursor.close()
# conn.close()