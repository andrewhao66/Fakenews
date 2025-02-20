// 單字數據
const words = [
    { word: "HTML", definition: "超文本標記語言", chinese: "超文本標記語言", memoryTip: "用來建立網頁結構" },
    { word: "CSS", definition: "層疊樣式表", chinese: "層疊樣式表", memoryTip: "用來美化網頁" },
    { word: "JavaScript", definition: "前端程式語言", chinese: "JavaScript", memoryTip: "讓網頁有動態效果" }
];

// 學習模式
if (document.getElementById("word")) {
    let currentWordIndex = 0;

    function updateWord() {
        const wordData = words[currentWordIndex];
        document.getElementById("word").innerText = wordData.word;
        document.getElementById("definition").innerText = wordData.definition;
        document.getElementById("chinese").innerText = wordData.chinese;
        document.getElementById("memoryTip").innerText = wordData.memoryTip;
    }

    document.getElementById("next-btn").addEventListener("click", function () {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        updateWord();
    });

    updateWord();
}

// 測驗模式
if (document.getElementById("quiz-container")) {
    let currentQuestionIndex = 0;
    let score = 0;

    function loadQuestion() {
        const question = words[currentQuestionIndex];
        document.getElementById("quiz-question").innerText = `單字: ${question.word}`;

        let options = [question.chinese];
        while (options.length < 3) {
            let randomOption = words[Math.floor(Math.random() * words.length)].chinese;
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        options.sort(() => Math.random() - 0.5);
        const optionsContainer = document.getElementById("quiz-options");
        optionsContainer.innerHTML = "";
        options.forEach(option => {
            let btn = document.createElement("button");
            btn.innerText = option;
            btn.classList.add("quiz-option");
            btn.onclick = () => checkAnswer(option, question.chinese);
            optionsContainer.appendChild(btn);
        });
    }

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            alert("答對了！");
            score++;
        } else {
            alert(`答錯了！正確答案是：${correct}`);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < words.length) {
            loadQuestion();
        } else {
            alert(`測驗結束！您的得分：${score}/${words.length}`);
            currentQuestionIndex = 0;
            score = 0;
            loadQuestion();
        }
    }

    loadQuestion();
}

// 挑戰模式（限時答題）
if (document.getElementById("challenge-container")) {
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 10;
    let timer;

    function startChallenge() {
        document.getElementById("challenge-start").classList.add("hidden");
        document.getElementById("challenge-quiz").classList.remove("hidden");
        timeLeft = 10;
        score = 0;
        currentQuestionIndex = 0;
        loadChallengeQuestion();
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeLeft--;
        document.getElementById("timer").innerText = `剩餘時間: ${timeLeft} 秒`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`時間到！您的得分：${score}`);
            location.reload();
        }
    }

    function loadChallengeQuestion() {
        const question = words[currentQuestionIndex];
        document.getElementById("challenge-question").innerText = `單字: ${question.word}`;

        let options = [question.chinese];
        while (options.length < 3) {
            let randomOption = words[Math.floor(Math.random() * words.length)].chinese;
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        options.sort(() => Math.random() - 0.5);
        const optionsContainer = document.getElementById("challenge-options");
        optionsContainer.innerHTML = "";
        options.forEach(option => {
            let btn = document.createElement("button");
            btn.innerText = option;
            btn.classList.add("quiz-option");
            btn.onclick = () => checkChallengeAnswer(option, question.chinese);
            optionsContainer.appendChild(btn);
        });
    }

    function checkChallengeAnswer(selected, correct) {
        if (selected === correct) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < words.length) {
            loadChallengeQuestion();
        } else {
            clearInterval(timer);
            alert(`挑戰結束！您的得分：${score}`);
            location.reload();
        }
    }

    document.getElementById("challenge-start-btn").addEventListener("click", startChallenge);
}
