/**
 * Google Apps Script Web App Integration
 * Form Submission Logic for Course Registrations and Contact Form
 *
 * BACKEND SETUP:
 * 1. Create a Google Apps Script
 * 2. Add a doPost(e) function to handle the JSON/FormData
 * 3. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 4. Paste the URL below in SCRIPT_URL
 *
 * PAYLOADS:
 * - Common: source_page, submitted_at, form_type (course|contact)
 * - Course: full_name, email, whatsapp, course_name, privacy_consent
 * - Contact: full_name, email, phone, message
 *
 * TEST EMAIL: mayainatsume@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.course-form, .contact-form-element');
    if (forms.length === 0) return;

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMOBXv5yuzFq2Vd7gkRd4kNpbq19f6zXIoWtnzBI_vS97LLduCvXYe4lEZoHRfu1aBRw/exec";

    forms.forEach((form) => {
        const isContactForm = form.classList.contains('contact-form-element');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalBtnText = submitBtn.innerText;

        let messageBox = form.querySelector('.form-message-alert');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.className = 'form-message-alert';
            messageBox.style.display = 'none';
            messageBox.style.padding = '10px';
            messageBox.style.marginBottom = '15px';
            messageBox.style.borderRadius = '4px';
            messageBox.style.fontSize = '13px';
            messageBox.style.textAlign = 'center';
            submitBtn.parentNode.insertBefore(messageBox, submitBtn);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageBox.style.display = 'none';

            if (!isContactForm) {
                const privacyCheckbox = form.querySelector('input[name="privacy_consent"]');
                if (privacyCheckbox && !privacyCheckbox.checked) {
                    showMessage(
                        messageBox,
                        'Por favor, aceite a Política de Privacidade para continuar.',
                        'error'
                    );
                    return;
                }
            }

            submitBtn.disabled = true;
            submitBtn.innerText = 'A enviar...';

            const formData = new FormData(form);
            const sourcePage = window.location.pathname.split('/').pop() || 'index.html';

            formData.append('source_page', sourcePage);
            formData.append('submitted_at', new Date().toISOString());
            formData.append('form_type', isContactForm ? 'contact' : 'course');

            try {
                if (SCRIPT_URL === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE") {
                    throw new Error("PLACEHOLDER_URL");
                }

                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("NETWORK_ERROR");
                }

                let result;
                try {
                    result = await response.json();
                } catch (jsonError) {
                    console.error('JSON Parse Error:', jsonError);
                    throw new Error("INVALID_JSON_RESPONSE");
                }

                if (!result.ok) {
                    throw new Error(result.error || "BACKEND_ERROR");
                }

                const successMsg = isContactForm
                    ? "A sua mensagem foi enviada com sucesso! Responderemos em breve."
                    : "A sua inscrição foi recebida com sucesso! Entraremos em contacto em breve.";

                showMessage(messageBox, successMsg, 'success');
                form.reset();

            } catch (error) {
                console.error('Submission Error:', error);

                if (error.message === "PLACEHOLDER_URL") {
                    showMessage(
                        messageBox,
                        "O formulário está pronto, mas o sistema de envio ainda não foi configurado.",
                        'error'
                    );
                } else if (error.message === "NETWORK_ERROR") {
                    showMessage(
                        messageBox,
                        "Não foi possível contactar o servidor. Verifique a ligação e tente novamente.",
                        'error'
                    );
                } else if (error.message === "INVALID_JSON_RESPONSE") {
                    showMessage(
                        messageBox,
                        "O servidor respondeu num formato inesperado. Verifique a configuração do Apps Script.",
                        'error'
                    );
                } else {
                    showMessage(
                        messageBox,
                        error.message || 'Ocorreu um erro ao enviar. Por favor tente novamente ou contacte-nos por WhatsApp.',
                        'error'
                    );
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    });

    function showMessage(target, text, type) {
        target.style.display = 'block';

        if (type === 'success') {
            target.style.backgroundColor = '#f1f8e9';
            target.style.color = '#33691e';
            target.style.border = '1px solid #dcedc8';
        } else {
            target.style.backgroundColor = '#fff3f3';
            target.style.color = '#d32f2f';
            target.style.border = '1px solid #ffcdd2';
        }

        target.innerText = text;
    }
});