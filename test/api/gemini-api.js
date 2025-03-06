// gemini-api.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 在此填入您的 Gemini API 金鑰
const API_KEY = 'AIzaSyCdB0PRBTb-v2bxp9uk-rg4DONdN5-DkjQ'; //  請替換成您的 API 金鑰！  非常重要！

const genAI = new GoogleGenerativeAI(API_KEY);

// 使用 getGenerativeModel 而非 getModel
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite"}); // 選擇要使用的 Gemini 模型 (gemini-pro 適合文字生成)


async function geminiSentenceCheck(sentence, word) {
    try {
        // 建構發送給 Gemini API 的提示 (prompt)
        const prompt = `請擔任專業的英文老師，詳細檢查以下句子是否符合英文文法、語意是否流暢自然，以及單字 "${word}" 在句子中的使用是否恰當。

請依照以下格式回覆：
1. 整體評價 (請簡潔總結句子是否合格，例如："✅ 句子使用正確且流暢" 或 "❌ 句子有誤"):
2. 詳細說明 (針對句子的文法、語意、單字使用等問題，提供具體的修改建議。如果句子沒有問題，則說明 "句子沒有明顯錯誤")：

句子：${sentence}
`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const responseText = result.response.text();
        console.log("Gemini API 回覆:", responseText); // 在伺服器端印出 Gemini API 的原始回覆，方便除錯

        return responseText; // 直接將 Gemini API 的回覆訊息回傳給前端

    } catch (error) {
        console.error("與 Gemini API 互動時發生錯誤:", error);
        return `❌  造句檢查功能暫時無法使用，請稍後重試。\n\n錯誤訊息：${error.message}`; // 回傳包含詳細錯誤訊息的提示
    }
}

module.exports = { geminiSentenceCheck };
