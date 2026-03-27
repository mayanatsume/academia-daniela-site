const fs = require('fs');
const files = [
    'about.html', 'contact.html', 'cookies.html', 'course.html',
    'course-estetica.html', 'course-hifu.html', 'course-laser.html',
    'course-nutricao.html', 'estetica-corporal.html', 'estetica-facial.html',
    'index.html', 'privacy.html', 'terms.html'
];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<div class="nav-item"><a href="nutrition\.html" class="nav-link">Nutrição<\/a><\/div>/g, '<div class="nav-item"><a href="workshops.html" class="nav-link">Workshops</a></div>');
    content = content.replace(/<li><a href="nutrition\.html" class="mobile-nav-link">Nutrição<\/a><\/li>/g, '<li><a href="workshops.html" class="mobile-nav-link">Workshops</a></li>');
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
});
console.log('Done.');
