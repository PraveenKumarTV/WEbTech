from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
import time
import os

GECKODRIVER_PATH = "C:/Users/admin/Downloads/geckodriver.exe"  # Adjust as per your setup
FILE_PATH = f"file:///{os.path.abspath('search_projects.html').replace(os.sep, '/')}"

def get_project_cards(driver):
    return driver.find_elements(By.CSS_SELECTOR, "#projectsList .card")

def get_projects_text(driver):
    return [card.text for card in get_project_cards(driver)]

def clear_filters(driver):
    # Clear search input and set filter to "All"
    search_box = driver.find_element(By.ID, "searchInput")
    search_box.clear()

    tech_filter = driver.find_element(By.ID, "techFilter")
    tech_filter.click()
    tech_filter.find_element(By.CSS_SELECTOR, "option[value='']").click()

def test_filter_by_tech(driver, tech):
    print(f"Testing filter by tech: '{tech or 'All'}'")
    clear_filters(driver)

    tech_filter = driver.find_element(By.ID, "techFilter")
    tech_filter.click()
    if tech != "":
        tech_filter.find_element(By.CSS_SELECTOR, f"option[value='{tech}']").click()
    time.sleep(1)

    projects_text = get_projects_text(driver)
    if tech == "":
        assert len(projects_text) > 0, "All projects should be displayed when no filter is applied"
    else:
        for text in projects_text:
            assert tech.lower() in text.lower(), f"Project does not match tech filter '{tech}': {text}"

def test_search_by_name(driver, name):
    print(f"Testing search by name: '{name}'")
    clear_filters(driver)

    search_box = driver.find_element(By.ID, "searchInput")
    search_box.send_keys(name)
    time.sleep(1)

    projects_text = get_projects_text(driver)
    assert any(name.lower() in text.lower() for text in projects_text), f"No projects found matching search '{name}'"

def test_search_and_filter(driver, search_text, tech):
    print(f"Testing search '{search_text}' + filter '{tech}'")
    clear_filters(driver)

    search_box = driver.find_element(By.ID, "searchInput")
    search_box.send_keys(search_text)

    tech_filter = driver.find_element(By.ID, "techFilter")
    tech_filter.click()
    tech_filter.find_element(By.CSS_SELECTOR, f"option[value='{tech}']").click()
    time.sleep(1)

    projects_text = get_projects_text(driver)

    # Basic validation: all projects shown must contain both search_text and tech
    for text in projects_text:
        assert search_text.lower() in text.lower(), f"Project does not match search '{search_text}': {text}"
        assert tech.lower() in text.lower(), f"Project does not match tech filter '{tech}': {text}"

def main():
    service = Service(GECKODRIVER_PATH)
    driver = webdriver.Firefox(service=service)

    try:
        driver.get(FILE_PATH)
        time.sleep(2)  # Let the page load fully

        # Wait for projectsList container to appear
        driver.find_element(By.ID, "projectsList")

        # All tech stack options including empty for "All"
        tech_options = ["", "React", "Node.js", "Python", "Java", "Bootstrap"]

        # Test filter by each tech stack
        for tech in tech_options:
            test_filter_by_tech(driver, tech)

        # Test search by each project name from the data (approximate)
        project_names = ["Job Portal", "Resume Builder", "Interview Prep App", "Portfolio Website"]
        for name in project_names:
            test_search_by_name(driver, name)

        # Test some combined search + filter cases
        test_search_and_filter(driver, "portfolio", "React")
        test_search_and_filter(driver, "resume", "Bootstrap")

        print("\nAll tests passed successfully!")

    finally:
        time.sleep(3)
        driver.quit()

if __name__ == "__main__":
    main()
