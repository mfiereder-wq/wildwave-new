# WILDWAVE Landing Page - PRD

## Original Problem Statement
"Kannst du diese Webseit verbessern und professionell machen" - Redesign der WILDWAVE Digitalagentur Landingpage mit modernem, minimalistischem Design.

## User Choices
1. **Design-Richtung**: Modern & minimalistisch (viel Weißraum, clean)
2. **Priorität**: Hero-Bereich & erster Eindruck
3. **Zusätzliche Funktion**: Kontaktformular

## Company Info
- **Name**: WILDWAVE
- **Type**: Digitalagentur
- **Location**: Im Isengrind 35, 8046 Zürich, Schweiz
- **Phone**: +41 78 263 04 06
- **Email**: info@wildwave.ch
- **Services**: Webdesign, SEO, Marketing

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Design**: Swiss Minimalist (Outfit + Manrope fonts)

## What's Been Implemented

### Initial Implementation (2026-04-17)
- Modern minimalist landing page with Swiss design
- Hero section with animated typography
- Services section (Webdesign, SEO, Marketing)
- Contact form with backend API integration
- Responsive design
- Smooth scroll navigation

### Iteration 2 (2026-04-17)
- ✅ Statistics section removed
- ✅ Swiss DSG compliant cookie banner with localStorage persistence
- ✅ Professional logo with geometric icon element

### Iteration 3 (2026-04-17)
- ✅ Video im Hero-Bereich (ersetzt Bild)
- ✅ Impressum Modal (Swiss DSG compliant)
- ✅ Datenschutzerklärung Modal

### Iteration 4 (2026-04-17)
- ✅ Neues Logo-Bild (WildWave W-Icon)
- ✅ Video mit Ton abspielbar (controls, nicht muted)
- ✅ Impressum vereinfacht (UID/Mehrwertsteuer entfernt)

## Core Features
1. **Header**: Fixed navigation with WildWave logo
2. **Hero**: Large typography, CTA buttons, video with sound
3. **Services**: 3 service cards with features list
4. **Über uns**: Company description with image
5. **Contact**: Form with validation, API integration
6. **Footer**: Company info, navigation, Impressum/Datenschutz links
7. **Cookie Banner**: DSG compliant with consent management
8. **Impressum**: Legal information modal
9. **Datenschutzerklärung**: Privacy policy modal

## API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin)

## Next Action Items / Backlog
- P1: Portfolio/Referenzen-Galerie hinzufügen
- P2: Testimonials/Kundenbewertungen
- P2: Mehrsprachigkeit (DE/FR/EN)
- P3: Dark Mode Toggle
- P3: Blog Integration
