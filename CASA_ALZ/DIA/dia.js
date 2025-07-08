/* Recordatorios dirios */

document.addEventListener('DOMContentLoaded', () => {
    const reminderItems = document.querySelectorAll('.reminder-item');
    const progressText = document.querySelector('.progress-text');
    const progressFill = document.querySelector('.progress-fill');
    const completionMessage = document.querySelector('.completion-message');
    const totalTasks = reminderItems.length;

    // Función para actualizar el progreso
    function updateProgress() {
        const completedTasks = document.querySelectorAll('.reminder-item.completed').length;
        const progressPercentage = (completedTasks / totalTasks) * 100;
        
        progressText.textContent = `${completedTasks} de ${totalTasks} tareas hechas`;
        progressFill.style.width = `${progressPercentage}%`;

        // Mostrar mensaje al completar todo
        if (completedTasks === totalTasks) {
            completionMessage.style.display = 'block';
        } else {
            completionMessage.style.display = 'none';
        }
    }

    // Evento para cada recordatorio
    reminderItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            // Actualizar aria-label
            const task = item.querySelector('.reminder-task').textContent;
            const isCompleted = item.classList.contains('completed');
            item.setAttribute('aria-label', 
                isCompleted 
                    ? `${item.getAttribute('aria-label')} (hecho)` 
                    : item.getAttribute('aria-label').replace(' (hecho)', '')
            );
            updateProgress();
        });

        // Soporte para teclado
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Inicializar progreso
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
            "¡Qué bueno! Estás feliz 😊. Me alegra verte así.",
            "¿Qué te hace feliz hoy? Puedes decirlo o pensarlo.",
            "¡Genial! Sigue haciendo cosas que te hagan sonreír."
        ],
        sad: [
            "Está bien estar triste 😢. A veces pasa.",
            "¿Quieres respirar hondo 3 veces conmigo?",
            "Respira conmigo: 1, 2, 3. ¿Te sientes un poquito mejor?"
        ],
        angry: [
            "Si estás enojado 😡, no pasa nada. Todos sentimos eso.",
            "¿Quieres pisar fuerte 5 veces para sacarlo?",
            "¡Bien! Pisa: 1, 2, 3, 4, 5. ¿Estás más tranquilo ahora?"
        ],
        scared: [
            "No pasa nada si tienes miedo 😨. Estoy contigo.",
            "¿Quieres pensar en algo bonito, como un perrito?",
            "Piensa en algo lindo. ¿Te sientes más valiente?"
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
            micStatus.textContent = 'Escuchando...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            micStatus.textContent = `Dijiste: "${transcript}"`;
            processSpeech(transcript);
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
            micStatus.textContent = 'Toca para hablar';
        };

        recognition.onerror = (event) => {
            micStatus.textContent = 'No te escuché bien. Toca otra vez.';
            console.error('Error de reconocimiento de voz:', event.error);
        };
    } else {
        micBtn.style.display = 'none';
        fallbackOptions.style.display = 'block';
        micStatus.textContent = 'Micrófono no disponible.';
    }

    function processSpeech(transcript) {
        if (step === 0) {
            if (transcript.includes('feliz')) {
                currentEmotion = 'happy';
            } else if (transcript.includes('triste')) {
                currentEmotion = 'sad';
            } else if (transcript.includes('enojado') || transcript.includes('enfadado')) {
                currentEmotion = 'angry';
            } else if (transcript.includes('miedo') || transcript.includes('asustado')) {
                currentEmotion = 'scared';
            } else {
                liftyMessage.textContent = "No entendí cómo te sientes. ¿Puedes decir 'feliz', 'triste', 'enojado' o 'miedo'?";
                return;
            }
            step = 1;
            liftyMessage.textContent = conversationFlow[currentEmotion][step - 1];
        } else if (step === 1) {
            step = 2;
            liftyMessage.textContent = conversationFlow[currentEmotion][step - 1];
        } else if (step === 2) {
            if (transcript.includes('sí') || transcript.includes('si')) {
                liftyMessage.textContent = conversationFlow[currentEmotion][step];
            } else {
                liftyMessage.textContent = "Está bien. Podemos hablar de otra cosa si quieres.";
            }
            step = 0;
            currentEmotion = null;
            setTimeout(() => {
                liftyMessage.textContent = "¡Hola! Soy Lifty. ¿Cómo te sientes hoy?";
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

/* tareas hogar */

document.addEventListener('DOMContentLoaded', () => {
    const taskItems = document.querySelectorAll('.task-item');
    const progressText = document.querySelector('.progress-text');
    const progressFill = document.querySelector('.progress-fill');
    const completionMessage = document.querySelector('.completion-message');
    const totalTasks = taskItems.length;

    // Función para actualizar el progreso
    function updateProgress() {
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        const progressPercentage = (completedTasks / totalTasks) * 100;
        
        progressText.textContent = `${completedTasks} de ${totalTasks} tareas hechas`;
        progressFill.style.width = `${progressPercentage}%`;

        // Mostrar mensaje al completar todo
        if (completedTasks === totalTasks) {
            completionMessage.style.display = 'block';
        } else {
            completionMessage.style.display = 'none';
        }
    }

    // Evento para cada tarea
    taskItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            // Actualizar aria-label
            const task = item.querySelector('.task-name').textContent;
            const isCompleted = item.classList.contains('completed');
            item.setAttribute('aria-label', 
                isCompleted 
                    ? `${item.getAttribute('aria-label')} (hecho)` 
                    : item.getAttribute('aria-label').replace(' (hecho)', '')
            );
            updateProgress();
        });

        // Soporte para teclado
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Inicializar progreso
    updateProgress();
});



