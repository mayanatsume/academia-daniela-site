import os
import glob

target_dir = r"c:\Users\simone silva\.gemini\antigravity\scratch\beauty-website"
html_files = glob.glob(os.path.join(target_dir, "*.html"))

desktop_search = '<a href="course-hifu.html" class="dropdown-link">HIFU</a>'
desktop_replace = '<a href="course-hifu.html" class="dropdown-link">HIFU</a>\n                            <a href="course-brows-nanoblanding.html" class="dropdown-link">Nano Blading</a>'

mobile_search = '<li><a href="course-hifu.html">HIFU</a></li>'
mobile_replace = '<li><a href="course-hifu.html">HIFU</a></li>\n                    <li><a href="course-brows-nanoblanding.html">Nano Blading</a></li>'

modified_count = 0

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content
    content = content.replace(desktop_search, desktop_replace)
    content = content.replace(mobile_search, mobile_replace)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        modified_count += 1
        print(f"Modified: {os.path.basename(file_path)}")

print(f"\nTotal files modified: {modified_count}")
