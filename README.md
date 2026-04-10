# 🔍 Apollo Company Search

A full-stack application to search for companies and contacts by **industry** and **city** using the [Apollo.io](https://www.apollo.io/) API.

| Layer    | Tech           |
| -------- | -------------- |
| Frontend | React + Vite   |
| Backend  | Python FastAPI |
| API      | Apollo.io      |

---

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Template for API key
│
├── frontend/
│   ├── index.html           # Entry HTML
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite config
│   └── src/
│       ├── main.jsx          # React mount point
│       ├── App.jsx           # Main component
│       └── index.css         # Styles
│
└── README.md
```

---

## ⚙️ Prerequisites

- **Python 3.9+** → [Download](https://www.python.org/downloads/)
- **Node.js 18+** → [Download](https://nodejs.org/)
- **Apollo.io API key** → [Get one here](https://www.apollo.io/)

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create your .env file (copy the example and add your API key)
copy .env.example .env
# Then open .env and replace your_apollo_api_key_here with your real key

# Start the backend server
uvicorn main:app --reload --port 8000
```

The API will be running at **http://localhost:8000**.  
You can check it at http://localhost:8000 (should show a health-check message).

### 2. Frontend Setup

```bash
# Navigate to the frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the dev server
npm run dev
```

The React app will open at **http://localhost:3000**.

---

## 🎯 How to Use

1. Open http://localhost:3000 in your browser.
2. Enter an **Industry** (e.g. `Technology`, `Healthcare`).
3. Enter a **City** (e.g. `San Francisco`, `New York`).
4. Click **Search**.
5. View company names and contact details in the results.

---

## 🔗 API Reference

### `GET /search`

| Parameter  | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| `industry` | string | ✅       | Industry tag (e.g. "Technology")    |
| `city`     | string | ✅       | City name  (e.g. "San Francisco")  |

**Example:**

```
http://localhost:8000/search?industry=Technology&city=San+Francisco
```

**Response:**

```json
{
  "results": [
    {
      "company_name": "Acme Corp",
      "contact_name": "Jane Doe",
      "contact_title": "CTO",
      "contact_email": "jane@acme.com",
      "contact_phone": "+1 555-0100",
      "company_website": "https://acme.com",
      "linkedin_url": "https://linkedin.com/in/janedoe"
    }
  ],
  "total": 1
}
```

---

## ❗ Troubleshooting

| Issue                        | Solution                                                        |
| ---------------------------- | --------------------------------------------------------------- |
| CORS errors in browser       | Make sure the backend is running on port 8000                   |
| "APOLLO_API_KEY is not set"  | Create `backend/.env` with your key                             |
| Apollo API returns 401       | Your API key may be invalid or expired                          |
| Frontend can't connect       | Ensure both servers are running simultaneously in two terminals |
