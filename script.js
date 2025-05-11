const dictionary = {
    'en': {
        'hello': 'hello',
        'good morning': 'good morning',
        'how are you': 'how are you',
        'thank you': 'thank you',
        'goodbye': 'goodbye',
        'I am doing well': 'I am doing well',
        'what is your name': 'what is your name',
        'where are you from': 'where are you from',
        'see you later': 'see you later',
    },
    'sw': {
        'hello': 'habari',
        'good morning': 'habari za asubuhi',
        'how are you': 'uko aje',
        'thank you': 'asante',
        'goodbye': 'kwaheri',
        'I am doing well': 'niko sawa',
        'what is your name': 'jina lako nani',
        'where are you from': 'unatoka wapi',
        'see you later': 'tutaonana baadaye',
    },
    'fr': {
        'hello': 'bonjour',
        'good morning': 'bonjour',
        'how are you': 'comment ça va',
        'thank you': 'merci',
        'goodbye': 'au revoir',
        'I am doing well': 'je vais bien',
        'what is your name': 'comment tu t’appelles',
        'where are you from': 'd’où viens-tu',
        'see you later': 'à plus tard',
    },
    'sheng': {
        'hello': 'niaje',
        'good morning': 'umraukaje',
        'how are you': 'uko fiti',
        'thank you': 'nashukuru',
        'goodbye': 'tuchekiane',
        'I am doing well': 'niko poa',
        'what is your name': 'jina lako nani',
        'where are you from': 'unatoka wapi',
        'see you later': 'tutaonana baadaye',
    },
    'pidgin': {
        'hello': 'how far',
        'good morning': 'morning o',
        'how are you': 'how you dey',
        'thank you': 'tank you',
        'goodbye': 'i dey go',
        'I am doing well': 'i dey alright',
        'what is your name': 'wetin be your name',
        'where are you from': 'where you from',
        'see you later': 'i go see you',
    }
};

// Phonetic dictionary
const phoneticDictionary = {
    // English
    'hello': 'heh-loh',
    'good morning': 'guhd mor-ning',
    'how are you': 'hau ahr yoo',
    'thank you': 'thangk yoo',
    'goodbye': 'guhd-bai',
    'I am doing well': 'ai am doo-ing wel',
    'what is your name': 'wut iz yor neym',
    'where are you from': 'wehr ahr yoo fruhm',
    'see you later': 'see yoo lay-ter',

    // Swahili
    'habari': 'ha-BAH-ree',
    'habari za asubuhi': 'ha-BAH-ree za soo-BOO-hee',
    'uko aje': 'koo-AH-jeh',
    'asante': 'a-SAHN-teh',
    'kwaheri': 'kwa-HEH-ree',
    'niko sawa': 'nee-KOH sah-wah',
    'jina lako nani': 'JEE-na LAH-ko NAH-nee',
    'unatoka wapi': 'oo-na-TOH-ka WAH-pee',
    'tutaonana baadaye': 'too-tao-NAH-na bah-a-DAH-yeh',

    // French
    'bonjour': 'bohn-ZHUR',
    'comment ça va': 'koh-mah sah vaah',
    'merci': 'mehr-SEE',
    'au revoir': 'oh ruh-VWAHR',
    'je vais bien': 'zhuh veh BYEH~',
    'comment tu t’appelles': 'koh-mahn too tah-PELL',
    'd’où viens-tu': 'doo vyahn-TOO',
    'à plus tard': 'ah plu TAR',

    // Sheng
    'niaje': 'niah-jeh',
    'umraukaje': 'oom-rah-KAH-jeh',
    'uko fiti': 'koo-FEE-tee',
    'nashukuru': 'nah-shoo-KOO-roo',
    'tuchekiane': 'toooo-cheki-YaaH-neeeeh',
    'niko poa': 'nee-KOH pow-ah',

    // Pidgin
    'how far': 'ha-fa',
    'morning o': 'mo-neen oh',
    'how you dey': 'ha-yoo dey',
    'tank you': 'tank-yoo',
    'i dey go': 'ah-dey-go',
    'i dey alright': 'ah-dey-aw-rite',
    'wetin be your name': 'weh-tin yor nem',
    'where you from': 'weh-yoo-from',
    'i go see you': 'ah-go-see-yoo'
};

/// Detect language from input text
function detectLanguage(text) {
    const scores = {};
    for (const lang in dictionary) {
        scores[lang] = 0;
        for (const phrase in dictionary[lang]) {
            if (text.includes(phrase)) scores[lang]++;
        }
    }
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

// Match phrase from input
function getKeyFromInput(text, lang) {
    for (const key in dictionary[lang]) {
        if (text.includes(key)) return key;
    }
    return null;
}

// Get phonetic version of translated text
function getPhonetic(text) {
    return phoneticDictionary[text.toLowerCase()] || "";
}

// Translate and speak text
function translate() {
    const inputText = document.getElementById("textInput").value.toLowerCase();
    const targetLang = document.getElementById("inputLanguage").value;
    const translatedDiv = document.getElementById("translatedText");
    const phoneticDiv = document.getElementById("phoneticHint");

    const detectedLang = detectLanguage(inputText);
    const matchedKey = getKeyFromInput(inputText, detectedLang);

    if (matchedKey && dictionary[targetLang][matchedKey]) {
        const translated = dictionary[targetLang][matchedKey];
        translatedDiv.innerText = translated;
        phoneticDiv.innerText = getPhonetic(translated);
        speak(translated, targetLang);
    } else {
        translatedDiv.innerText = "Sorry, I didn’t catch that.";
        phoneticDiv.innerText = "";
    }
}

// Voice settings
let voices = [];
let speechReady = false;

function loadVoices() {
    voices = speechSynthesis.getVoices();
    if (voices.length) speechReady = true;
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// 🔊 SPEAK FUNCTION — Updated for smoother female simulation
function speak(text, lang) {
    if (!speechReady) {
        setTimeout(() => speak(text, lang), 100);
        return;
    }

    const genderPref = document.getElementById("voiceSelect").value;  // Gender preference (female/male)
    const langMap = {
        en: "en-US", sw: "sw-KE", fr: "fr-FR", sheng: "sw-KE", pidgin: "en-US"
    };
    const voiceLang = langMap[lang] || "en-US";

    // Look for female voices that might sound more like a "lady" (smoother, softer)
    const voiceList = voices.filter(v => v.lang === voiceLang && v.name.toLowerCase().includes("female"));
    
    // If no female voice found, use one that is close to a lady-like voice
    let selectedVoice = voiceList.length ? voiceList[0] : voices.find(v => v.lang === voiceLang) || voices[0];

    // Check the voice for specific names that are commonly used for more natural-sounding female voices
    const ladyLikeVoices = ['Joanna', 'Samantha', 'Victoria'];  // Common "lady-like" names
    selectedVoice = voices.find(v => ladyLikeVoices.some(name => v.name.includes(name))) || selectedVoice;

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice;
    utter.lang = voiceLang;

    // Adjust pitch, rate, and volume for a more natural female voice
    if (genderPref === "female") {
        utter.pitch = 50.6;   // Higher pitch for a more feminine sound
        utter.rate = 1;      // Standard speaking rate
        utter.volume = 1;    // Standard volume
    } else if (genderPref === "male") {
        utter.pitch = 0.5;   // Lower pitch for a male voice
        utter.rate = 1;
        utter.volume = 1;
    } else {
        utter.pitch = 1;     // Neutral pitch for gender-neutral voices
        utter.rate = 1;
        utter.volume = 1;
    }

    // Adding language-specific adjustments
    const langRateMap = {
        pidgin: 1.1,
        sw: 0.95,
        sheng: 0.95,
        fr: 0.9
    };
    utter.rate *= langRateMap[lang] || 1;

    // Cancel any ongoing speech and speak the new phrase
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}


// 🎤 Speech recognition
let recognition = window.SpeechRecognition ? new SpeechRecognition() :
    window.webkitSpeechRecognition ? new webkitSpeechRecognition() : null;

if (recognition) {
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => document.getElementById("status").innerText = "🎙️ Listening...";
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("textInput").value = transcript;
        document.getElementById("status").innerText = "";
        translate();
    };
    recognition.onerror = () => document.getElementById("status").innerText = "⚠️ Try again";
    recognition.onend = () => document.getElementById("status").innerText = "";
}

// 🎯 Event listeners
document.getElementById("micBtn").addEventListener("click", () => {
    if (recognition) recognition.start();
});

document.getElementById("speakBtn").addEventListener("click", () => {
    const spoken = document.getElementById("translatedText").innerText;
    const lang = document.getElementById("inputLanguage").value;
    if (spoken && !spoken.startsWith("Sorry")) speak(spoken, lang);
});

document.getElementById("textInput").addEventListener("input", translate);