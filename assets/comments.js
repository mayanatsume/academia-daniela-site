/**
 * Lógica de frontend para o Sistema de Comentários e Testemunhos
 * Academia Daniela Silva
 */

const COMMENTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyAVrf0xvSMWzah7aylTfjHzMjRJfLtPgdvXzPd3Ey6ccj-tA6LbO1hB7B39WWlPddVLg/exec';

document.addEventListener('DOMContentLoaded', () => {
    const testimonialsContainer = document.getElementById('dynamic-testimonials-container');
    const fakeTestimonials = document.getElementById('fake-testimonials');

    const courseCommentsList = document.getElementById('course-comments-list');
    const courseNameInput = document.getElementById('course_name');

    const commentForm = document.getElementById('leave-comment-form');

    let loadedComments = [];

    async function fetchComments() {
        if (!COMMENTS_ENDPOINT || COMMENTS_ENDPOINT === 'SUA_URL_DO_WEB_APP_AQUI') {
            console.warn('O COMMENTS_ENDPOINT não foi configurado.');
            return [];
        }

        try {
            const response = await fetch(COMMENTS_ENDPOINT);

            if (!response.ok) {
                throw new Error('Erro ao comunicar com o servidor.');
            }

            const result = await response.json();

            if (result.status === 'success') {
                return Array.isArray(result.data) ? result.data : [];
            }

            console.error('Erro na resposta:', result.message);
            return [];

        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            return [];
        }
    }

    function renderMainTestimonials(comments) {
        if (!testimonialsContainer) return;

        if (!comments || comments.length === 0) {
            if (fakeTestimonials) fakeTestimonials.style.display = 'block';
            testimonialsContainer.innerHTML = '';
            return;
        }

        if (fakeTestimonials) fakeTestimonials.style.display = 'none';

        testimonialsContainer.innerHTML = '';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'testimonial-slider';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';

        comments.forEach((comment, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';

            if (index === 0) {
                slide.classList.add('active');
            }

            const quoteIcon = document.createElement('div');
            quoteIcon.className = 'quote-icon';
            quoteIcon.textContent = '“';

            const text = document.createElement('p');
            text.className = 'testimonial-text';
            text.textContent = comment.comentario || '';

            const name = document.createElement('h4');
            name.className = 'testimonial-name';
            name.textContent = comment.nome || 'Cliente';

            if (comment.curso && comment.curso !== 'Geral') {
                const courseInfo = document.createElement('span');
                courseInfo.className = 'testimonial-course';
                courseInfo.textContent = ` — ${comment.curso}`;
                name.appendChild(courseInfo);
            }

            slide.appendChild(quoteIcon);
            slide.appendChild(text);
            slide.appendChild(name);
            sliderWrapper.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = 'dot';

            if (index === 0) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => {
                sliderWrapper.querySelectorAll('.testimonial-slide').forEach(s => {
                    s.classList.remove('active');
                });

                sliderWrapper.querySelectorAll('.dot').forEach(d => {
                    d.classList.remove('active');
                });

                slide.classList.add('active');
                dot.classList.add('active');
            });

            dotsContainer.appendChild(dot);
        });

        sliderWrapper.appendChild(dotsContainer);
        testimonialsContainer.appendChild(sliderWrapper);

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

    function renderCourseComments(comments) {
        if (!courseCommentsList || !courseNameInput) return;

        const currentCourse = courseNameInput.value;
        const courseComments = comments.filter(comment => comment.curso === currentCourse);

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
            name.textContent = comment.nome || 'Cliente';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'comment-date';

            if (comment.created_at) {
                dateSpan.textContent = String(comment.created_at).split(' ')[0];
            } else {
                dateSpan.textContent = '';
            }

            header.appendChild(name);
            header.appendChild(dateSpan);

            const text = document.createElement('p');
            text.className = 'comment-body';
            text.textContent = comment.comentario || '';

            commentBox.appendChild(header);
            commentBox.appendChild(text);

            courseCommentsList.appendChild(commentBox);
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!COMMENTS_ENDPOINT || COMMENTS_ENDPOINT === 'SUA_URL_DO_WEB_APP_AQUI') {
                alert('A funcionalidade de comentários ainda está a ser configurada.');
                return;
            }

            const nameInput = document.getElementById('comment_name');
            const textInput = document.getElementById('comment_text');
            const submitBtn = commentForm.querySelector('button[type="submit"]');
            const msgBox = document.getElementById('comment-status-msg');
            const courseDropdown = document.getElementById('comment_course');

            const courseValue = courseDropdown
                ? courseDropdown.value
                : (courseNameInput ? courseNameInput.value : 'Geral');

            const nome = nameInput ? nameInput.value.trim() : '';
            const comentario = textInput ? textInput.value.trim() : '';

            if (!nome || !comentario) {
                alert('Por favor, preencha o nome e o comentário.');
                return;
            }

            if (comentario.length > 500) {
                alert('O comentário não pode exceder 500 caracteres.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'A ENVIAR...';

            if (msgBox) {
                msgBox.textContent = '';
                msgBox.className = '';
            }

            try {
                const payload = {
                    nome: nome,
                    curso: courseValue,
                    comentario: comentario
                };

                const response = await fetch(COMMENTS_ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Falha na rede.');
                }

                const result = await response.json();

                if (result.status === 'success') {
                    if (msgBox) {
                        msgBox.textContent = 'Comentário enviado com sucesso! Obrigado pela sua opinião.';
                        msgBox.className = 'msg-success';
                    }

                    commentForm.reset();

                    const charCount = document.getElementById('comment-char-count');
                    if (charCount) {
                        charCount.textContent = '0/500';
                    }

                    await initComments();

                } else {
                    throw new Error(result.message || 'Erro desconhecido.');
                }

            } catch (error) {
                console.error(error);

                if (msgBox) {
                    msgBox.textContent = 'Ocorreu um erro ao enviar o comentário. Tente novamente mais tarde.';
                    msgBox.className = 'msg-error';
                }

            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ENVIAR COMENTÁRIO';

                if (msgBox) {
                    setTimeout(() => {
                        msgBox.textContent = '';
                        msgBox.className = '';
                    }, 8000);
                }
            }
        });

        const textInput = document.getElementById('comment_text');
        const charCount = document.getElementById('comment-char-count');

        if (textInput && charCount) {
            textInput.addEventListener('input', () => {
                const len = textInput.value.length;
                charCount.textContent = `${len}/500`;
                charCount.style.color = len >= 500 ? 'red' : 'inherit';
            });
        }
    }

    async function initComments() {
        if (courseCommentsList) {
            courseCommentsList.innerHTML = '<p class="loading-comments">A carregar comentários...</p>';
        }

        loadedComments = await fetchComments();

        renderMainTestimonials(loadedComments);
        renderCourseComments(loadedComments);
    }

    initComments();
});