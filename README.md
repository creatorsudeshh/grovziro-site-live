# Grovziro Solutions website

A responsive, static five-page website built with HTML, CSS, and vanilla JavaScript. It is designed for service enquiries and consultation bookings, with no shop, cart, or checkout.

## Pages

- `index.html` — Home
- `services.html` — Services
- `work.html` — Work and proof approach
- `about.html` — About
- `contact.html` — Free-call enquiry form

## Before publishing

The exact domain and Cal.com booking link have not been provided. Add the approved booking URL in `assets/site-config.js` before publishing; all “Book a free call” links will use it. The public contact email is configured there. The contact form opens the visitor's email app with their enquiry addressed to Grovziro; they must press Send to deliver it. Automatic delivery requires a form service or backend.

To finish booking setup, create a 30-minute personal event in Cal.com, set your availability and meeting location, then add its share link as `bookingUrl` in `assets/site-config.js`.

The Work page intentionally contains no fabricated client results or testimonials. Add approved case-study details and images when they are available. The current logo is a text-based placeholder and can be replaced with Grovziro's supplied logo.

## Preview

Open `index.html` in a browser, or serve this folder with any static web server. No build step or package install is required.
