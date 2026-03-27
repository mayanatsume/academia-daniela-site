/**
 * Google Apps Script Web App Integration
 * Form Submission Logic for Course Pages
 */

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.course-form');
    if (forms.length === 0) return; // Only execute if form is present on page

    // PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE
    // O programador Backend deve substituir esta constante com a macro "deploy URL" do Apps Script.
    const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE";

    forms.forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalBtnText = submitBtn.innerText;

        // Inject custom message container if missing, fallback config
        // Now scoped per form
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

            // Hide previous messages for this specific form
            messageBox.style.display = 'none';

            // 1. Validate Privacy Checkbox explicitly within this form
            const privacyCheckbox = form.querySelector('input[name="privacy_consent"]');
            if (privacyCheckbox && !privacyCheckbox.checked) {
                messageBox.style.display = 'block';
                messageBox.style.backgroundColor = '#fff3f3';
                messageBox.style.color = '#d32f2f';
                messageBox.style.border = '1px solid #ffcdd2';
                messageBox.innerText = 'Por favor, aceite a Política de Privacidade para continuar.';
                return;
            }

            // 2. Prevent Multiple Submissions on this specific button
            submitBtn.disabled = true;
            submitBtn.innerText = 'A enviar...';

            // 3. Prepare Payload
            const formData = new FormData(form);

            // Append backend specific metrics
            const sourcePage = window.location.pathname.split('/').pop() || 'index.html';
            formData.append('source_page', sourcePage);
            formData.append('submitted_at', new Date().toISOString());

            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Erro no envio.");
                }

                // Success Handling
                messageBox.style.display = 'block';
                messageBox.style.backgroundColor = '#f1f8e9';
                messageBox.style.color = '#33691e';
                messageBox.style.border = '1px solid #dcedc8';
                messageBox.innerText = 'A sua inscrição foi recebida com sucesso! Entraremos em contacto em breve.';
                form.reset();

            } catch (error) {
                console.error('Submission Error:', error);

                // Error Handling
                messageBox.style.display = 'block';
                messageBox.style.backgroundColor = '#fff3f3';
                messageBox.style.color = '#d32f2f';
                messageBox.style.border = '1px solid #ffcdd2';

                if (SCRIPT_URL === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE") {
                    messageBox.innerText = '[Modo Frontend]: O envio funcionou, mas o Backend (Google Script) ainda não foi ligado.';
                } else {
                    messageBox.innerText = 'Ocorreu um erro ao enviar a inscrição. Por favor tente novamente ou contacte-nos por WhatsApp.';
                }
            } finally {
                // Restore Button for this specific form
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    });
});
