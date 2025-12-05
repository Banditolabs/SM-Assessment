const axios = require("axios");

const SM_ACCESS_TOKEN = "lMsBrzQ04CQ89elrGwz-gwHcarW7T0LHdZChq73mAnSkNR-1o5e-XlaSKToCj5G6axaC.fv.AjRCxEyUhoewMeq.bON-kvpxoSuDLRpk0avFKtsCakaKwHkSrAKfujWG"
const SM_API_BASE = 'https://api.surveymonkey.com/v3';
const authHeader = {
    headers: {
        "Authorization": `Bearer ${SM_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
};

async function cloneMessage(collectorId, messageId ) {
    console.log("TESTING");
    try {
        const response = await axios.get(
            `${SM_API_BASE}/collectors/${collectorId}/messages/${messageId}`,
            authHeader
        );
        const message = response.data;
        const cloneData = {
            type: message.type,
            subject: message.subject,
            body_text: message.body_text,
        }

        const postMessage = await axios.post(
            `${SM_API_BASE}/collectors/${collectorId}/messages`,
            cloneData,
            authHeader
        )
        console.log(`Cloned message ${messageId} → new ID ${postMessage.data.id}`);
        return postMessage.data;
    } catch (err) {
        console.error("❌ Error cloning message:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = { cloneMessage };
