const fs = require('fs');
const path = require('path');

const directoryPath = './';
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Regex for Desktop Nav
    // Matches the <a> tag with href="nutrition.html" and any variations of "Nutrição" or "Workshops" label
    const desktopRegex = /<div class="nav-item"><a href="nutrition\.html" class="nav-link">[^<]+<\/a><\/div>/g;
    if (desktopRegex.test(content)) {
        content = content.replace(desktopRegex, '<div class="nav-item"><a href="workshops.html" class="nav-link">Workshops</a></div>');
        changed = true;
    }

    // Regex for Mobile Nav
    const mobileRegex = /<li><a href="nutrition\.html" class="mobile-nav-link">[^<]+<\/a><\/li>/g;
    if (mobileRegex.test(content)) {
        content = content.replace(mobileRegex, '<li><a href="workshops.html" class="mobile-nav-link">Workshops</a></li>');
        changed = true;
    }

    // Catch-all for any other nutrition.html links that should be workshops.html in the main nav context
    // But be careful not to touch course-nutricao.html
    // The user specifically said "main navigation item currently pointing to nutrition.html"

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated navigation in: ${file}`);
    }
});

console.log('Search and replace complete.');
