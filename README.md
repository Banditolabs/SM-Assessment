# 🧠 SurveyMonkey API Local Integration

This project is a lightweight Express-based Node.js app for exploring and interacting with the [SurveyMonkey API v3](https://developer.surveymonkey.com/api/v3/).  
It provides a local REST interface to create, manage, and send surveys, collectors, messages, recipients, and contacts — all using `curl` or your favorite HTTP client.

---

## 🚀 Features

- View and manage **surveys**, **collectors**, and **messages**
- Create and schedule survey **email invitations**
- Clone existing messages between collectors
- Add **contacts** and assign **recipients**
- Send or schedule messages via SurveyMonkey API
- Uses environment variables to protect sensitive credentials
- Fully instrumented with clean error handling and JSON responses

---

## 🛠 Tech Stack

- **Node.js** + **Express**
- **Axios** for API calls
- **dotenv** for environment configuration
- **jq** (optional) for pretty-printing JSON in the terminal

---

## 📦 Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/surveymonkey-api-local.git
cd surveymonkey-api-local
