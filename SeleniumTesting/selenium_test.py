from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# Path to geckodriver executable
GECKODRIVER_PATH = "C:/Users/admin/Downloads/geckodriver.exe"

# Local HTML file path (adjust if needed)
FILE_PATH = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"

def test_login(driver):
    print("Testing Login form...")
    driver.get(FILE_PATH)
    wait = WebDriverWait(driver, 10)

    email_input = wait.until(EC.presence_of_element_located((By.ID, "loginEmail")))
    email_input.clear()
    email_input.send_keys("test@example.com")

    password_input = driver.find_element(By.ID, "loginPassword")
    password_input.clear()
    password_input.send_keys("password")

    login_button = driver.find_element(By.CSS_SELECTOR, "#loginForm button[type='submit']")
    login_button.click()

    msg = wait.until(EC.visibility_of_element_located((By.ID, "loginMsg")))
    print("Login message:", msg.text)
    assert "successful" in msg.text.lower()

def test_signup(driver):
    print("Testing Signup form...")
    driver.get(FILE_PATH)
    wait = WebDriverWait(driver, 10)

    name_input = wait.until(EC.presence_of_element_located((By.ID, "signupName")))
    name_input.clear()
    name_input.send_keys("Alice")

    email_input = driver.find_element(By.ID, "signupEmail")
    email_input.clear()
    email_input.send_keys("alice@example.com")

    password_input = driver.find_element(By.ID, "signupPassword")
    password_input.clear()
    password_input.send_keys("strongpassword")

    signup_button = driver.find_element(By.CSS_SELECTOR, "#signupForm button[type='submit']")
    signup_button.click()

    msg = wait.until(EC.visibility_of_element_located((By.ID, "signupMsg")))
    print("Signup message:", msg.text)
    assert "thank you" in msg.text.lower()

def main():
    service = Service(GECKODRIVER_PATH)
    driver = webdriver.Firefox(service=service)

    try:
        test_login(driver)
        test_signup(driver)
    finally:
        time.sleep(2)
        driver.quit()

if __name__ == "__main__":
    main()
