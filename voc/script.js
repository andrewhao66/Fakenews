const words = [
    { word: "Demonstration", definition: "A protest; a large gathering of people for a common cause.", chinese: "示威", tip: "想像一群人拿著標語抗議" },
    { word: "Emancipation", definition: "Freedom; liberation from slavery.", chinese: "解放", tip: "聯想到美國的《解放宣言》" },
    { word: "Manacles", definition: "Chains; handcuffs.", chinese: "手銬", tip: "想像犯人手上戴著鐵手銬" }
];

let currentWordIndex = 0;

// 切換到學習模式
function startLearning() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("learning-container").classList.remove("hidden");
    showWord();
}

// 顯示單字
function showWord() {
    let wordData = words[currentWordIndex];
    document.getElementById("word-display").innerHTML = `
        <h3>${wordData.word}</h3>
        <p><strong>定義：</strong> ${wordData.definition}</p>
        <p><strong>中文：</strong> ${wordData.chinese}</p>
        <p style="background: yellow; display: inline-block; padding: 5px;"><strong>記憶提示：</strong> ${wordData.tip}</p>
    `;
}

// 下一個單字
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    showWord();
}

// 切換到測驗模式
function startTest() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("test-container").classList.remove("hidden");
    generateTestQuestion();
}

// 產生測驗題目
function generateTestQuestion() {
    let wordData = words[Math.floor(Math.random() * words.length)];
    let correctAnswer = wordData.definition;
    let options = [correctAnswer];

    while (options.length < 3) {
        let randomDef = words[Math.floor(Math.random() * words.length)].definition;
        if (!options.includes(randomDef)) options.push(randomDef);
    }

    options.sort(() => Math.random() - 0.5);

    document.getElementById("test-question").innerText = `請選擇 "${wordData.word}" 的正確定義：`;
    document.getElementById("test-options").innerHTML = options.map(opt => 
        `<button onclick="checkTestAnswer('${opt}', '${correctAnswer}')">${opt}</button>`
    ).join("");
}

// 檢查測驗答案
function checkTestAnswer(selected, correct) {
    if (selected === correct) {
        alert("✅ 答對了！");
    } else {
        alert(`❌ 答錯了！ 正確答案是：${correct}`);
    }
    generateTestQuestion();
}

// 切換到挑戰模式
function startChallenge() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("challenge-container").classList.remove("hidden");
    generateChallengeQuestion();
}

// 產生挑戰題目
function generateChallengeQuestion() {
    let wordData = words[Math.floor(Math.random() * words.length)];
    document.getElementById("challenge-question").innerText = `請拼寫出以下定義的英文單字：\n${wordData.definition}`;
    document.getElementById("challenge-input").value = "";
    document.getElementById("challenge-input").setAttribute("data-answer", wordData.word);
}

// 檢查挑戰模式答案
function checkAnswer() {
    let input = document.getElementById("challenge-input").value.trim();
    let correctAnswer = document.getElementById("challenge-input").getAttribute("data-answer");

    if (input.toLowerCase() === correctAnswer.toLowerCase()) {
        alert("✅ 答對了！");
        generateChallengeQuestion();
    } else {
        alert(`❌ 答錯了！ 正確答案是：${correctAnswer}`);
    }
}

// 返回主畫面
function goHome() {
    document.getElementById("learning-container").classList.add("hidden");
    document.getElementById("test-container").classList.add("hidden");
    document.getElementById("challenge-container").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}
