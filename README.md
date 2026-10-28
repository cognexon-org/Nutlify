# Nutlify store (Next.js + MongoDB + Razorpay)

The NUVANA website as a working online shop: the same design, plus a cart, checkout with Razorpay,
order tracking for customers, and an admin panel for orders and products.

## What's inside
- **Shop:** add to cart from Packs and Gifting, cart drawer, checkout with address form, Razorpay payment (UPI, cards, net banking, wallets), order page with live status and tracking.
- **Payments done safely:** prices and stock are always re-checked on the server; Razorpay signatures are verified; a webhook confirms payments even if the customer closes the page; stock goes down exactly once per paid order.
- **Admin panel (`/admin`):** dashboard (today’s and this month’s sales, orders to pack, low stock), orders list with search, filter and CSV download, order page (status, courier and tracking, history), products (price, stock, show/hide, enquiry-only, add new), coupons.
- **Coupon codes:** percentage or fixed-amount discounts, with optional minimum order, maximum discount, start and end dates, total-use limit and one-use-per-customer. Customers apply them at checkout; the server re-checks them before payment, and a use is only counted once the order is paid.
- **Continue with Google:** customers can sign in with Google (Firebase Authentication). Firebase stores the login; the customer record, orders and saved address are kept in MongoDB. Signed-in customers get pre-filled checkout and an **Account** page with their orders. Guest checkout still works.
- **WhatsApp enquiries:** gifting, bulk orders, feedback and order questions open WhatsApp (+91 78602 74086). Change the number in `src/config/site.js`.
- **Policy pages** Razorpay asks for: shipping, refunds, terms, privacy, contact (`/policies/...`).

## 1. Install
Needs Node.js 20.6 or newer.
```bash
npm install
cp .env.example .env.local
```

## 2. MongoDB Atlas (free tier is fine)
1. Create a cluster at mongodb.com/atlas.
2. Database Access: add a user with a password.
3. Network Access: add your IP (and later your hosting provider; `0.0.0.0/0` works but is less strict).
4. Connect > Drivers: copy the connection string into `MONGODB_URI` in `.env.local`, with `/nutlify` before the `?` as the database name.
5. Add the starting products:
```bash
npm run seed
```
Running it again never overwrites prices or stock you’ve changed in the admin panel.

## 3. Admin login
`.env.example` is already set up for **admin@gmail.com / admin123**, so after copying it to `.env.local` you can sign in at `/admin`.

**Change the password before the site goes live.** The admin panel shows customers’ names, phone numbers and addresses, and admin123 is one of the first passwords attackers try:
```bash
npm run hash-password -- "a-long-password-you-will-remember"
```
Copy the `.env.local` line it prints into `.env.local` (and the plain version into Vercel).

Set `AUTH_SECRET` to a long random string, for example from:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Razorpay
1. In the Razorpay Dashboard switch to **Test mode**, then Account & Settings > API Keys > Generate. Put them in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
2. Account & Settings > Payment capture: make sure **automatic capture** is on.
3. Webhooks (after the site is online, step 6): add `https://YOUR-DOMAIN/api/razorpay/webhook` with the events `payment.captured`, `order.paid` and `payment.failed`. Use the same secret as `RAZORPAY_WEBHOOK_SECRET`.

## 4b. Continue with Google (Firebase)
Your Firebase project is `nutlify-89882` and Google is already enabled under Authentication > Sign-in method.
1. **Register a web app.** Firebase console > the gear icon > **Project settings** > **General** > *Your apps* > click the **</>** (Web) icon. Nickname: `Nutlify website`. Leave “Firebase Hosting” unticked. Click **Register app**.
2. **Copy the config.** Firebase shows a `firebaseConfig` block (you can find it again later under Project settings > General > Your apps > *SDK setup and configuration* > **Config**). Copy four values into `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=      ← apiKey
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=  ← authDomain (nutlify-89882.firebaseapp.com)
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=   ← projectId (nutlify-89882)
   NEXT_PUBLIC_FIREBASE_APP_ID=       ← appId
   ```
   These are meant to be public (they’re sent to every visitor’s browser); they are not passwords. No service-account key is needed: the server checks sign-ins against Google’s public keys.
3. **Support email.** Authentication > Sign-in method > Google > make sure a *Project support email* is selected, then Save.
4. **Authorised domains.** Authentication > **Settings** > **Authorized domains**: `localhost` is there already. Add your live domains, e.g. `nutlify.in`, `www.nutlify.in` and your `something.vercel.app` address. Without this, sign-in fails with “unauthorized domain”.
5. **Restart** `npm run dev` (values starting with `NEXT_PUBLIC_` are only read at start-up). On Vercel, add the same four variables and **redeploy**.
6. **Test:** open `/login`, click *Continue with Google*. You should land on `/account`, the user should appear in Firebase > Authentication > **Users**, and the customer in **Admin > Customers**.

Optional: to show your logo and name on Google’s account chooser, edit the consent screen in Google Cloud Console > APIs & Services > **OAuth consent screen** (same project).

## 5. Run it
```bash
npm run dev      # http://localhost:3000, admin at http://localhost:3000/admin
```
Test a payment with Razorpay’s test UPI ID `success@razorpay` or a test card from Razorpay’s docs. The order should appear in the admin panel as **paid** and the product stock should go down.

## 6. Go online
Vercel is the simplest host for Next.js:
1. Push this folder to a private GitHub repository (`.env.local` is ignored and never uploaded).
2. Import it in Vercel, and add every variable from `.env.local` under Settings > Environment Variables. Paste `ADMIN_PASSWORD_HASH` without the backslashes (the hash-password script prints both versions). Set `NEXT_PUBLIC_SITE_URL` to your real address, e.g. `https://nutlify.in`.
3. In MongoDB Atlas Network Access allow Vercel (simplest: `0.0.0.0/0`).
4. Add the Razorpay webhook (step 4.3) with your live domain.
5. Point your domain at Vercel.

### Going live with real money
- Complete Razorpay KYC and website verification. They check the policy pages, so **review `src/data/policies.js` first and fill in every [BRACKETED] detail.**
- Generate **Live** API keys, replace the test keys in Vercel, create the webhook again in Live mode, and redeploy.

## Everyday admin
- **Change a price or stock:** Admin > Products > Edit. The shop updates within a minute.
- **Pack and ship:** Admin > Orders, filter “paid”, open an order, set the status to packed or shipped and add the courier and tracking number. The customer sees it on their order page.
- **Refund:** issue it in the Razorpay Dashboard, then set the order status to “refunded”.
- **Free delivery codes:** Admin > Coupons > Create coupon, and choose “Free delivery” as the type.
- **Create a coupon:** Admin > Coupons > Create coupon. Customers type the code at checkout. Turn it off any time by unticking “Coupon is on”.
- **Unpaid checkouts** (customer opened payment but didn’t pay) are hidden from the orders list; choose “pending (unpaid)” in the filter to see them.

## Settings in code
- `src/config/site.js`: delivery charges (`shipping`: free in Kanpur pincodes 208xxx, ₹60 in the rest of Uttar Pradesh, ₹100 elsewhere, and product offers such as free delivery on 2+ Diwali gift bags), max quantity per item, optional pincode restriction, contact details, brand story, gifting notes.
- `src/data/mixes.js`: the two mixes, ingredients, allergen and vegetarian details.
- `src/data/policies.js`: policy page text.
- `public/assets/`: images and video. New product images go here; enter their path (e.g. `/assets/my-image.webp`) in the admin product form.

## Not included yet (good next steps)
- Order confirmation emails or WhatsApp messages to customers and to you.
- Image upload from the admin panel (images are added to `public/assets` for now).
- GST invoices, courier API integration (e.g. Shiprocket), order emails.

## SEO
Built in: page titles and descriptions for every page, keywords (`src/config/seo.js`), canonical URLs, Open Graph/Twitter previews,
`/robots.txt`, `/sitemap.xml`, a web manifest, product pages at `/products/<slug>` with their own titles and descriptions
(`src/data/productContent.js`), and structured data for Google (store, website, products with price and stock, FAQ, breadcrumbs).

After each deploy to nutlify.in:
1. **Google Search Console** (search.google.com/search-console): add the property `https://nutlify.in`, verify with the HTML tag
   (put the code in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel and redeploy), then **Sitemaps > add `sitemap.xml`**.
2. **Bing Webmaster Tools**: import from Search Console, or verify with `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
3. **Google Business Profile** for Nutlify in Kanpur: the biggest single boost for searches like “dry fruits in Kanpur”.
4. Check structured data at search.google.com/test/rich-results with a product page URL.
