# MS-PRO_Ecosystems Design Guidelines

## Design Approach
**System**: Custom B2B Industrial Design inspired by Stripe, Linear, and enterprise SaaS platforms
**Rationale**: Industrial services require trust, professionalism, and clear conversion paths. The design prioritizes credibility and lead generation over decorative elements.

## Core Design Principles
1. **Trust Through Clarity**: Clean layouts with clear information hierarchy
2. **Conversion-Focused**: Every section guides users toward quote requests
3. **Technical Professionalism**: Showcase expertise through structured content
4. **Mobile-First**: Field managers and contractors access on tablets/phones

---

## Color Palette

### Light Mode
- **Primary Brand**: 220 85% 35% (Deep professional blue - industrial trust)
- **Secondary**: 220 15% 25% (Charcoal gray - technical authority)
- **Accent**: 142 70% 45% (Industrial green - safety/protection connotation)
- **Background**: 0 0% 98% (Off-white)
- **Surface**: 0 0% 100% (White cards)
- **Text Primary**: 220 15% 20%
- **Text Secondary**: 220 10% 50%

### Dark Mode
- **Primary Brand**: 220 75% 55%
- **Secondary**: 220 15% 85%
- **Accent**: 142 60% 55%
- **Background**: 220 15% 10%
- **Surface**: 220 15% 15%
- **Text Primary**: 220 15% 95%
- **Text Secondary**: 220 10% 70%

---

## Typography

### Font Families
- **Primary**: Inter (via Google Fonts) - clean, professional, excellent Russian character support
- **Headings**: Inter 600-700 (Semi-bold to Bold)
- **Body**: Inter 400-500 (Regular to Medium)

### Type Scale
- **Hero Heading**: text-5xl md:text-6xl lg:text-7xl font-bold
- **Section Heading**: text-3xl md:text-4xl font-semibold
- **Subsection**: text-2xl md:text-3xl font-semibold
- **Card Title**: text-xl font-semibold
- **Body Large**: text-lg font-normal
- **Body**: text-base font-normal
- **Small**: text-sm font-normal
- **Caption**: text-xs font-medium uppercase tracking-wide

---

## Layout System

### Spacing Units
Core spacing: **4, 8, 12, 16, 24, 32** (p-4, gap-8, mt-12, py-16, mb-24, pt-32)
- Use sparingly: p-2, p-6 for fine-tuning
- Maintain consistent vertical rhythm with py-16 md:py-24 for sections

### Grid & Containers
- **Max Width**: max-w-7xl (1280px) for main content
- **Content Width**: max-w-4xl for text-heavy sections
- **Grid Patterns**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8

---

## Component Library

### Navigation
- **Desktop**: Horizontal nav with logo left, links center, CTA button right
- **Mobile**: Hamburger menu, full-screen overlay
- **Sticky header** with subtle shadow on scroll

### Hero Section
- **Layout**: Two-column split - left: headline + CTA, right: industrial imagery/video
- **Height**: min-h-[600px] lg:min-h-[700px]
- **CTA**: Primary button "Рассчитать стоимость" + secondary "Узнать больше"
- **Trust indicators**: "20+ лет опыта" | "500+ объектов" | "Гарантия качества"

### Service Cards
- **Style**: White cards with subtle shadow, hover lift effect
- **Icon**: 48x48px industrial icons (from Heroicons or custom)
- **Structure**: Icon → Title → Description → Link
- **Grid**: 3 columns desktop, 1 column mobile

### Calculator Module
- **Design**: Multi-step form in card container
- **Progress**: Visual step indicator (1/4, 2/4, etc.)
- **Inputs**: Large touch targets (min 44px height), clear labels
- **Output**: Prominent price display with breakdown
- **CTA**: "Получить точный расчет" leads to contact form

### Lead Forms
- **Layout**: Single column, max-w-md, centered or in 2-column grid with info
- **Fields**: Name, Phone (with mask), Email, Service Type (dropdown), Message
- **Validation**: Inline error messages, green success states
- **Submit Button**: Full-width, prominent, disabled state during submission
- **Privacy**: Small text "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности"

### MSPRO Quad Presentation
- **Hero**: Full-width image of coating application with overlay text
- **Features Grid**: 4-6 technical benefits with icons
- **Before/After**: Side-by-side comparison images
- **Technical Specs**: Table or accordion with detailed properties
- **CTA Section**: Request sample or consultation

### Footer
- **Structure**: 4-column layout (desktop), stacked (mobile)
  - Column 1: Logo + brief description
  - Column 2: Services links
  - Column 3: Company info (about, contacts, certificates)
  - Column 4: Contact form or subscription
- **Bottom Bar**: Copyright, privacy policy, social links

---

## Images

### Required Images
1. **Hero Section**: Industrial chimney/tower painting in progress (workers on height), conveys expertise and scale - full-width background with overlay
2. **Service Cards**: Icons representing each service (anti-corrosion, painting, MSPRO Quad)
3. **MSPRO Quad Section**: Product application photos, coating close-ups, before/after comparisons
4. **Trust Section**: Completed project photos, certificates, team in safety gear
5. **About/Team**: Facility photos, equipment, safety certifications

### Image Treatment
- Subtle overlays (rgba(0,0,0,0.4)) on hero backgrounds for text readability
- Rounded corners (rounded-lg) on card images
- Aspect ratios: 16:9 for featured images, 1:1 for team/icons, 4:3 for project galleries

---

## Page Structure (SEO Pages)

### Typical Layout
1. **Hero** (80vh): Service-specific headline, description, dual CTAs, background image
2. **Trust Bar**: Client logos or stats (py-12)
3. **Features/Benefits**: 3-column grid of service advantages (py-24)
4. **How It Works**: Timeline or step process (py-24)
5. **Calculator CTA**: Prominent section with calculator preview (py-32, bg-accent/10)
6. **Case Studies**: 2-3 featured projects with images (py-24)
7. **FAQ**: Accordion component (py-24)
8. **Final CTA**: Contact form + contact info in 2-column layout (py-32)

---

## Animations
**Minimal use**: Subtle fade-in on scroll for cards, smooth transitions on hover states. Avoid distracting motion - this is B2B industrial.

---

## Accessibility & Responsiveness
- All forms fully functional in dark mode with proper contrast
- Touch targets minimum 44x44px
- Focus states visible with outline-offset-2
- ARIA labels on all interactive elements
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)