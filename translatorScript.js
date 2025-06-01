const inputTextEle = document.querySelector(".input");
const outputTextEle = document.querySelector(".output");
const romajiOutput = document.querySelector('.romaji');

document.getElementById("translate-button").addEventListener("click", translate);

function translate() {
    const inputText = inputTextEle.value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=${encodeURI(inputText)}`;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const responseReturned = JSON.parse(this.responseText);
            const translations = responseReturned[0].map((text) => text[0]);
            const outputText = translations.join(" ");
            
            outputTextEle.textContent = outputText;
            updateRomaji(outputText);
        }
    };
    xhttp.open("GET", url);
    xhttp.send();
}

function updateRomaji(text) {
    romajiOutput.style.display = 'block';
    try {
        const romajiText = wanakana.toRomaji(text);
        romajiOutput.value = romajiText;
    } catch (error) {
        console.error('Error converting to romaji:', error);
        romajiOutput.value = 'Error converting to romaji';
    }
}

// Add TTS functionality
const speakInput = document.getElementById('speak-input');
const speakOutput = document.getElementById('speak-output');

// Speech synthesis setup
const synth = window.speechSynthesis;

speakInput.addEventListener('click', () => {
    const text = inputTextEle.value;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        synth.speak(utterance);
    }
});

speakOutput.addEventListener('click', () => {
    const text = outputTextEle.textContent;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        synth.speak(utterance);
    }
});

document.getElementById("clear-button").addEventListener("click", clear);

function clear() {
    inputTextEle.value = "";
    outputTextEle.textContent = "";
    romajiOutput.value = '';
    synth.cancel(); // Stop any ongoing speech
}

// Add theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const themeIcon = themeSwitch.querySelector('i');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Theme toggle handler
themeSwitch.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    // Update icon
    themeIcon.classList.replace(
        isDark ? 'fa-moon' : 'fa-sun',
        isDark ? 'fa-sun' : 'fa-moon'
    );
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Add copy functionality
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        const textArea = document.querySelector(`.${target}`);
        const text = textArea.value;
        
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const icon = button.querySelector('i');
            icon.classList.replace('fa-copy', 'fa-check');
            button.style.backgroundColor = 'var(--success-color)';
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.classList.replace('fa-check', 'fa-copy');
                button.style.backgroundColor = 'var(--primary-color)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text:', err);
        });
    });
});

// Add mobile device detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Adjust textarea behavior for mobile
if (isMobile) {
    // Prevent zoom on focus for iOS devices
    const metas = document.createElement('meta');
    metas.name = 'viewport';
    metas.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    document.getElementsByTagName('head')[0].appendChild(metas);

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.opacity = '0.7';
        });
        button.addEventListener('touchend', () => {
            button.style.opacity = '1';
        });
    });

    // Improve scroll handling for mobile
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('focus', () => {
            // Scroll to the focused textarea after keyboard appears
            setTimeout(() => {
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

// Update clear function for better mobile handling
function clear() {
    inputTextEle.value = "";
    outputTextEle.textContent = "";
    romajiOutput.value = '';
    synth.cancel(); // Stop any ongoing speech
    if (isMobile) {
        // Hide mobile keyboard
        document.activeElement.blur();
    }
}

// Improve copy feedback for mobile
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener(isMobile ? 'touchend' : 'click', () => {
        const target = button.dataset.target;
        const textArea = document.querySelector(`.${target}`);
        const text = textArea.value;
        
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const icon = button.querySelector('i');
            icon.classList.replace('fa-copy', 'fa-check');
            button.style.backgroundColor = 'var(--success-color)';
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.classList.replace('fa-check', 'fa-copy');
                button.style.backgroundColor = 'var(--primary-color)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text:', err);
        });
        // Add vibration feedback on mobile if supported
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(50);
        }
    });
});
