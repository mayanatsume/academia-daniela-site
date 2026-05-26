/**
 * Lógica de frontend para o Sistema de Comentários e Testemunhos
 */

// ATENÇÃO: Substitua a URL abaixo pela URL gerada no seu novo Google Apps Script (Web App)
const COMMENTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyAVrf0xvSMWzah7aylTfjHzMjRJfLtPgdvXzPd3Ey6ccj-tA6LbO1hB7B39WWlPddVLg/exec';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carregar comentários para a secção de testemunhos da página principal (se existir)
    const testimonialsContainer = document.getElementById('dynamic-testimonials-container');
    const fakeTestimonials = document.getElementById('fake-testimonials');

    // 2. Carregar comentários para a página de curso (se existir)
    const courseCommentsList = document.getElementById('course-comments-list');
    const courseNameInput = document.getElementById('course_name');

    // 3. Formulário de submissão na página de curso (se existir)
    const commentForm = document.getElementById('leave-comment-form');

    // Estado local para evitar fetch repetido se não for necessário
    let loadedComments = [];

    /**
     * Função para buscar os comentários do servidor
     */
    async function fetchComments() {
        if (!COMMENTS_ENDPOINT || COMMENTS_ENDPOINT === 'SUA_URL_DO_WEB_APP_AQUI') {
            console.warn('O COMMENTS_ENDPOINT não foi configurado.');
            return [];
        }

        try {
            const response = await fetch(COMMENTS_ENDPOINT);
            if (!response.ok) throw new Error('Erro ao comunicar com o servidor.');

            const result = await response.json();
            if (result.status === 'success') {
                return result.data;
            } else {
                console.error('Erro na resposta:', result.message);
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            return [];
        }
    }

    /**
     * Função para renderizar testemunhos na página principal
     */
    function renderMainTestimonials(comments) {
        if (!testimonialsContainer) return;

        // Se não houver comentários reais, mostramos os fake
        if (comments.length === 0) {
            if (fakeTestimonials) fakeTestimonials.style.display = 'block';
            return;
        }

        // Temos comentários reais, então ocultamos os fake
        if (fakeTestimonials) fakeTestimonials.style.display = 'none';

        testimonialsContainer.innerHTML = ''; // Limpar container

        // Criar estrutura para o slider
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'testimonial-slider';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';

        comments.forEach((comment, index) => {
            // Criar o slide (usando textContent para evitar injeção HTML)
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            if (index === 0) slide.classList.add('active');

            const quoteIcon = document.createElement('div');
            quoteIcon.className = 'quote-icon';
            quoteIcon.textContent = '“';

            const text = document.createElement('p');
            text.className = 'testimonial-text';
            text.textContent = comment.comentario;

            const name = document.createElement('h4');
            name.className = 'testimonial-name';
            name.textContent = comment.nome;

            // Adicionar menção ao curso se existir
            if (comment.curso && comment.curso !== 'Geral') {
                const courseInfo = document.createElement('span');
                courseInfo.className = 'testimonial-course';
                courseInfo.textContent = `— ${comment.curso}`;
                name.appendChild(courseInfo);
            }

            slide.appendChild(quoteIcon);
            slide.appendChild(text);
            slide.appendChild(name);
            sliderWrapper.appendChild(slide);

            // Criar o ponto de navegação (dot)
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');

            // Lógica simples de rotação
            dot.addEventListener('click', () => {
                document.querySelectorAll('#dynamic-testimonials-container .testimonial-slide').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('#dynamic-testimonials-container .dot').forEach(d => d.classList.remove('active'));
                slide.classList.add('active');
                dot.classList.add('active');
            });

            dotsContainer.appendChild(dot);
        });

        sliderWrapper.appendChild(dotsContainer);
        testimonialsContainer.appendChild(sliderWrapper);

        // Auto-rotação se houver mais que um
        if (comments.length > 1) {
            startTestimonialRotation(sliderWrapper);
        }
    }

    function startTestimonialRotation(sliderWrapper) {
        let currentIndex = 0;
        const slides = sliderWrapper.querySelectorAll('.testimonial-slide');
        const dots = sliderWrapper.querySelectorAll('.dot');

        if (slides.length <= 1) return;

        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');

            currentIndex = (currentIndex + 1) % slides.length;

            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }, 6000);
    }

    /**
     * Função para renderizar comentários na página do curso
     */
    function renderCourseComments(comments) {
        if (!courseCommentsList || !courseNameInput) return;

        const currentCourse = courseNameInput.value;
        // Filtrar comentários para este curso (ou mostrar todos se preferir, aqui filtramos)
        const courseComments = comments.filter(c => c.curso === currentCourse);

        courseCommentsList.innerHTML = '';

        if (courseComments.length === 0) {
            const noCommentsMsg = document.createElement('p');
            noCommentsMsg.className = 'no-comments-msg';
            noCommentsMsg.textContent = 'Ainda não existem comentários para este curso. Seja o primeiro a partilhar a sua experiência!';
            courseCommentsList.appendChild(noCommentsMsg);
            return;
        }

        courseComments.forEach(comment => {
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';

            const header = document.createElement('div');
            header.className = 'comment-header';

            const name = document.createElement('h4');
            name.textContent = comment.nome;

            const dateSpan = document.createElement('span');
            dateSpan.className = 'comment-date';
            dateSpan.textContent = comment.created_at.split(' ')[0]; // Apenas a data

            header.appendChild(name);
            header.appendChild(dateSpan);

            const text = document.createElement('p');
            text.className = 'comment-body';
            text.textContent = comment.comentario;

            commentBox.appendChild(header);
            commentBox.appendChild(text);
            courseCommentsList.appendChild(commentBox);
        });
    }

    /**
     * Função para lidar com a submissão de um novo comentário
     */
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!COMMENTS_ENDPOINT || COMMENTS_ENDPOINT === 'SUA_URL_DO_WEB_APP_AQUI') {
                alert('A funcionalidade de comentários ainda está a ser configurada (Endpoint ausente).');
                return;
            }

            const nameInput = document.getElementById('comment_name');
            const textInput = document.getElementById('comment_text');
            const submitBtn = commentForm.querySelector('button[type="submit"]');
            const msgBox = document.getElementById('comment-status-msg');
            const courseDropdown = document.getElementById('comment_course');
            const courseValue = courseDropdown ? courseDropdown.value : (courseNameInput ? courseNameInput.value : 'Geral');

            // Validar comprimento
            if (textInput.value.length > 500) {
                alert('O comentário não pode exceder 500 caracteres.');
                return;
            }

            // UI feedback
            submitBtn.disabled = true;
            submitBtn.textContent = 'A ENVIAR...';
            msgBox.textContent = '';
            msgBox.className = '';

            try {
                const payload = {
                    nome: nameInput.value.trim(),
                    curso: courseValue,
                    comentario: textInput.value.trim()
                };

                const response = await fetch(COMMENTS_ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Falha na rede.');

                const result = await response.json();

                if (result.status === 'success') {
                    // Sucesso
                    msgBox.textContent = 'Comentário enviado com sucesso! Obrigado pela sua opinião.';
                    msgBox.className = 'msg-success';
                    commentForm.reset();

                    // Recarregar os comentários
                    initComments();
                } else {
                    throw new Error(result.message || 'Erro desconhecido.');
                }
            } catch (error) {
                console.error(error);
                msgBox.textContent = 'Ocorreu um erro ao enviar o comentário. Tente novamente mais tarde.';
                msgBox.className = 'msg-error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ENVIAR COMENTÁRIO';

                // Esconder mensagem após alguns segundos
                setTimeout(() => {
                    msgBox.textContent = '';
                    msgBox.className = '';
                }, 8000);
            }
        });

        // Adicionar contador de caracteres
        const textInput = document.getElementById('comment_text');
        const charCount = document.getElementById('comment-char-count');
        if (textInput && charCount) {
            textInput.addEventListener('input', () => {
                const len = textInput.value.length;
                charCount.textContent = `${len}/500`;
                if (len >= 500) {
                    charCount.style.color = 'red';
                } else {
                    charCount.style.color = 'inherit';
                }
            });
        }
    }

    /**
     * Inicializar o sistema
     */
    async function initComments() {
        // Mostrar um loading nas listas enquanto busca
        if (testimonialsContainer && fakeTestimonials && fakeTestimonials.style.display !== 'none') {
            // Se já está a mostrar os fakes, não mexe para não causar flicker (salto visual).
            // Apenas carregamos em background.
        }

        if (courseCommentsList) {
            courseCommentsList.innerHTML = '<p class="loading-comments">A carregar comentários...</p>';
        }

        loadedComments = await fetchComments();

        renderMainTestimonials(loadedComments);
        renderCourseComments(loadedComments);
    }

    // Arrancar
    initComments();
});
