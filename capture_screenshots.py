from playwright.sync_api import sync_playwright
import time

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='msedge', headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        
        # Navigate to local web app
        print("Navigating to http://localhost:5173...")
        page.goto('http://localhost:5173')
        page.wait_for_timeout(2000)

        # 1. Login using 1-Click Demo Login
        demo_btn = page.get_by_text('1-Click Demo Login')
        if demo_btn.is_visible():
            print("Clicking 1-Click Demo Login button...")
            demo_btn.click()
            page.wait_for_timeout(2000)

        # Screenshot 1: Dashboard
        page.screenshot(path='shot_dashboard.png')
        print('Captured: shot_dashboard.png')

        # Screenshot 2: Resume Analyzer (Milestone 1)
        page.locator('button.sidebar-item', has_text='Resume Analyzer').click()
        page.wait_for_timeout(1500)
        page.screenshot(path='shot_resume_analyzer.png')
        print('Captured: shot_resume_analyzer.png')

        # Screenshot 3: Career Intelligence (Milestone 2 Model Comparison)
        page.locator('button.sidebar-item', has_text='Career Intelligence').click()
        page.wait_for_timeout(1500)
        page.screenshot(path='shot_career_intelligence.png')
        print('Captured: shot_career_intelligence.png')

        # Screenshot 4: Skill Analysis (Milestone 2 Skill Gap)
        page.locator('button.sidebar-item', has_text='Skill Analysis').click()
        page.wait_for_timeout(1500)
        page.screenshot(path='shot_skill_analysis.png')
        print('Captured: shot_skill_analysis.png')

        # Screenshot 5: Settings (Supabase Database Connection)
        page.locator('button.sidebar-item', has_text='Settings').click()
        page.wait_for_timeout(1500)
        page.screenshot(path='shot_settings.png')
        print('Captured: shot_settings.png')

        browser.close()
        print("All screenshots successfully captured!")

if __name__ == '__main__':
    capture_all()
