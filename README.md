# 🐶 Fetch Your New Best Friend App

## 🚀 Live Demo
> _(Link will be added after deployment)_

---

## 📌 Features
✅ **User Authentication** - Users log in with their name and email.
✅ **Filter by Breed** - Select a breed to filter results.
✅ **Sort by Breed Name** - Results are sorted alphabetically by breed (ascending/descending).
✅ **Pagination** - Load more dogs with pagination.
✅ **Favorite Dogs** - Users can mark dogs as favorites.
✅ **Match a Dog** - Generates a match based on favorite selections.
✅ **Responsive UI** - Optimized for desktop and mobile.

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone git@github.com:markPVale/fetch-fe-take-home.git
cd fetch-my-new-best-friend 
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start the Development Server**
```sh
npm run dev
```

---

## 🔧 API Usage

This app interacts with the Fetch Rewards API for authentication and dog data.

### **Authentication**
- `POST /auth/login` - Logs in the user (auth cookie is stored automatically).
- `POST /auth/logout` - Ends the session.

### **Dogs**
- `GET /dogs/breeds` - Fetches all available dog breeds.
- `GET /dogs/search` - Searches for dogs based on filters (breeds, zip codes, etc.).
- `POST /dogs` - Fetches detailed dog information based on their IDs.
- `POST /dogs/match` - Matches a dog based on favorite selections.

### **Locations**
- `POST /locations` - Fetches location details (city, state, etc.) for given zip codes.

---

## 📁 Project Structure
```
📂 src
┣ 📂 api           # API calls (dogs, locations, auth)
┣ 📂 components    # Reusable UI components (Button, DogCard, Navbar)
┣ 📂 hooks         # Custom hooks (useDogs.ts)
┣ 📂 interfaces    # TypeScript interfaces for API responses and app data (Dog, Location, Match)
┣ 📂 pages         # Main pages (LoginPage, SearchPage)
┣ 📂 routes        # Application routing configuration (ProtectedRoute, router.tsx)
┣ 📂 utils         # Helper functions (getDogLocation)
┣ 📜 App.tsx       # Main app component
┣ 📜 main.tsx      # React entry point
┗ 📜 index.css     # Global styles (Tailwind)
```

---

## 🏗️ Future Enhancements
💡 **Confirm Requirements For Login** - What parameters should the username/email inputs follow to conform to API.
💡 **Custom Styles** - The app currently displays base-level styling.
💡 **Improved Error Handling** - Display more user-friendly error messages.
💡 **More Filtering Options** - Add filtering by age, location, etc.
💡 **Add Robust Testing** - Add a robust test suite for each file.
