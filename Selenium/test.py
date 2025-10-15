from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
import time
import os
gpath="/home/praveen/Desktop/5th Sem/WebTech/Cup/geckodriver-v0.36.0-linux64/geckodriver"
service=Service(gpath)
driver=webdriver.Firefox(service=service)
filePath="/home/praveen/Desktop/WTModelLab/WT/Selenium/index.html"
fileUrl="file://"+os.path.abspath(filePath)
try:
    driver.get(fileUrl)
    driver.find_element(By.ID,"email").send_keys("test@gmail.com")
    driver.find_element(By.ID,"name1").send_keys("Praveen");
    driver.find_element(By.ID,"name2").send_keys("Kumar")
    driver.find_element(By.ID,"password").send_keys("12345");
    driver.find_element(By.XPATH,"//button[@type='submit']").click()
    time.sleep(2)
    print("Test completed successfully")
finally:
    driver.quit();