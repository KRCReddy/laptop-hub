# Design Guidelines: Laptop Shop Service Center

## Design Approach

**Hybrid Approach:** E-commerce functionality meets modern SaaS aesthetics
- **Primary References:** Apple's product pages (clean presentation), Shopify (product cards), Linear (admin interface)
- **Design System Base:** Tailwind with custom component patterns
- **Core Principles:** 
  - Information clarity over decoration
  - Trust-building through professional presentation
  - Efficient product discovery with intelligent visual hierarchy

---

## Typography

**Font Stack:**
- **Primary:** Inter (Google Fonts) - body text, UI elements, specs
- **Display/Headers:** Space Grotesk (Google Fonts) - hero headlines, section titles
- **Monospace:** JetBrains Mono - product IDs, technical specs

**Hierarchy:**
- Hero headline: text-5xl md:text-6xl font-bold (Space Grotesk)
- Section headers: text-3xl md:text-4xl font-bold
- Product titles: text-xl font-semibold
- Body text: text-base leading-relaxed
- Spec labels: text-sm font-medium uppercase tracking-wide
- Price: text-2xl md:text-3xl font-bold

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: gap-2, p-4
- Component padding: p-6, p-8
- Section spacing: py-12, py-16, py-20
- Container max-width: max-w-7xl

**Grid System:**
- Product cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Filter sidebar: Fixed 280px width on desktop, full-width drawer on mobile
- Product detail: 60/40 split (image gallery / specs)

---

## Component Library

### Navigation
**Header:** Sticky top navigation with shop logo left, search bar center (desktop only), cart/inquiry count right
- Height: h-16 md:h-20
- Search bar expands to full modal on mobile
- Include "Admin" link in footer only

### Product Cards
**Structure:** Vertical card with hover elevation
- Image container: aspect-square with object-cover
- Floating badge for "Best Match" or purpose tags (top-right)
- Model name + brand (truncate at 2 lines)
- Key specs grid: 2x2 (RAM, Storage, CPU, Screen) with icons
- Price prominent at bottom with "Add to Inquiry" button
- Padding: p-4, rounded-xl border

### Filters Panel
**Desktop:** Fixed sidebar with collapsible sections
- Each filter group: Accordion with chevron icon
- Multi-select checkboxes with counts: "Gaming (12)"
- Price range: Dual-thumb slider with input fields
- Active filters: Chip badges at top with X to clear
- "Clear All" and "Apply Filters" buttons sticky at bottom

**Mobile:** Bottom sheet drawer triggered by "Filters" button
- Same content, full-screen overlay
- Close button top-right

### Product Detail Page
**Layout:**
- Left: Image gallery (main large image + 4 thumbnail strip below)
- Right: Sticky panel with model, price, specs table, CTAs
- Below: Full description, similar products carousel (4 cards)

**Specs Table:**
- Two-column layout with alternating row styling
- Icon + Label + Value format
- Grouped sections: Performance, Display, Storage, Connectivity

### Inquiry System
**Cart/Inquiry List:** Slide-out panel from right
- Mini product cards with remove button
- Form fields: Name, Phone, Email, Message (textarea)
- Submit button with loading state
- Success confirmation with animation

### Admin Interface
**Dashboard Layout:**
- Sidebar navigation: Products, Inquiries, Settings
- Data table with search, filters, pagination
- Action buttons: Edit (icon), Delete (icon with confirm modal)
- Add Product: Full-page form with image URL inputs, multi-select purpose tags

---

## Page-Specific Guidelines

### Landing/Search Page
**Hero Section:** Full-width, height: 60vh
- Large headline: "Find Your Perfect Laptop"
- Subheadline: "Expert recommendations based on your needs"
- Quick preset buttons (3 large cards): Under ₹50k, Gaming, Student
- Background: Gradient mesh with floating laptop imagery (subtle, not distracting)

**Main Section:**
- Two-column layout: Filters (25%) + Results (75%)
- Results header: Count + Sort dropdown + View toggle (grid/list)
- Empty state: Helpful illustration + "Try adjusting filters" message

### Product Detail
**Hero:** Large product image with zoom functionality
- Breadcrumb navigation above
- Floating "Inquiry" button (fixed bottom on mobile)

**Similar Products:** Horizontal scroll carousel
- 4-5 cards visible, arrows for navigation
- "Why similar" tooltip on hover

### Admin Pages
**Minimal aesthetic:** Focus on data density and efficiency
- Clean tables with sorting column headers
- Inline editing for quick updates
- Toast notifications for actions
- Confirmation modals for destructive actions

---

## Images

**Hero Section:** YES - Large hero image
- Composite image showing variety of laptops (workspace setup or lineup)
- Placement: Background with gradient overlay for text readability
- Buttons on hero: Glass-morphism background blur effect (backdrop-blur-md with semi-transparent background)

**Product Images:**
- Cards: Square aspect ratio, centered product on white/transparent background
- Detail page: High-resolution with zoom capability
- Similar products: Consistent square thumbnails

**Placeholder Strategy:**
- Use Unsplash API for laptop images: `https://source.unsplash.com/400x400/?laptop,{brand}`
- Alt text: "{Brand} {Model} - {Primary Purpose}"

---

## Interactions & States

**Hover Effects:**
- Product cards: Subtle lift (translate-y-1) + shadow increase
- Buttons: Brightness/opacity shift with smooth transitions
- Filter checkboxes: Border accent on hover

**Loading States:**
- Skeleton screens for product grids
- Spinner for form submissions
- Progress bar for filter application

**Responsive Breakpoints:**
- Mobile: < 768px (single column, drawer filters)
- Tablet: 768px - 1024px (2 column grid)
- Desktop: > 1024px (4 column grid, sidebar filters)

---

**Critical Success Factors:**
- Filter panel must be instantly accessible without hunting
- Product cards must show 4-5 key specs at a glance
- Price and "Add to Inquiry" must be visually prominent
- Admin interface should feel fast and uncluttered
- Match score/reason must be immediately visible on relevant products