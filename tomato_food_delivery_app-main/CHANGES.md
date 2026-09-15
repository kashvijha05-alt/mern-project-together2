# What changed

Three things were done: a **login gate**, a **working search bar**, and the **new logo**.

---

## 1. Login page shows first

Before, the site loaded straight away and login was a small popup. Now nobody sees
the food site until they log in.

**How it works — `frontend/src/App.jsx`:**

```
loading?  ->  spinner
no token? ->  <Login />        (nothing else renders)
has token? -> Navbar + Routes + Footer
```

**Files:**

| File | What happened |
|---|---|
| `pages/Login/Login.jsx` | **New.** Full-page login/sign-up screen |
| `pages/Login/Login.css` | **New.** Orange brand panel on the left, form on the right |
| `App.jsx` | Rewritten — three-way gate above |
| `Context/StoreContext.jsx` | Added `loading` and `logout` |
| `components/LoginPopup/` | **Deleted** — the new page replaces it |

**Why `loading` matters:** the saved token lives in `localStorage`, and reading it
happens inside a `useEffect` (i.e. *after* the first render). Without a `loading`
flag, a logged-in user would see the login page flash for a split second on every
refresh. `loading` starts as `true` and flips to `false` once the check is done.

**The login page has:** name field only in sign-up mode, a Show/Hide password
toggle, an 8-character minimum, a disabled button while submitting, a `try/catch`
so a dead server shows a toast instead of a blank page, and a link to swap between
Login and Sign Up.

---

## 2. Search bar now actually searches

Before, `assets.search_icon` was a plain image that did nothing.

**How it works:**

1. `StoreContext` holds `searchQuery` (shared state).
2. `Navbar` writes to it as you type.
3. `FoodDisplay` reads it and filters the dish list.

**In the navbar** (`components/Navbar/Navbar.jsx`):
- Click the magnifier → the bar expands into an input and auto-focuses.
- `Esc` closes and clears it. `Enter` scrolls down to the results.
- The ✕ button closes and clears.
- Typing while on `/cart` navigates you back to the menu so you can see results.

**In the list** (`components/FoodDisplay/FoodDisplay.jsx`):
- Matches against **name, description, and category** — so "spicy" or "salad"
  both work.
- Case-insensitive and trimmed, so `"  SALAD "` still matches `"Greek salad"`.
- Category filter and search are combined with AND — a dish must satisfy both.
- Heading updates: `Top dishes near you` → `Results for "salad"` → `4 dishes found`.
- If nothing matches, you get a friendly empty box with a **Clear search** button
  instead of a blank page.

---

## 3. Logo is now `image.jpeg`

The Zavora logo was copied to three places and wired up:

| Copied to | Used for |
|---|---|
| `frontend/src/assets/image.jpeg` | Navbar, footer, login page |
| `admin/src/assets/image.jpeg` | Admin panel navbar |
| `frontend/public/image.jpeg` | Browser tab favicon |

Only **one line** changed in each `assets.js`:

```js
import logo from './image.jpeg'   // was: './logo.png'
```

Everything that already used `assets.logo` picked up the new image automatically.

**Sizing:** the old `logo.png` was wide, this one is square. So the CSS was
switched from `width: 150px` to `height: 62px; width: auto` — a square image with
a fixed width would have been enormous. The footer version sits on a white rounded
plate (`.footer-logo`) so the black outline stays visible against the dark
background.

The browser tab title is now `Zavora - Every bite, a story`.

---

## Running it

```bash
cd backend  && npm install && npm run server
cd frontend && npm install && npm run dev
cd admin    && npm install && npm run dev
```

Then open the frontend URL. You should land on the login page.
Create an account → you're taken into the food site → try the search icon.

**To log out and see the gate again:** hover the profile icon (top right) → Logout.

---

## One thing to check

`Context/StoreContext.jsx` and `admin/src/assets/assets.js` both point at a
hosted backend:

```
https://tomato-food-del-backend-p1ni.onrender.com
```

If you're running the backend locally, change both to `http://localhost:4000`
(or whatever port your `backend/.env` uses), otherwise login will hit the remote
server instead of yours.
