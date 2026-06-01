/**
 * Lógica de frontend para o Sistema de Comentários e Testemunhos
 * Academia Daniela Silva
 */

const COMMENTS_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbyAVrf0xvSMWzah7aylTfjHzMjRJfLtPgdvXzPd3Ey6ccj-tA6LbO1hB7B39WWlPddVLg/exec';

const HOME_EXTRA_SLIDES = [
    {
        nome: 'Academia Daniela Silva',
        curso: 'Formação Profissional',
        comentario:
            'Formações práticas, acompanhamento próximo e foco em resultados reais para evoluir com segurança na área da estética.'
    },
    {
        nome: 'Academia Daniela Silva',
        curso: 'Estética Profissional',
        comentario:
            'Aprenda técnicas profissionais com confiança, cuidado e atenção aos detalhes em cada etapa da sua formação.'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const testimonialsContainer =
        document.getElementById('dynamic-testimonials-container');

    const fakeTestimonials =
        document.getElementById('fake-testimonials');

    if (fakeTestimonials) {
        fakeTestimonials.style.display = 'none';
    }

    const courseCommentsList =
        document.getElementById('course-comments-list');

    const courseNameInput =
        document.getElementById('course_name');

    const commentForm =
        document.getElementById('leave-comment-form');

    let loadedComments = [];

    let mainRotationTimer = null;
    let courseRotationTimer = null;

    let mainCurrentIndex = 0;
    let courseCurrentIndex = 0;

    /**
     * Limpa os timers antigos.
     * Evita criar múltiplas rotações depois de enviar comentário
     * ou recarregar a lista.
     */
    function clearRotationTimers() {
        if (mainRotationTimer) {
            clearInterval(mainRotationTimer);
            mainRotationTimer = null;
        }

        if (courseRotationTimer) {
            clearInterval(courseRotationTimer);
            courseRotationTimer = null;
        }
    }

    /**
     * Busca comentários no Apps Script.
     */
    async function fetchComments() {
        if (
            !COMMENTS_ENDPOINT ||
            COMMENTS_ENDPOINT === 'SUA_URL_DO_WEB_APP_AQUI'
        ) {
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

        if (mainRotationTimer) {
            clearInterval(mainRotationTimer);
            mainRotationTimer = null;
        }

        mainCurrentIndex = 0;

        /*
         * Remove linhas vazias ou incompletas recebidas do backend.
         * Impede slides sem nome ou sem texto.
         */
        const validComments = Array.isArray(comments)
            ? comments.filter(comment => {
                return (
                    comment &&
                    String(comment.nome || '').trim() &&
                    String(comment.comentario || '').trim()
                );
            })
            : [];

        /*
         * Comentários reais aparecem primeiro.
         * Slides institucionais completam até 4 itens.
         */
        const homeComments = [
            ...validComments,
            ...HOME_EXTRA_SLIDES
        ].slice(0, 4);

        testimonialsContainer.innerHTML = '';

        if (!homeComments.length) {
            return;
        }

        const sliderWrapper =
            document.createElement('div');

        sliderWrapper.className =
            'testimonial-slider';

        const viewport =
            document.createElement('div');

        viewport.className =
            'testimonial-viewport';

        const track =
            document.createElement('div');

        track.className =
            'testimonial-track';

        const dotsContainer =
            document.createElement('div');

        dotsContainer.className =
            'slider-dots';

        function showSlide(index) {
            mainCurrentIndex = index;

            track.style.transform =
                `translateX(-${index * 100}%)`;

            dotsContainer
                .querySelectorAll('.dot')
                .forEach((dot, dotIndex) => {
                    dot.classList.toggle(
                        'active',
                        dotIndex === index
                    );
                });
        }

        function restartRotation() {
            if (mainRotationTimer) {
                clearInterval(mainRotationTimer);
            }

            if (homeComments.length <= 1) {
                return;
            }

            mainRotationTimer =
                setInterval(() => {
                    const nextIndex =
                        (mainCurrentIndex + 1) %
                        homeComments.length;

                    showSlide(nextIndex);
                }, 7000);
        }

        homeComments.forEach((comment, index) => {
            const slide =
                document.createElement('div');

            slide.className =
                'testimonial-slide';

            const quoteIcon =
                document.createElement('div');

            quoteIcon.className =
                'quote-icon';

            quoteIcon.textContent = '“';

            const text =
                document.createElement('p');

            text.className =
                'testimonial-text';

            text.textContent =
                comment.comentario || '';

            const name =
                document.createElement('h4');

            name.className =
                'testimonial-name';

            name.textContent =
                comment.nome || 'Cliente';

            if (
                comment.curso &&
                comment.curso !== 'Geral'
            ) {
                const courseInfo =
                    document.createElement('span');

                courseInfo.className =
                    'testimonial-course';

                courseInfo.textContent =
                    ` — ${comment.curso}`;

                name.appendChild(courseInfo);
            }

            slide.appendChild(quoteIcon);
            slide.appendChild(text);
            slide.appendChild(name);

            track.appendChild(slide);

            const dot =
                document.createElement('span');

            dot.className = 'dot';

            if (index === 0) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => {
                showSlide(index);
                restartRotation();
            });

            dotsContainer.appendChild(dot);
        });

        viewport.appendChild(track);

        sliderWrapper.appendChild(viewport);
        sliderWrapper.appendChild(dotsContainer);

        testimonialsContainer.appendChild(
            sliderWrapper
        );

        showSlide(0);
        restartRotation();
    }

    /**
     * Mostra um comentário específico na página de curso.
     */
    function showCourseSlide(
        sliderWrapper,
        index
    ) {
        const slides =
            sliderWrapper.querySelectorAll(
                '.course-comment-slide'
            );

        const dots =
            sliderWrapper.querySelectorAll(
                '.course-comments-dots .dot'
            );

        if (!slides.length) return;

        courseCurrentIndex = index;

        slides.forEach((slide, slideIndex) => {
            const isActive =
                slideIndex === index;

            slide.classList.toggle(
                'active',
                isActive
            );

            slide.style.display =
                isActive ? 'block' : 'none';
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle(
                'active',
                dotIndex === index
            );
        });
    }

    /**
     * Inicia ou reinicia a rotação dos comentários
     * nas páginas de cursos.
     */
    function startCourseRotation(sliderWrapper) {
        if (courseRotationTimer) {
            clearInterval(courseRotationTimer);
        }

        const slides =
            sliderWrapper.querySelectorAll(
                '.course-comment-slide'
            );

        if (slides.length <= 1) return;

        courseRotationTimer =
            setInterval(() => {
                const nextIndex =
                    (courseCurrentIndex + 1) %
                    slides.length;

                showCourseSlide(
                    sliderWrapper,
                    nextIndex
                );
            }, 7000);
    }

    /**
     * Renderiza apenas um comentário por vez
     * nas páginas internas de cursos.
     */
    function renderCourseComments(comments) {
        if (
            !courseCommentsList ||
            !courseNameInput
        ) {
            return;
        }

        if (courseRotationTimer) {
            clearInterval(courseRotationTimer);
            courseRotationTimer = null;
        }

        courseCurrentIndex = 0;

        const currentCourse =
            String(courseNameInput.value || '')
                .trim();

        const courseComments =
            comments.filter(comment => {
                return (
                    String(comment.curso || '').trim() ===
                    currentCourse
                );
            });

        courseCommentsList.innerHTML = '';

        if (courseComments.length === 0) {
            const noCommentsMsg =
                document.createElement('p');

            noCommentsMsg.className =
                'no-comments-msg';

            noCommentsMsg.textContent =
                'Ainda não existem comentários para este curso. Seja o primeiro a partilhar a sua experiência!';

            courseCommentsList.appendChild(
                noCommentsMsg
            );

            return;
        }

        const sliderWrapper =
            document.createElement('div');

        sliderWrapper.className =
            'course-comments-slider';

        courseComments.forEach(
            (comment, index) => {
                const slide =
                    document.createElement('div');

                slide.className =
                    'course-comment-slide';

                slide.style.display =
                    index === 0 ? 'block' : 'none';

                if (index === 0) {
                    slide.classList.add('active');
                }

                const commentBox =
                    document.createElement('div');

                commentBox.className =
                    'comment-box';

                const header =
                    document.createElement('div');

                header.className =
                    'comment-header';

                const name =
                    document.createElement('h4');

                name.textContent =
                    comment.nome || 'Cliente';

                header.appendChild(name);

                const text =
                    document.createElement('p');

                text.className =
                    'comment-body';

                text.textContent =
                    comment.comentario || '';

                commentBox.appendChild(header);
                commentBox.appendChild(text);

                slide.appendChild(commentBox);
                sliderWrapper.appendChild(slide);
            }
        );

        if (courseComments.length > 1) {
            const dotsContainer =
                document.createElement('div');

            dotsContainer.className =
                'course-comments-dots slider-dots';

            courseComments.forEach(
                (_, index) => {
                    const dot =
                        document.createElement('span');

                    dot.className = 'dot';

                    if (index === 0) {
                        dot.classList.add('active');
                    }

                    dot.addEventListener(
                        'click',
                        () => {
                            showCourseSlide(
                                sliderWrapper,
                                index
                            );

                            startCourseRotation(
                                sliderWrapper
                            );
                        }
                    );

                    dotsContainer.appendChild(dot);
                }
            );

            sliderWrapper.appendChild(
                dotsContainer
            );
        }

        courseCommentsList.appendChild(
            sliderWrapper
        );

        showCourseSlide(sliderWrapper, 0);
        startCourseRotation(sliderWrapper);
    }

    /**
     * Envio de novos comentários.
     */
    if (commentForm) {
        commentForm.addEventListener(
            'submit',
            async event => {
                event.preventDefault();

                if (
                    !COMMENTS_ENDPOINT ||
                    COMMENTS_ENDPOINT ===
                    'SUA_URL_DO_WEB_APP_AQUI'
                ) {
                    alert(
                        'A funcionalidade de comentários ainda está a ser configurada.'
                    );

                    return;
                }

                const nameInput =
                    document.getElementById(
                        'comment_name'
                    );

                const textInput =
                    document.getElementById(
                        'comment_text'
                    );

                const submitBtn =
                    commentForm.querySelector(
                        'button[type="submit"]'
                    );

                const msgBox =
                    document.getElementById(
                        'comment-status-msg'
                    );

                const courseDropdown =
                    document.getElementById(
                        'comment_course'
                    );

                const courseValue =
                    courseDropdown
                        ? courseDropdown.value
                        : (
                            courseNameInput
                                ? courseNameInput.value
                                : 'Geral'
                        );

                const nome =
                    nameInput
                        ? nameInput.value.trim()
                        : '';

                const comentario =
                    textInput
                        ? textInput.value.trim()
                        : '';

                if (!nome || !comentario) {
                    alert(
                        'Por favor, preencha o nome e o comentário.'
                    );

                    return;
                }

                if (comentario.length > 500) {
                    alert(
                        'O comentário não pode exceder 500 caracteres.'
                    );

                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent =
                    'A ENVIAR...';

                if (msgBox) {
                    msgBox.textContent = '';
                    msgBox.className = '';
                }

                try {
                    const payload = {
                        nome,
                        curso: courseValue,
                        comentario
                    };

                    const response =
                        await fetch(
                            COMMENTS_ENDPOINT,
                            {
                                method: 'POST',
                                body: JSON.stringify(
                                    payload
                                )
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            'Falha na rede.'
                        );
                    }

                    const result =
                        await response.json();

                    if (
                        result.status === 'success'
                    ) {
                        if (msgBox) {
                            msgBox.textContent =
                                'Comentário enviado com sucesso! Obrigado pela sua opinião.';

                            msgBox.className =
                                'msg-success';
                        }

                        commentForm.reset();

                        const charCount =
                            document.getElementById(
                                'comment-char-count'
                            );

                        if (charCount) {
                            charCount.textContent =
                                '0/500';
                        }

                        await initComments();
                    } else {
                        throw new Error(
                            result.message ||
                            'Erro desconhecido.'
                        );
                    }
                } catch (error) {
                    console.error(error);

                    if (msgBox) {
                        msgBox.textContent =
                            'Ocorreu um erro ao enviar o comentário. Tente novamente mais tarde.';

                        msgBox.className =
                            'msg-error';
                    }
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent =
                        'ENVIAR COMENTÁRIO';

                    if (msgBox) {
                        setTimeout(() => {
                            msgBox.textContent = '';
                            msgBox.className = '';
                        }, 8000);
                    }
                }
            }
        );

        const textInput =
            document.getElementById(
                'comment_text'
            );

        const charCount =
            document.getElementById(
                'comment-char-count'
            );

        if (textInput && charCount) {
            textInput.addEventListener(
                'input',
                () => {
                    const len =
                        textInput.value.length;

                    charCount.textContent =
                        `${len}/500`;

                    charCount.style.color =
                        len >= 500
                            ? 'red'
                            : 'inherit';
                }
            );
        }
    }

    /**
     * Quando a utilizadora escolhe uma turma/data
     * ou modalidade, atualiza os comentários exibidos.
     */
    [
        'course_date',
        'course_option'
    ].forEach(id => {
        const field =
            document.getElementById(id);

        if (field) {
            field.addEventListener(
                'change',
                () => {
                    setTimeout(() => {
                        renderCourseComments(
                            loadedComments
                        );
                    }, 0);
                }
            );
        }
    });

    /**
     * Inicialização.
     */
    async function initComments() {
        clearRotationTimers();

        if (courseCommentsList) {
            courseCommentsList.innerHTML =
                '<p class="loading-comments">A carregar comentários...</p>';
        }

        loadedComments =
            await fetchComments();

        renderMainTestimonials(
            loadedComments
        );

        renderCourseComments(
            loadedComments
        );
    }

    initComments();
});