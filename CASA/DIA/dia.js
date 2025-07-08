document.addEventListener('DOMContentLoaded', () => {
    // Seleccionem tant els recordatoris com les tasques
    const items = document.querySelectorAll('.reminder-item, .task-item');
    const progressText = document.querySelector('.progress-text');
    const progressFill = document.querySelector('.progress-fill');
    const completionMessage = document.querySelector('.completion-message');
    const totalTasks = items.length;
    const pageTitle = document.querySelector('h1').textContent.toLowerCase();
    const isTasksPage = pageTitle.includes('tasques');

    // Depuración: Verificar el número de tasques i completades al cargar
    console.log(`Total d'elements: ${totalTasks}, Completades inicialment: ${document.querySelectorAll('.reminder-item.completed, .task-item.completed').length}, Página: ${isTasksPage ? 'Tasques' : 'Recordatoris'}`);

    // Funció per actualitzar el progrés
    function updateProgress() {
        const completedTasks = document.querySelectorAll('.reminder-item.completed, .task-item.completed').length;
        const progressPercentage = (completedTasks / totalTasks) * 100;
        
        progressText.textContent = `${completedTasks} de ${totalTasks} ${isTasksPage ? 'tasques' : 'recordatoris'} fetes`;
        progressFill.style.width = `${progressPercentage}%`;

        // Mostrar missatge i aplicar desenfoc quan totes les tasques estiguin completades
        if (completedTasks === totalTasks) {
            completionMessage.style.display = 'block';
            document.body.classList.add('completion-active');
        } else {
            completionMessage.style.display = 'none';
            document.body.classList.remove('completion-active');
        }
    }

    // Evento per a cada recordatori/tasca
    items.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            // Actualitzar aria-label
            const task = item.querySelector('.reminder-task, .task-name').textContent;
            const isCompleted = item.classList.contains('completed');
            item.setAttribute('aria-label', 
                isCompleted 
                    ? `${item.getAttribute('aria-label')} (fet)`
                    : item.getAttribute('aria-label').replace(' (fet)', '')
            );
            updateProgress();
        });

        // Suport per a teclat
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Inicialitzar progrés
    updateProgress();
});

/* Apoyo emocional */

document.addEventListener('DOMContentLoaded', () => {
    const liftyMessage = document.querySelector('#lifty-message');
    const micBtn = document.querySelector('#mic-btn');
    const micStatus = document.querySelector('#mic-status');
    const fallbackOptions = document.querySelector('#fallback-options');

    const conversationFlow = {
        happy: [
            "Que bo! Estàs feliç 😊. M'alegra veure't així.",
            "Què et fa feliç avui? Pots dir-ho o pensar-ho.",
            "Genial! Continua fent coses que et facin somriure."
        ],
        sad: [
            "Està bé estar trist 😢. A vegades passa.",
            "Vols respirar profund 3 vegades amb mi?",
            "Respira amb mi: 1, 2, 3. Et sents una miqueta millor?"
        ],
        angry: [
            "Si estàs enutjat 😡, no passa res. Tots sentim això.",
            "Vols trepitjar fort 5 vegades per a treure-ho?",
            "Bé! Pisa: 1, 2, 3, 4, 5. Estàs més tranquil ara?"
        ],
        scared: [
            "No passa res si tens por 😨. Estic amb tu.",
            "Vols pensar en una cosa bonica, com un gosset?",
            "Pensa en una cosa bufona. Et sents més valent?"
        ]
    };

    let currentEmotion = null;
    let step = 0;
    let recognition = null;

    // Verificar si el navegador soporta SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            micBtn.classList.add('listening');
            micStatus.textContent = 'Escoltant...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            micStatus.textContent = `Has dit: "${transcript}"`;
            processSpeech(transcript);
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
            micStatus.textContent = 'Toca per parlar';
        };

        recognition.onerror = (event) => {
            micStatus.textContent = 'No et vaig escoltar bé. Toca una altra vegada.';
            console.error('Error de reconeixement de veu:', event.error);
        };
    } else {
        micBtn.style.display = 'none';
        fallbackOptions.style.display = 'block';
        micStatus.textContent = 'Micròfon no disponible.';
    }

    function processSpeech(transcript) {
        if (step === 0) {
            if (transcript.includes('feliç')) {
                currentEmotion = 'happy';
            } else if (transcript.includes('tris')) {
                currentEmotion = 'sad';
            } else if (transcript.includes('enfadat') || transcript.includes('enfadado')) {
                currentEmotion = 'angry';
            } else if (transcript.includes('por') || transcript.includes('asustado')) {
                currentEmotion = 'scared';
            } else {
                liftyMessage.textContent = "No he entès com et sents. Pots dir 'feliç', 'trist', 'enfadat' o 'por'?";
                return;
            }
            step = 1;
            liftyMessage.textContent = conversationFlow[currentEmotion][step - 1];
        } else if (step === 1) {
            step = 2;
            liftyMessage.textContent = conversationFlow[currentEmotion][step - 1];
        } else if (step === 2) {
            if (transcript.includes('si') || transcript.includes('sí')) {
                liftyMessage.textContent = conversationFlow[currentEmotion][step];
            } else {
                liftyMessage.textContent = "Està bé. Podem parlar d'una altra cosa si vols.";
            }
            step = 0;
            currentEmotion = null;
            setTimeout(() => {
                liftyMessage.textContent = "Hola! Sóc Lifty. Com et sents avui?";
            }, 2000);
        }
    }

    micBtn.addEventListener('click', () => {
        if (recognition) {
            recognition.start();
        }
    });

    // Alternativa con botones
    fallbackOptions.addEventListener('click', (e) => {
        const button = e.target.closest('.option-btn');
        if (!button) return;

        const emotion = button.getAttribute('data-emotion');
        processSpeech(emotion);
    });

    // Soporte para teclado
    micBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            micBtn.click();
        }
    });

    fallbackOptions.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const button = e.target.closest('.option-btn');
            if (button) {
                e.preventDefault();
                button.click();
            }
        }
    });
});