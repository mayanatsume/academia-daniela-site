import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    content = content.replace('href="/favicon.ico"', 'href="assets/img/favicon/favicon.ico"')
    content = content.replace('href="/favicon-32x32.png"', 'href="assets/img/favicon/favicon-32x32.png"')
    content = content.replace('href="/favicon-16x16.png"', 'href="assets/img/favicon/favicon-16x16.png"')
    content = content.replace('href="/apple-touch-icon.png"', 'href="assets/img/favicon/apple-touch-icon.png"')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Favicon path updated in {file}')
