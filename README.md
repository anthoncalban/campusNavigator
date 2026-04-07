# 🧭 NEU Campus Navigator

A **Progressive Web App (PWA)** designed to help freshmen, faculty, and visitors easily navigate **NEU’s campus**.  
By entering a room code (e.g., `M410B`) into the search bar, the app instantly translates it into clear building, floor, and room information — complete with seating, capacity, and available facilities.  
Beyond room codes, the app also provides **faculty directories, building guides, and popular spots** to make campus navigation simple and accessible.

🔗 **Live Demo:** [NEU Campus Navigator](https://room-navigator.vercel.app/)

---

## 📖 Project Statement
NEU Campus Navigator focuses on **clarity, accessibility, and ease of use** — ensuring that new students, faculty, and visitors can confidently find their way around campus.  
It reduces confusion during the first weeks of school by translating codes into plain language, while also serving as a **directory of faculties, buildings, and events**.

---

## ✨ Features
- **Room Code Translation** — enter a code like `M410B` and instantly see building name, floor, and room number.  
- **Room Details** — capacity, seating, and inventory (e.g., projector, whiteboard, air conditioning).  
- **Faculty & Building Directory** — browse faculties and buildings directly without typing codes.  
- **Legend Guide** — quick reference for building abbreviations:  
  - `M` = Main Building  
  - `SOM` = School of Management  
  - `PSB` = Professional School Building  
  - `IS` = Integrated School  
- **Popular Spots** — shortcuts to frequently searched rooms and faculty offices.  
- **Progressive Web App (PWA)** — installable on mobile devices for native‑like experience.  
- **Fast Deployment** — lightweight front‑end hosted on **Vercel** for easy access.  

---

## 🔄 Application Flows

### 1. Room Code Translation (Search Bar)
**Purpose:** Core feature for freshmen navigation  
**Steps:**  
1. User enters a room code in the search bar (e.g., `M410B`)  
2. System parses building abbreviation, floor, and room number  
3. Display clear output: *Main Building, 4th Floor, Room 410*  
4. Show extra details: capacity, seating, and inventory  

### 2. Faculty & Building Directory
**Purpose:** Helps users explore faculties and buildings  
**Steps:**  
1. User selects a faculty or building from the directory  
2. System displays building details and available rooms  
3. Provides quick navigation shortcuts  

### 3. Popular Spots
**Purpose:** Quick access to common rooms and faculty offices  
**Steps:**  
1. User taps a shortcut (e.g., `SOM201`)  
2. System jumps directly to room/faculty details  

---

## 🛠 Tech Stack
| Layer      | Technology            |
|------------|-----------------------|
| Frontend   | React, TypeScript, Vite |
| Styling    | CSS (index.css)       |
| Hosting    | Vercel                |

---

## 📱 PWA Installation
- **Android (Chrome)** & **iOS (Safari)**:  
  1. Open the app link  
  2. Add to Home Screen  
  3. Free to use anytime  

---

## 🚀 Future Enhancements
- Smart search with autocomplete and typo handling  
- Outdoor routing between buildings  
- Event overlays for seminars, sports fest, and club activities  
- Accessibility routes for ramps and safe pathways  
- Favorites/bookmarks for personalized navigation  

---

## ⚖️ License
**Academic Integrity & Copyright Notice**  
This project was developed for academic purposes at **NEU**.  
Unauthorized copying, adaptation, distribution, or commercial use is strictly prohibited.
