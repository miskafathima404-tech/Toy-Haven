# Toy Haven - Test Cases

This checklist is based on the COMP40053 Assignment 3 testing requirements.

| ID | Test | Expected result | Status |
|---|---|---|---|
| TC01 | Open Home page | Home page loads with navigation, hero and Product of the Day | To test |
| TC02 | Wait on Home hero | Promotional content changes automatically | To test |
| TC03 | Click Shop Now | Products page opens | To test |
| TC04 | Search for a product | Matching product cards are shown | To test |
| TC05 | Select a category | Only products from that category are shown | To test |
| TC06 | Click View on a product | Product modal opens | To test |
| TC07 | Add a product to cart | Cart count increases | To test |
| TC08 | Refresh Products/Cart page | Cart data remains because localStorage is used | To test |
| TC09 | Change cart quantity | Quantity and subtotal update | To test |
| TC10 | Clear cart | All cart items are removed | To test |
| TC11 | Checkout with empty cart | Checkout cannot complete | To test |
| TC12 | Submit invalid checkout form | Validation messages appear | To test |
| TC13 | Submit valid checkout form | Success message appears, cart clears and order history is saved | To test |
| TC14 | Add product to wishlist | Product is saved to collection | To test |
| TC15 | Change wishlist status | Interested / Owned / Not Interested selection is stored | To test |
| TC16 | Submit invalid feedback | Validation messages appear | To test |
| TC17 | Submit valid feedback | Confirmation appears and feedback is stored | To test |
| TC18 | Open FAQ question | Answer expands/collapses with JavaScript | To test |
| TC19 | Resize to mobile | Layout remains usable and hamburger menu works | To test |
| TC20 | Open manifest/service worker | PWA files are present and register when served through a suitable server | To test |
| TC21 | W3C HTML validation | No HTML errors after final edits | To test |
| TC22 | W3C CSS validation | No CSS errors after final edits | To test |
| TC23 | WAVE accessibility | Review and fix reported accessibility issues | To test |
| TC24 | Lighthouse Desktop | Review Performance, Accessibility, Best Practices and SEO | To test |
| TC25 | Lighthouse Mobile | Review mobile Performance, Accessibility, Best Practices and SEO | To test |

## Browser/device checks

Test at minimum:
- Mobile width
- Tablet width
- Desktop width

Check navigation, product cards, forms, cart controls and checkout at each size.

## Important

The checkout is a front-end simulation. No real card payment is processed.
