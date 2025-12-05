require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { cloneMessage } = require("./clone_message_handler");

const app = express();
app.use(express.json());

/*
SURVEYMONKEY LOCAL API COMMANDS

SURVEYS
curl -X GET http://localhost:3000/surveys | jq
curl -X GET http://localhost:3000/surveys/400070630 | jq

COLLECTORS
curl -X GET http://localhost:3000/collectors | jq
curl -X GET http://localhost:3000/collector | jq
curl -X POST http://localhost:3000/collector \
  -H "Content-Type: application/json" | jq

MESSAGES
curl -X GET http://localhost:3000/messages | jq
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" | jq
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" | jq
curl -X POST http://localhost:3000/clone-message/438164091/131209265 \
  -H "Content-Type: application/json" | jq

RECIPIENTS
curl -X POST http://localhost:3000/recipients \
  -H "Content-Type: application/json"

CONTACTS
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" | jq
*/


const SM_ACCESS_TOKEN = process.env.SM_ACCESS_TOKEN;
const PORT = process.env.PORT || 3000;
const SM_API_BASE = 'https://api.surveymonkey.com/v3';

const authHeader = {
    headers: {
        "Authorization": `Bearer ${SM_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
};
const surveyId= "400070630"  // Survey from the prompt
const collectorId= "438164091" // New collector, can be reused
const contactId = "7543339311" // Joshua's person email
const messageId = "131230953" // update this string when you create a new message to send
const messageSendingDate = "2024-12-05T10:00:00-08:00" // update according to interview time

// surveys
app.get('/surveys', async (req, res) => {
    try {
        const response = await axios.get(
            `${SM_API_BASE}/surveys`,
            authHeader
        );
        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

app.get('/surveys/:id', async (req, res) => {
    try {
        const response = await axios.get(
            `${SM_API_BASE}/surveys/${req.params.id}`,
            authHeader
        );
        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

// Collectors
app.get('/collectors', async (req, res) => {
    try {
        const response = await axios.get(
            `${SM_API_BASE}/surveys/${surveyId}/collectors`,
            authHeader
        );
        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
})

app.get('/collector/', async (req, res) => {
    try {
        const response = await axios.get(
            `${SM_API_BASE}/collectors/${collectorId}`,
            authHeader
        );
        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
})

app.post('/collector', async (req, res) => {
    try {
        const response = await axios.post(
            `${SM_API_BASE}/surveys/${surveyId}/collectors/`,
            {
                type: 'email',
                name: 'Newest Collector',
            },
            authHeader
        );
        const collector = response.data;

        res.json({ collector });
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

// Messages
app.get('/messages', async (req, res) => {
    try {
        const response = await axios.get(
            `${SM_API_BASE}/collectors/${collectorId}/messages`,
            authHeader
        )
        res.json( response.data );
    } catch (err) {
        res.status(err.response?.status || 500).json({error: err.response?.data || err.message});
    }
})

app.post('/message', async (req, res) => {
    try {
        const response = await axios.post(
            `${SM_API_BASE}/collectors/${collectorId}/messages`,
            {
                type: "invite",
                subject: "Please help me by taking my survey",
                body_text: "Thank you in advance for taking my survey. [PrivacyLink] [SurveyLink], [OptOutLink], [FooterLink]",
            },
            authHeader
        );
        const message = response.data;
        res.json({ message });
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message, details: err.response?.data });
    }
});

app.post(`/send-message`, async ( req, res) => {
    try{
        const response = await axios.post(
            `${SM_API_BASE}/collectors/${collectorId}/messages/${messageId}/send`,
            {
                scheduled_date: messageSendingDate
            },
            authHeader
        )
        res.json(response.data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
})

app.post('/clone-message/:collectorId/:messageId', async (req, res) => {
    const {collectorId, messageId} = req.params;
    try {
        const newMessage = await cloneMessage(collectorId, messageId);
        console.log("TESTING2")
        res.json({ success: true, newMessage });
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
    }
});

// Recipients
app.post('/recipients', async (req, res) => {
    try {
        const response = await axios.post(
            `${SM_API_BASE}/collectors/${collectorId}/messages/${messageId}/recipients`,
            {
                contact_id: contactId,
            },
            authHeader
        );
        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
    }
})

// Contacts
app.post('/contact', async (req, res) => {
    try{
        const response = await axios.post(
            `${SM_API_BASE}/contacts`,
            {
                "first_name": "Joshua",
                "last_name": "Goss",
                "email": "Joshuagosst@gmail.com",
                "custom_fields": {
                    "1": "Mr",
                    "2": "Company",
                    "3": "Address",
                    "4": "City",
                    "5": "Country",
                    "6": "Phone Number"
                }
            },
            authHeader
        );
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
})

// APP
app.get('/', (req, res) => {
    console.log(Date.now())
    res.send('SurveyMonkey API Test App is running');
});

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
