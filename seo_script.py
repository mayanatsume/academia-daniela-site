import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

seo_data = {
    'index.html': {
        'title': 'Academia Daniela Silva | Cursos de Estética e Tratamentos Estéticos',
        'desc': 'Descubra a Academia Daniela Silva: uma clínica e academia de estética em Portugal oferecendo tratamentos faciais e corporais exclusivos, além de formação certificada em estética.',
        'default_alt': 'clínica de estética e tratamentos faciais'
    },
    'about.html': {
        'title': 'Sobre Nós | Centro de Estética e Formação em Portugal',
        'desc': 'Conheça a nossa história, a missão do nosso centro de estética e da academia de formação profissional em estética, liderados por Daniela Silva.',
        'default_alt': 'equipa da clínica de estética'
    },
    'contact.html': {
        'title': 'Contactos | Academia e Clínica de Estética',
        'desc': 'Entre em contacto com a Academia Daniela Silva para saber mais sobre os nossos tratamentos estéticos e cursos de estética presencial em Portugal.',
        'default_alt': 'contactos da clínica de estética'
    },
    'course.html': {
        'title': 'Cursos de Estética | Formação Profissional de Estética',
        'desc': 'Descubra os nossos cursos profissionais de estética. Na nossa academia de estética oferecemos formação certificada para impulsionar a sua carreira.',
        'default_alt': 'cursos de estética em Portugal'
    },
    'course-hifu.html': {
        'title': 'Curso de HIFU | Formação Certificada em Estética',
        'desc': 'Especializa-te com o nosso curso de HIFU. Formação certificada na Academia Daniela Silva, para dominar um dos tratamentos estéticos mais avançados.',
        'default_alt': 'curso de HIFU'
    },
    'course-lifting.html': {
        'title': 'Curso de Lifting de Pestanas | Academia de Estética',
        'desc': 'Aprende as melhores técnicas com o nosso curso de lifting de pestanas na Academia Daniela Silva. Formação de excelência em estética facial.',
        'default_alt': 'curso de lifting de pestanas'
    },
    'course-limppele.html': {
        'title': 'Curso de Limpeza de Pele | Formação em Estética',
        'desc': 'Inicia a tua carreira com o curso de limpeza de pele da Academia Daniela Silva. Uma formação profissional essencial para cuidados de pele e tratamentos de rosto.',
        'default_alt': 'curso de limpeza de pele'
    },
    'course-makesocial.html': {
        'title': 'Curso de Maquilhagem Social | Formação Profissional',
        'desc': 'Destaca-te como profissional com o nosso curso de maquilhagem social. Formação presencial focada em estética e beleza facial.',
        'default_alt': 'curso de maquilhagem social'
    },
    'course-plasma.html': {
        'title': 'Curso de Jato de Plasma | Academia de Estética',
        'desc': 'Melhora o teu portfólio de serviços de estética com o curso de Jato de Plasma. Formação certificada para realizar tratamentos avançados de rosto.',
        'default_alt': 'curso de jato de plasma'
    },
    'estetica-corporal.html': {
        'title': 'Estética Corporal | Tratamentos de Corpo em Portugal',
        'desc': 'Oferecemos tratamentos estéticos corporais personalizados para cuidar de si. Descubra os serviços da nossa clínica de estética e alcance o corpo que deseja.',
        'default_alt': 'estética corporal e tratamentos de corpo'
    },
    'estetica-facial.html': {
        'title': 'Estética Facial | Tratamentos de Rosto e Cuidados de Pele',
        'desc': 'Renove a sua beleza com os nossos tratamentos faciais. A clínica de estética Academia Daniela Silva oferece os melhores cuidados de pele.',
        'default_alt': 'estética facial e tratamentos de rosto'
    },
    'workshops.html': {
        'title': 'Workshops | Academia de Formação Estética',
        'desc': 'Participa nos nossos workshops de estética e desenvolve as tuas competências de forma prática com profissionais experientes na área.',
        'default_alt': 'workshops de estética'
    },
    'cookies.html': {
        'title': 'Política de Cookies | Academia Daniela Silva',
        'desc': 'Consulte a nossa política de cookies e saiba como a Academia Daniela Silva gere a sua privacidade e dados de navegação no nosso site.',
        'default_alt': 'academia de estética'
    },
    'privacy.html': {
        'title': 'Política de Privacidade | Academia Daniela Silva',
        'desc': 'Leia a política de privacidade da Academia Daniela Silva. Protegemos os seus dados enquanto navega na nossa clínica de estética online.',
        'default_alt': 'clínica de estética'
    },
    'terms.html': {
        'title': 'Termos e Condições | Academia Daniela Silva',
        'desc': 'Consulte os termos e condições da nossa academia e clínica de estética em Portugal. Conheça as regras para serviços e formações certificadas.',
        'default_alt': 'serviços de estética'
    }
}

favicon_block = """
    <!-- Favicon e Ícones -->
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
"""

ga_block = """
    <!-- Google Analytics (Insira o seu ID abaixo onde diz 'G-XXXXXXXXXX') -->
    <!--
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
    -->
"""

for file in html_files:
    if file not in seo_data:
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    data = seo_data[file]
    title = data['title']
    desc = data['desc']
    def_alt = data['default_alt']
    
    url = f"https://academia-daniela-silva.pt/{file}"
    if file == 'index.html':
        url = "https://academia-daniela-silva.pt/"
    
    og_block = f"""
    <!-- SEO Meta Tags -->
    <meta name="description" content="{desc}">
    <link rel="canonical" href="{url}">

    <!-- Open Graph / Meta -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://academia-daniela-silva.pt/assets/img/hero.png">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="https://academia-daniela-silva.pt/assets/img/hero.png">
"""

    head_additions = favicon_block + ga_block + og_block

    # Update <title>
    title_pattern = re.compile(r'<title>.*?</title>', re.IGNORECASE | re.DOTALL)
    if title_pattern.search(content):
        content = title_pattern.sub(f'<title>{title}</title>', content)
    else:
        head_additions = f"\n    <title>{title}</title>" + head_additions

    # Remove existing description
    content = re.sub(r'<meta\s+name=["\']description["\'].*?>', '', content, flags=re.IGNORECASE)

    # Inject into head
    content = re.sub(r'</head>', head_additions + '\n</head>', content, flags=re.IGNORECASE)

    # Defer scripts
    content = re.sub(r'<script\s+src=(["\'])assets/(app|cookies)\.js\1(?!.*defer)>', r'<script src=\1assets/\2.js\1 defer>', content)
    
    # Process images to ensure they have alt tags
    def img_replacer(match):
        img_tag = match.group(0)
        
        # Add alt if missing completely
        if 'alt=' not in img_tag:
            return img_tag.replace('<img', f'<img alt="{def_alt}"', 1)
        
        # Replace empty alt
        if 'alt=""' in img_tag:
            return img_tag.replace('alt=""', f'alt="{def_alt}"')
        
        if "alt=''" in img_tag:
            return img_tag.replace("alt=''", f'alt="{def_alt}"')
            
        return img_tag

    content = re.sub(r'<img\s+.*?>', img_replacer, content, flags=re.IGNORECASE)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("SEO update applied successfully.")
