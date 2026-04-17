import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

seo_data = {
    'index.html': {
        'title': 'Academia Daniela Silva | Formações e Tratamentos Estéticos em Cantanhede',
        'desc': 'Academia Daniela Silva em Cantanhede com formações e tratamentos estéticos. Descubra cursos de estética, formação HIFU, estética facial, unhas de gel, lifting de pestanas, limpeza de pele e outros serviços.',
        'default_alt': 'Cursos de estética e tratamentos estéticos em Cantanhede'
    },
    'about.html': {
        'title': 'Sobre Nós | Academia de Estética em Cantanhede',
        'desc': 'A sua clínica e academia de estética em Cantanhede. Dedicada a formações certificadas e tratamentos estéticos corporais e faciais.',
        'default_alt': 'Equipa da clínica de estética em Cantanhede'
    },
    'contact.html': {
        'title': 'Contactos | Academia Daniela Silva Cantanhede',
        'desc': 'Entre em contacto com a nossa academia de estética em Cantanhede, Coimbra, Portugal para marcação de tratamentos faciais e corporais ou inscrições nos cursos.',
        'default_alt': 'Contactos da clínica de estética em Cantanhede'
    },
    'course.html': {
        'title': 'Cursos de Estética em Cantanhede | Academia Daniela Silva',
        'desc': 'Descubra os melhores cursos profissionais de estética em Cantanhede. Formação certificada em estética facial e corporal na Academia Daniela Silva em Portugal.',
        'default_alt': 'Cursos de estética profissional em Cantanhede'
    },
    'course-hifu.html': {
        'title': 'Formação HIFU em Cantanhede | Academia Daniela Silva',
        'desc': 'Aprenda os tratamentos faciais e corporais mais avançados na nossa Formação HIFU em Cantanhede. Formação certificada na Academia Daniela Silva com foco prático.',
        'default_alt': 'Formação em HIFU na academia de estética em Cantanhede'
    },
    'course-lifting.html': {
        'title': 'Curso de Lifting de Pestanas em Cantanhede | Academia Daniela Silva',
        'desc': 'Destaque-se na área da beleza. Curso de Lifting de Pestanas em Cantanhede para profissionais de estética facial, na Academia Daniela Silva, Portugal.',
        'default_alt': 'Curso de lifting de pestanas em Cantanhede'
    },
    'course-limppele.html': {
        'title': 'Curso de Limpeza de Pele em Cantanhede | Academia Daniela Silva',
        'desc': 'Domine os cuidados de pele com o Curso de Limpeza de Pele em Cantanhede. Formação prática profissionalizante na Academia Daniela Silva.',
        'default_alt': 'Curso de limpeza de pele em Cantanhede'
    },
    'course-makesocial.html': {
        'title': 'Curso de Maquilhagem Social em Cantanhede | Academia Daniela Silva',
        'desc': 'Desenvolva o seu talento em estética com o Curso de Maquilhagem Social em Cantanhede. Formação intensiva certificada na nossa Academia.',
        'default_alt': 'Curso de maquilhagem social na clínica de estética em Cantanhede'
    },
    'course-plasma.html': {
        'title': 'Curso de Jato de Plasma em Cantanhede | Academia Daniela Silva',
        'desc': 'Formação certificada em estética. Inscreva-se no Curso de Jato de Plasma em Cantanhede e complemente a oferta de tratamentos estéticos e corporais.',
        'default_alt': 'Curso de jato de plasma em Cantanhede'
    },
    'estetica-corporal.html': {
        'title': 'Estética Corporal em Cantanhede | Academia Daniela Silva',
        'desc': 'Realize os melhores tratamentos de estética corporal em Cantanhede. A Academia Daniela Silva cuida do seu bem-estar com tratamentos corporais avançados.',
        'default_alt': 'Tratamentos de estética corporal em Cantanhede'
    },
    'estetica-facial.html': {
        'title': 'Estética Facial em Cantanhede | Academia Daniela Silva',
        'desc': 'Descubra os nossos tratamentos de estética facial em Cantanhede. Na Academia Daniela Silva oferecemos cuidados de pele profissionais e unhas de gel com excelência.',
        'default_alt': 'Tratamentos de estética facial em Cantanhede'
    },
    'workshops.html': {
        'title': 'Workshops de Estética em Cantanhede | Academia Daniela Silva',
        'desc': 'Aceda a formação intensiva e prática. Workshops de estética em Cantanhede para aprimorar técnicas e tratamentos estéticos profissionais.',
        'default_alt': 'Workshops de estética com acompanhamento prático em Cantanhede'
    },
    'cookies.html': {
        'title': 'Política de Cookies | Academia Daniela Silva Cantanhede',
        'desc': 'Política de Cookies da nossa clínica e academia de tratamentos estéticos em Cantanhede.',
        'default_alt': 'Academia de estética Cantanhede'
    },
    'privacy.html': {
        'title': 'Política de Privacidade | Academia Daniela Silva Cantanhede',
        'desc': 'Política de Privacidade relativas à proteção de dados na Academia Daniela Silva focada na formação certificada estética em Portugal.',
        'default_alt': 'Dados da clínica de formação'
    },
    'terms.html': {
        'title': 'Termos e Condições | Academia Daniela Silva Cantanhede',
        'desc': 'Termos da nossa clínica de tratamentos estéticos e academia de formação em Cantanhede garantidos para os nossos clientes e alunos.',
        'default_alt': 'Termos Academia Daniela Silva'
    }
}

for file in html_files:
    if file not in seo_data:
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    data = seo_data[file]
    title = data['title']
    desc = data['desc']
    def_alt = data['default_alt']
    
    # 1. NEW SEO DOMAIN and CANONICAL
    # Remove old canonical and open graph tags
    content = re.sub(r'<link rel="canonical".*?>\n?', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<!-- Open Graph / Meta -->.*?(?=<!-- Twitter -->)', '', content, flags=re.IGNORECASE|re.DOTALL)
    content = re.sub(r'<!-- Twitter -->.*?</head>', '</head>', content, flags=re.IGNORECASE|re.DOTALL)
    content = re.sub(r'<meta name="description".*?>\n?', '', content, flags=re.IGNORECASE)

    url = f"https://academiadanielasilva.pt/{file}"
    if file == 'index.html':
        url = "https://academiadanielasilva.pt/"

    seo_block = f"""
    <!-- SEO Meta Tags -->
    <meta name="description" content="{desc}">
    <link rel="canonical" href="{url}">

    <!-- Open Graph / Meta -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://academiadanielasilva.pt/assets/img/hero.png">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="https://academiadanielasilva.pt/assets/img/hero.png">
</head>"""

    # Inject SEO block back
    content = re.sub(r'</head>', seo_block, content, flags=re.IGNORECASE)

    # 2. UPDATE TITLE
    content = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', content, flags=re.IGNORECASE | re.DOTALL)

    # 3. FIX ALL DOMAINS IN HTML FROM academia-daniela-silva.pt to academiadanielasilva.pt
    content = content.replace("academia-daniela-silva.pt/", "academiadanielasilva.pt/")

    # 4. NIF INJECTION
    nif_html = r'''
                                <label for="nif" style="display: block; text-align: left; font-size: 13px; color: var(--text-light); margin-bottom: 5px; margin-top: 10px;">NIF (para faturação)</label>
                                <input type="text" id="nif" name="nif" placeholder="NIF" pattern="\\d{9}" title="O NIF deve conter exatamente 9 números" required style="margin-bottom: 10px;">'''
    
    # We look for the email input line and insert the NIF block under it, ONLY if it doesn't already have NIF
    if 'id="nif"' not in content:
        # Regex to locate the email input inside a form.
        content = re.sub(r'(<input type="email" name="email" placeholder="E-mail(?:.*?)required>)', r'\1' + nif_html, content, flags=re.IGNORECASE)


    # 5. ALT ATTRIBUTE TUNING (Ensuring they use Cantanhede natural properties)
    def img_replacer(match):
        img_tag = match.group(0)
        # Skip decorative or icon replacement if we want to be overly safe, but user said revisit.
        # We replace the alt value we created last time, or if missing.
        # It's easy: if it has alt=, replace its contents IF it's empty or generically 'clínica de estética'
        # Or just append the new default alt if it matches our old generated keywords loosely
        
        # We will dynamically replace old generated alts or inject if none
        if 'alt=' not in img_tag:
            return img_tag.replace('<img', f'<img alt="{def_alt}"', 1)
        
        if 'alt=""' in img_tag:
            return img_tag.replace('alt=""', f'alt="{def_alt}"')
        if "alt=''" in img_tag:
            return img_tag.replace("alt=''", f'alt="{def_alt}"')
        
        if 'clínica de estética' in img_tag.lower() or 'curso de' in img_tag.lower() or 'tratamentos de' in img_tag.lower() or 'workshops' in img_tag.lower():
             # Override the previous script's mass generation with this current tailored one
             img_tag = re.sub(r'alt=["\'].*?["\']', f'alt="{def_alt}"', img_tag)

        return img_tag

    content = re.sub(r'<img\s+.*?>', img_replacer, content, flags=re.IGNORECASE)


    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("NIF and custom Local SEO execution completed!")
