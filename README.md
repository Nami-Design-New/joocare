#  Next.js Project

A simple Next.js project using npm.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

---

##  Environment Variables

This project uses environment variables for configuration.

### 1. Create your env file

Copy the example file:

```bash
cp .env.example .env.local
```

---

### 2. Update values

Open `.env.local` and fill in the required values:


```

 **Important:**

* Do NOT commit `.env.local`
* Keep your secrets private

---

## Running the Project

### Start development server

```bash
npm run dev
```

Then open:
  http://localhost:3000

---

### Build for production

```bash
npm run build
```

---

### Start production server

```bash
npm run start
```

---

### Run linter

```bash
npm run lint
```

---

## Scripts Summary

```bash
npm run dev      # Run development server
npm run build    # Create production build
npm run start    # Run production server
npm run lint     # Run code linter
```

---

##  Notes

* Make sure `.env.local` exists before running the app
* Restart the server after changing environment variables

---
