from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import requests
import time
import psycopg2
from googletrans import Translator
import time

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

names = names[300:315]

loc = 0
while loc!=len(names):
    page = "https://www.google.com/search?q=symptoms+of+"+names[loc][0].replace(" ","+")
    driver.get(page)
    time.sleep(.5)
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
        results = soup.findAll('div', attrs={'class':'m6vS6b PZPZlf'})
        if results is not None:
            for result in results:
                results2 = result.find('span', attrs={'class':'zA2Nl'})
                if results2 is not None:
                    if str(results2.text.strip()) == "Also common:" and result.text is not None:
                        text = result.text.strip()[12:].strip()
                        textArr = text.split(',')
                        for t in textArr:
                            names[loc].append(t.strip())
    if len(names[loc]) == 1:                   
        names.pop(loc);
        loc-=1
    else:
        for index in range(len(names[loc])):
            translation = translator.translate(names[loc][index], dest='id')
            names[loc][index] = names[loc][index]+"|"+translation.text
    loc+=1

namesCol = [];
symptomsCol = []
for row in names:
    namesCol.append(row[0])
    symptomsCol.append(row[1:])

df = pd.DataFrame({'Name':namesCol,'Symptoms':symptomsCol}) 
df.to_csv('python/stored.csv', mode='a',index=False,header=False, encoding='utf-8')
# df.to_csv('python/stored.csv', index=False, encoding='utf-8')