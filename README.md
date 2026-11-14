# Supabase and Expo Setup

This guide contains the commands needed to install Supabase, configure Babel, and prepare Metro for your Expo project.

---

## 1. Install the Required Packages

Run the following commands in your project terminal:

### Install Supabase

```bash
npm install @supabase/supabase-js
```

### Install Babel Preset Expo

```bash
npx expo install babel-preset-expo
```

---

## 2. Customize Babel and Metro Configuration

Run the following commands to generate or customize the required configuration files.

### Babel Configuration

```bash
npx expo customize babel.config.js
```

### Metro Configuration

```bash
npx expo customize metro.config.js
```

---

## 3. Summary of Commands

For convenience, here are all the commands in one place:

```bash
npm install @supabase/supabase-js
npx expo install babel-preset-expo

npx expo customize babel.config.js
npx expo customize metro.config.js
```

# Project Structure
# OrgFinder

```text
OrgFinder/
├── .claude/
├── app/
├── assets/
│   ├── app-icon.svg
│   └── profile-mascot.svg
├── components/
├── library/
│   ├── supabase.js
│   └── testConnection.js
├── pages/
└── services/
    └── googleAuthServices.js