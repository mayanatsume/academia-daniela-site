(function () {
    const CONSENT_KEY = 'ads_cookie_consent_v1';

    // Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* Cookie Banner */
        .ads-cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid #d4af37;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
            padding: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
            font-family: inherit;
            transform: translateY(100%);
            transition: transform 0.4s ease;
        }
        .ads-cookie-banner.show {
            transform: translateY(0);
        }
        .ads-cookie-text {
            color: #1f1f1f;
            font-size: 14px;
            text-align: center;
            max-width: 800px;
        }
        .ads-cookie-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .ads-btn-outline {
            background: transparent;
            border: 1px solid #d4af37;
            color: #d4af37;
            padding: 10px 20px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .ads-btn-outline:hover, .ads-btn-filled {
            background: #d4af37;
            color: #fff;
        }
        .ads-btn-filled {
            border: 1px solid #d4af37;
            padding: 10px 20px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .ads-btn-filled:hover {
            opacity: 0.9;
        }

        /* Cookie Modal */
        .ads-cookie-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 100000;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .ads-cookie-overlay.show {
            display: flex;
            opacity: 1;
        }
        .ads-cookie-modal {
            background: #ffffff;
            border: 1px solid #d4af37;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            width: 90%;
            max-width: 500px;
            padding: 30px;
            position: relative;
        }
        .ads-modal-header {
            font-size: 20px;
            font-weight: 600;
            color: #1f1f1f;
            margin-bottom: 20px;
            font-family: inherit;
        }
        .ads-modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        .ads-toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        .ads-toggle-row:last-of-type {
            border-bottom: none;
        }
        .ads-toggle-label {
            font-size: 15px;
            color: #1f1f1f;
            font-weight: 500;
        }
        .ads-toggle-desc {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        
        /* Toggle Switch */
        .ads-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .ads-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .ads-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .ads-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .ads-slider {
            background-color: #d4af37;
        }
        input:checked + .ads-slider:before {
            transform: translateX(20px);
        }
        input:disabled + .ads-slider {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .ads-modal-footer {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
        }

        @media (min-width: 768px) {
            .ads-cookie-banner {
                flex-direction: row;
                justify-content: space-between;
                padding: 20px 40px;
            }
            .ads-cookie-text {
                text-align: left;
            }
        }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="ads-cookie-banner" id="adsCookieBanner">
            <div class="ads-cookie-text">
                Utilizamos cookies para melhorar a sua experiência. Pode aceitar todos, recusar ou escolher preferências.
            </div>
            <div class="ads-cookie-actions">
                <button class="ads-btn-outline" id="adsBtnPreferences">Preferências</button>
                <button class="ads-btn-outline" id="adsBtnReject">Recusar</button>
                <button class="ads-btn-filled" id="adsBtnAccept">Aceitar</button>
            </div>
        </div>

        <div class="ads-cookie-overlay" id="adsCookieOverlay">
            <div class="ads-cookie-modal">
                <button class="ads-modal-close" id="adsModalClose">&times;</button>
                <div class="ads-modal-header">Preferências de Cookies</div>
                
                <div class="ads-toggle-row">
                    <div>
                        <div class="ads-toggle-label">Necessários</div>
                        <div class="ads-toggle-desc">Essenciais para o funcionamento do site.</div>
                    </div>
                    <label class="ads-switch">
                        <input type="checkbox" id="cookieNec" checked disabled>
                        <span class="ads-slider"></span>
                    </label>
                </div>

                <div class="ads-toggle-row">
                    <div>
                        <div class="ads-toggle-label">Preferências</div>
                        <div class="ads-toggle-desc">Permitem lembrar escolhas do utilizador.</div>
                    </div>
                    <label class="ads-switch">
                        <input type="checkbox" id="cookiePref">
                        <span class="ads-slider"></span>
                    </label>
                </div>

                <div class="ads-toggle-row">
                    <div>
                        <div class="ads-toggle-label">Estatística</div>
                        <div class="ads-toggle-desc">Ajudam-nos a entender como os visitantes interagem.</div>
                    </div>
                    <label class="ads-switch">
                        <input type="checkbox" id="cookieStat">
                        <span class="ads-slider"></span>
                    </label>
                </div>

                <div class="ads-toggle-row">
                    <div>
                        <div class="ads-toggle-label">Marketing</div>
                        <div class="ads-toggle-desc">Usados para mostrar anúncios relevantes.</div>
                    </div>
                    <label class="ads-switch">
                        <input type="checkbox" id="cookieMark">
                        <span class="ads-slider"></span>
                    </label>
                </div>

                <div class="ads-modal-footer">
                    <button class="ads-btn-filled" id="adsBtnSavePrefs">Guardar Escolha</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Logic
    const banner = document.getElementById('adsCookieBanner');
    const overlay = document.getElementById('adsCookieOverlay');
    const btnAccept = document.getElementById('adsBtnAccept');
    const btnReject = document.getElementById('adsBtnReject');
    const btnPreferences = document.getElementById('adsBtnPreferences');
    const btnClose = document.getElementById('adsModalClose');
    const btnSavePrefs = document.getElementById('adsBtnSavePrefs');

    // Toggles
    const tPref = document.getElementById('cookiePref');
    const tStat = document.getElementById('cookieStat');
    const tMark = document.getElementById('cookieMark');

    function checkConsent() {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 500);
        }
    }

    function saveConsent(prefs) {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
        banner.classList.remove('show');
        overlay.classList.remove('show');
    }

    btnAccept.addEventListener('click', () => {
        saveConsent({ necessary: true, preferences: true, statistics: true, marketing: true });
    });

    btnReject.addEventListener('click', () => {
        saveConsent({ necessary: true, preferences: false, statistics: false, marketing: false });
    });

    btnPreferences.addEventListener('click', () => {
        banner.classList.remove('show');
        overlay.classList.add('show');
    });

    btnClose.addEventListener('click', () => {
        overlay.classList.remove('show');
        if (!localStorage.getItem(CONSENT_KEY)) {
            banner.classList.add('show');
        }
    });

    btnSavePrefs.addEventListener('click', () => {
        saveConsent({
            necessary: true,
            preferences: tPref.checked,
            statistics: tStat.checked,
            marketing: tMark.checked
        });
    });

    // Handle dynamic clicks for #open-cookie-settings
    document.addEventListener('click', (e) => {
        let target = e.target;
        while (target && target !== document) {
            if (target.id === 'open-cookie-settings') {
                e.preventDefault();
                // Load current choices if exist
                const consent = localStorage.getItem(CONSENT_KEY);
                if (consent) {
                    try {
                        const parsed = JSON.parse(consent);
                        tPref.checked = !!parsed.preferences;
                        tStat.checked = !!parsed.statistics;
                        tMark.checked = !!parsed.marketing;
                    } catch (e) { }
                }
                overlay.classList.add('show');
                return;
            }
            target = target.parentNode;
        }
    });

    // Run on init
    checkConsent();
})();
