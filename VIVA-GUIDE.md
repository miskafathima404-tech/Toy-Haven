# Toy Haven — COMP40053 Viva Guide

## Important design decision
This website keeps the **Toy Haven concept from the assignment**:
collectible figurines, toys, board games and diecast model cars.

The redesign changes the **visual identity**, including:
- colour palette
- product names
- product artwork
- typography/layout feel
- hero presentation
- card styling

This means the site is based on the assignment scenario rather than becoming a different business concept.

## The six required pages

### 1. Home
Explain:
"The Home page introduces Toy Haven using a promotional hero, category shortcuts, featured products, a Product of the Day and a newsletter form."

### 2. Product Listing
Explain:
"The product page renders products from the JavaScript PRODUCTS array. Users can search by name, filter by category, open a product modal and add products to the cart."

### 3. Shopping Cart
Explain:
"The cart is stored in localStorage. JavaScript reads the stored product IDs and quantities, displays each item, calculates subtotals and calculates the final total."

### 4. Checkout
Explain:
"Checkout collects the customer's name, email, delivery address and payment method. The form is validated before the order is stored in localStorage. After success, the cart is cleared."

### 5. Wishlist / Collection
Explain:
"Products can be saved to the collection. Each saved product can have the required status: Interested, Owned or Not Interested."

### 6. Feedback & Support
Explain:
"The support page validates Name, Email and Message, stores feedback in localStorage and uses a JavaScript accordion for FAQs."

## JavaScript questions

### Why use localStorage?
"Because the assignment is a front-end-only website, localStorage gives the browser a simple way to persist user interactions without a backend."

### Why separate products-data.js?
"It keeps product information separate from the main application logic and lets multiple pages reuse the same product objects."

### What is a reusable function?
"`card()` creates the same product-card structure wherever it is needed, while functions such as `total()` and `updateCartCount()` are reused by different page sections."

### How does filtering work?
"JavaScript listens for clicks on category buttons, stores the selected category, filters the PRODUCTS array and then redraws the product grid."

### How does search work?
"The search input has an input event listener. Each time the user types, the product array is filtered using the product name."

### How does the cart work?
"The cart stores an array containing product IDs and quantities. When a user adds an item, the quantity is increased if it already exists; otherwise a new item is added."

### How does the Product of the Day work?
"The code uses the current day and the number of products to choose a product automatically. This demonstrates the required Product of the Day logic without manually changing the HTML."

### How does checkout validation work?
"The HTML required/type attributes provide basic browser validation, and JavaScript checks form validity before creating the order."

### How does the FAQ work?
"Each FAQ button has a click event listener. The clicked FAQ receives an open class, and CSS displays its answer."

## HTML/CSS questions

### Why semantic HTML?
"Semantic elements such as header, nav, main, section, form and footer make the structure clearer and improve accessibility."

### How is responsive design implemented?
"I use CSS Grid and Flexbox for layouts and media queries to change the number of columns and navigation behaviour on smaller screens."

### What animations are included?
"Hero rotation, hover transitions, scroll reveal and the checkout success animation provide visual feedback."

## Assignment alignment
The brief requires six functional pages, responsive design, product filtering/search, cart persistence, checkout handling, wishlist statuses, validated support feedback, FAQ interaction, animations, localStorage and reusable JavaScript functions. This project keeps those requirements while changing the visual design and product presentation.

## One short viva summary
"My website is a responsive Toy Haven e-commerce front end built with HTML, CSS and JavaScript. Product data is stored in a JavaScript array, reusable functions generate product content, and localStorage persists cart, collection, feedback, newsletter and order data. I used Grid, Flexbox and media queries for responsiveness, plus JavaScript event listeners for filtering, search, cart controls, checkout validation, the wishlist and FAQ accordion."


## New visual theme
"The redesign uses a midnight-blue base with electric cyan, lime, violet and pink accents. I also changed the hero banner artwork. The Toy Haven concept and the four required categories remain the same because those come from the assignment brief."

## New Pink + Blue Visual Theme
The redesigned interface uses the requested Toy Haven palette:
- Navy `#243B6B` for navigation, headings and strong text.
- Sky Blue `#5BC0EB` for hero areas and secondary UI.
- Bright Yellow `#FDE74C` for calls-to-action and playful highlights.
- Pink `#F45B69` as the main page background.
- `#F7F9FC` and white for readable content surfaces.

The design is intentionally different from the previous cream/pastel layout: the page now uses a pink canvas, navy navigation, a large sky-blue hero, yellow CTA buttons, and white content panels.

## Orange + Coral Visual Theme
The redesigned Toy Haven interface uses the requested palette:
- Orange `#FF9F43` for primary actions and highlights.
- Coral `#FF6B6B` as the main page background.
- Cream `#FFF3CD` for warm accent panels.
- Brown `#8B5E3C` for navigation, headings and strong text.
- Background `#FFF9F2` for clean content surfaces.

The layout remains the Toy Haven assignment concept and keeps the existing HTML/JavaScript functionality, while the visual system and artwork colours are changed.

## White + Blue Visual Theme
The redesigned Toy Haven interface uses a clean white-and-blue palette:
- Main blue `#2563A6` for navigation, headings and primary buttons.
- Sky blue `#4FADE0` for accents and secondary actions.
- Soft blue `#DCEEFF` for hero and category areas.
- Deep blue `#17324D` for readable text and the footer.
- White `#FFFFFF` for the main page and content cards.

The redesign keeps the Toy Haven assignment structure and existing functionality while changing the visual presentation to a cleaner, more professional white-and-blue style.
