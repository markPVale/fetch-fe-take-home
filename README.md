- **Login Page** (handles user authentication via `/auth/login`).
- **Search Page** (displays and filters dogs using `/dogs/search` and `/dogs`).
- **Match Page** (displays the user's matched dog using `/dogs/match`).

Reusable components (for displaying dog cards, filters, and pagination)???

Core Directories and Files:

src/
├── api/                 # API functions
│   └── auth.ts          # Handles login/logout
├── components/          # Reusable components
│   └── DogCard.tsx      # Placeholder for a dog card
├── pages/               # Page-level components
│   ├── LoginPage.tsx    # Login screen
│   └── SearchPage.tsx   # Search screen
├── App.tsx              # Main app file
├── main.tsx             # React entry point
└── styles/              # (Optional) For global CSS or utility classes
    └── globals.css      # Placeholder for global styles

Possible File Structure when complete:
src/
├── api/                 # API request functions
│   ├── auth.ts          # Auth-related functions
│   ├── dogs.ts          # Dog-related functions
│   └── locations.ts     # Location-related functions
├── components/          # Reusable components
│   ├── DogCard.tsx      # Displays a single dog's details
│   ├── FilterBar.tsx    # Search filters (e.g., breeds, age, zip code)
│   ├── Pagination.tsx   # Handles pagination
│   └── FavoritesList.tsx # Displays favorite dogs
├── pages/               # Page-level components
│   ├── LoginPage.tsx    # Login screen
│   ├── SearchPage.tsx   # Search dogs and view results
│   └── MatchPage.tsx    # Displays matched dog
├── context/             # Global state management (e.g., favorites, auth)
│   ├── UserContext.tsx  # Handles user authentication
│   └── FavoritesContext.tsx # Stores favorited dogs
├── styles/              # Styling (optional)
├── utils/               # Helper functions
│   ├── formatters.ts    # Formatting utilities (e.g., sorting, pagination logic)
│   └── constants.ts     # App-wide constants (e.g., API base URL)
├── App.tsx              # Main app entry point
├── main.tsx             # React root
├── router.tsx           # React Router setup
├── vite-env.d.ts        # Vite-specific TypeScript types
└── tsconfig.json        # TypeScript configuration


API

curl

# /auth/login Endpoint

curl -X POST https://frontend-take-home-service.fetch.com/auth/login \
-H "Content-Type: application/json" \
-d '{"name": "Pat Tester", "email": "pat.tester@example.com"}' \
-c cookies.txt

response:
HTTP/1.1 200 OK
or
{"error":"Invalid login credentials"}

# Fetch All Dog Breeds
## /dogs/breeds
curl -X GET https://frontend-take-home-service.fetch.com/dogs/breeds \
-H "Content-Type: application/json" \
-b cookies.txt

response:
["Affenpinscher","Afghan Hound","African Hunting Dog","Airedale","American Staffordshire Terrier","Appenzeller","Australian Terrier","Basenji","Basset","Beagle","Bedlington Terrier","Bernese Mountain Dog","Black-and-tan Coonhound","Blenheim Spaniel","Bloodhound","Bluetick","Border Collie","Border Terrier","Borzoi","Boston Bull","Bouvier Des Flandres","Boxer","Brabancon Griffon","Briard","Brittany Spaniel","Bull Mastiff","Cairn","Cardigan","Chesapeake Bay Retriever","Chihuahua","Chow","Clumber","Cocker Spaniel","Collie","Curly-coated Retriever","Dandie Dinmont","Dhole","Dingo","Doberman","English Foxhound","English Setter","English Springer","EntleBucher","Eskimo Dog","Flat-coated Retriever","French Bulldog","German Shepherd","German Short-haired Pointer","Giant Schnauzer","Golden Retriever","Gordon Setter","Great Dane","Great Pyrenees","Greater Swiss Mountain Dog","Groenendael","Ibizan Hound","Irish Setter","Irish Terrier","Irish Water Spaniel","Irish Wolfhound","Italian Greyhound","Japanese Spaniel","Keeshond","Kelpie","Kerry Blue Terrier","Komondor","Kuvasz","Labrador Retriever","Lakeland Terrier","Leonberg","Lhasa","Malamute","Malinois","Maltese Dog","Mexican Hairless","Miniature Pinscher","Miniature Poodle","Miniature Schnauzer","Newfoundland","Norfolk Terrier","Norwegian Elkhound","Norwich Terrier","Old English Sheepdog","Otterhound","Papillon","Pekinese","Pembroke","Pomeranian","Pug","Redbone","Rhodesian Ridgeback","Rottweiler","Saint Bernard","Saluki","Samoyed","Schipperke","Scotch Terrier","Scottish Deerhound","Sealyham Terrier","Shetland Sheepdog","Shih-Tzu","Siberian Husky","Silky Terrier","Soft-coated Wheaten Terrier","Staffordshire Bullterrier","Standard Poodle","Standard Schnauzer","Sussex Spaniel","Tibetan Mastiff","Tibetan Terrier","Toy Poodle","Toy Terrier","Vizsla","Walker Hound","Weimaraner","Welsh Springer Spaniel","West Highland White Terrier","Whippet","Wire-haired Fox Terrier","Yorkshire Terrier"]%                                                             ➜  fetch-my-new-best-friend


# Search for Dogs

## /dogs/search

curl -X GET 'https://frontend-take-home-service.fetch.com/dogs/search?breeds=Labrador&size=10' \
-H "Content-Type: application/json" \
-b cookies.txt

response (for breed not in database):
{"next":"/dogs/search?breeds=Labrador&size=10&from=10","resultIds":[],"total":0}%

curl -X GET 'https://frontend-take-home-service.fetch.com/dogs/search?breeds=Labrador%20Retriever&size=10' \
-H "Content-Type: application/json" \
-b cookies.txt

response:
{"next":"/dogs/search?breeds=Labrador%20Retriever&size=10&from=10","resultIds":["CnGFTIcBOvEgQ5OCx68s","DHGFTIcBOvEgQ5OCx68s","EHGFTIcBOvEgQ5OCx68s","F3GFTIcBOvEgQ5OCx68s","GXGFTIcBOvEgQ5OCx68s","IXGFTIcBOvEgQ5OCx68s","KXGFTIcBOvEgQ5OCx68s","K3GFTIcBOvEgQ5OCx68s","LHGFTIcBOvEgQ5OCx68s","MHGFTIcBOvEgQ5OCx68s"],"total":171}%

No query parameters:
fetch-my-new-best-friend curl -X GET 'https://frontend-take-home-service.fetch.com/dogs/search' \
-H "Content-Type: application/json" \
-b cookies.txt

response:
{"next":"/dogs/search?size=25&from=25","resultIds":["VXGFTIcBOvEgQ5OCx40W","V3GFTIcBOvEgQ5OCx40W","WHGFTIcBOvEgQ5OCx40W","W3GFTIcBOvEgQ5OCx40W","YnGFTIcBOvEgQ5OCx40W","Y3GFTIcBOvEgQ5OCx40W","aHGFTIcBOvEgQ5OCx40W","aXGFTIcBOvEgQ5OCx40W","bHGFTIcBOvEgQ5OCx40W","bnGFTIcBOvEgQ5OCx40W","cXGFTIcBOvEgQ5OCx40W","c3GFTIcBOvEgQ5OCx40W","dHGFTIcBOvEgQ5OCx40W","dnGFTIcBOvEgQ5OCx40W","eHGFTIcBOvEgQ5OCx40W","h3GFTIcBOvEgQ5OCx40W","iHGFTIcBOvEgQ5OCx40W","jnGFTIcBOvEgQ5OCx40W","j3GFTIcBOvEgQ5OCx40W","kHGFTIcBOvEgQ5OCx40W","rXGFTIcBOvEgQ5OCx40W","uHGFTIcBOvEgQ5OCx40W","vnGFTIcBOvEgQ5OCx40W","yHGFTIcBOvEgQ5OCx40W","0XGFTIcBOvEgQ5OCx40W"],"total":10000}%

Pagination
The next and prev values in the response allow you to paginate through results. Use the from parameter provided in next to fetch the next page



POST

Fetch Dog Details
## /dogs

curl -X POST https://frontend-take-home-service.fetch.com/dogs \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '["VXGFTIcBOvEgQ5OCx40W","V3GFTIcBOvEgQ5OCx40W"]'

reponse:
[{"img":"https://frontend-take-home.fetch.com/dog-images/n02085620-Chihuahua/n02085620_10976.jpg","name":"Emory","age":10,"breed":"Chihuahua","zip_code":"48333","id":"VXGFTIcBOvEgQ5OCx40W"},{"img":"https://frontend-take-home.fetch.com/dog-images/n02085620-Chihuahua/n02085620_11238.jpg","name":"Jena","age":8,"breed":"Chihuahua","zip_code":"25275","id":"V3GFTIcBOvEgQ5OCx40W"}]%

## /dogs/match
After favoriting some dogs:

curl -X POST https://frontend-take-home-service.fetch.com/dogs/match \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '["VXGFTIcBOvEgQ5OCx40W","V3GFTIcBOvEgQ5OCx40W","WHGFTIcBOvEgQ5OCx40W"]'

response:
{"match":"V3GFTIcBOvEgQ5OCx40W"}%


## /locations
curl -X POST https://frontend-take-home-service.fetch.com/dogs/match \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '["11217"]'

response:
{"match":"11217"}%

## /locations/search

no filters:
curl -X POST https://frontend-take-home-service.fetch.com/locations/search \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{}'

response:
{"results":[{"city":"Holtsville","latitude":40.922326,"county":"Suffolk","state":"NY","zip_code":"00501","longitude":-72.637078},{"city":"Holtsville","latitude":40.922326,"county":"Suffolk","state":"NY","zip_code":"00544","longitude":-72.637078},{"city":"Adjuntas","latitude":18.165273,"county":"Adjuntas","state":"PR","zip_code":"00601","longitude":-66.722583},{"city":"Aguada","latitude":18.393103,"county":"Aguada","state":"PR","zip_code":"00602","longitude":-67.180953},{"city":"Aguadilla","latitude":18.455913,"county":"Aguadilla","state":"PR","zip_code":"00603","longitude":-67.14578},{"city":"Aguadilla","latitude":18.49352,"county":"Aguadilla","state":"PR","zip_code":"00604","longitude":-67.135883},{"city":"Aguadilla","latitude":18.465162,"county":"Aguadilla","state":"PR","zip_code":"00605","longitude":-67.141486},{"city":"Maricao","latitude":18.172947,"county":"Maricao","state":"PR","zip_code":"00606","longitude":-66.944111},{"city":"Anasco","latitude":18.288685,"county":"Anasco","state":"PR","zip_code":"00610","longitude":-67.139696},{"city":"Angeles","latitude":18.279531,"county":"Utuado","state":"PR","zip_code":"00611","longitude":-66.80217},{"city":"Arecibo","latitude":18.450674,"county":"Arecibo","state":"PR","zip_code":"00612","longitude":-66.698262},{"city":"Arecibo","latitude":18.458093,"county":"Arecibo","state":"PR","zip_code":"00613","longitude":-66.732732},{"city":"Arecibo","latitude":18.429675,"county":"Arecibo","state":"PR","zip_code":"00614","longitude":-66.674506},{"city":"Bajadero","latitude":18.444792,"county":"Arecibo","state":"PR","zip_code":"00616","longitude":-66.640678},{"city":"Barceloneta","latitude":18.447092,"county":"Barceloneta","state":"PR","zip_code":"00617","longitude":-66.544255},{"city":"Boqueron","latitude":17.998531,"county":"Cabo Rojo","state":"PR","zip_code":"00622","longitude":-67.187318},{"city":"Cabo Rojo","latitude":18.062201,"county":"Cabo Rojo","state":"PR","zip_code":"00623","longitude":-67.149541},{"city":"Penuelas","latitude":18.023535,"county":"Penuelas","state":"PR","zip_code":"00624","longitude":-66.726156},{"city":"Camuy","latitude":18.477891,"county":"Camuy","state":"PR","zip_code":"00627","longitude":-66.85477},{"city":"Castaner","latitude":18.269187,"county":"Lares","state":"PR","zip_code":"00631","longitude":-66.864993},{"city":"Rosario","latitude":18.113284,"county":"San German","state":"PR","zip_code":"00636","longitude":-67.039706},{"city":"Sabana Grande","latitude":18.087322,"county":"Sabana Grande","state":"PR","zip_code":"00637","longitude":-66.934911},{"city":"Ciales","latitude":18.33616,"county":"Ciales","state":"PR","zip_code":"00638","longitude":-66.472087},{"city":"Utuado","latitude":18.250027,"county":"Utuado","state":"PR","zip_code":"00641","longitude":-66.698957},{"city":"Dorado","latitude":18.43606,"county":"Dorado","state":"PR","zip_code":"00646","longitude":-66.281954}],"total":10000}%

city:
curl -X POST https://frontend-take-home-service.fetch.com/locations/search \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{"city": "Austin"}'

{"results":[{"city":"Austin","latitude":41.615099,"county":"Potter","state":"PA","zip_code":"16720","longitude":-77.957975},{"city":"Austin","latitude":36.815869,"county":"Barren","state":"KY","zip_code":"42123","longitude":-85.992039},{"city":"Austin","latitude":38.748455,"county":"Scott","state":"IN","zip_code":"47102","longitude":-85.750469},{"city":"Port Austin","latitude":43.99756,"county":"Huron","state":"MI","zip_code":"48467","longitude":-83.052623},{"city":"Austin","latitude":43.699305,"county":"Mower","state":"MN","zip_code":"55912","longitude":-92.976818},{"city":"Austin","latitude":34.980269,"county":"Lonoke","state":"AR","zip_code":"72007","longitude":-91.979545},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"73301","longitude":-97.771258},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"73344","longitude":-97.771258},{"city":"Austin","latitude":30.268335,"county":"Travis","state":"TX","zip_code":"78701","longitude":-97.741382},{"city":"Austin","latitude":30.264115,"county":"Travis","state":"TX","zip_code":"78702","longitude":-97.713581},{"city":"Austin","latitude":30.290107,"county":"Travis","state":"TX","zip_code":"78703","longitude":-97.766351},{"city":"Austin","latitude":30.240685,"county":"Travis","state":"TX","zip_code":"78704","longitude":-97.768832},{"city":"Austin","latitude":30.293057,"county":"Travis","state":"TX","zip_code":"78705","longitude":-97.736932},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78708","longitude":-97.771258},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78709","longitude":-97.771258},{"city":"Austin","latitude":30.351953,"county":"Travis","state":"TX","zip_code":"78710","longitude":-97.715123},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78711","longitude":-97.771258},{"city":"Austin","latitude":30.285207,"county":"Travis","state":"TX","zip_code":"78712","longitude":-97.735394},{"city":"Austin","latitude":30.468583,"county":"Travis","state":"TX","zip_code":"78713","longitude":-97.843336},{"city":"Austin","latitude":30.335787,"county":"Travis","state":"TX","zip_code":"78714","longitude":-97.443751},{"city":"Austin","latitude":30.450088,"county":"Travis","state":"TX","zip_code":"78715","longitude":-97.486509},{"city":"Austin","latitude":30.316223,"county":"Travis","state":"TX","zip_code":"78716","longitude":-97.85877},{"city":"Austin","latitude":30.493156,"county":"Williamson","state":"TX","zip_code":"78717","longitude":-97.756517},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78718","longitude":-97.771258},{"city":"Austin","latitude":30.141293,"county":"Travis","state":"TX","zip_code":"78719","longitude":-97.678843}],"total":88}%


curl -X POST https://frontend-take-home-service.fetch.com/locations/search \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{"city": "Austin", "states": ["TX"]}'

response:

{"results":[{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"73301","longitude":-97.771258},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"73344","longitude":-97.771258},{"city":"Austin","latitude":30.268335,"county":"Travis","state":"TX","zip_code":"78701","longitude":-97.741382},{"city":"Austin","latitude":30.264115,"county":"Travis","state":"TX","zip_code":"78702","longitude":-97.713581},{"city":"Austin","latitude":30.290107,"county":"Travis","state":"TX","zip_code":"78703","longitude":-97.766351},{"city":"Austin","latitude":30.240685,"county":"Travis","state":"TX","zip_code":"78704","longitude":-97.768832},{"city":"Austin","latitude":30.293057,"county":"Travis","state":"TX","zip_code":"78705","longitude":-97.736932},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78708","longitude":-97.771258},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78709","longitude":-97.771258},{"city":"Austin","latitude":30.351953,"county":"Travis","state":"TX","zip_code":"78710","longitude":-97.715123},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78711","longitude":-97.771258},{"city":"Austin","latitude":30.285207,"county":"Travis","state":"TX","zip_code":"78712","longitude":-97.735394},{"city":"Austin","latitude":30.468583,"county":"Travis","state":"TX","zip_code":"78713","longitude":-97.843336},{"city":"Austin","latitude":30.335787,"county":"Travis","state":"TX","zip_code":"78714","longitude":-97.443751},{"city":"Austin","latitude":30.450088,"county":"Travis","state":"TX","zip_code":"78715","longitude":-97.486509},{"city":"Austin","latitude":30.316223,"county":"Travis","state":"TX","zip_code":"78716","longitude":-97.85877},{"city":"Austin","latitude":30.493156,"county":"Williamson","state":"TX","zip_code":"78717","longitude":-97.756517},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78718","longitude":-97.771258},{"city":"Austin","latitude":30.141293,"county":"Travis","state":"TX","zip_code":"78719","longitude":-97.678843},{"city":"Austin","latitude":30.326374,"county":"Travis","state":"TX","zip_code":"78720","longitude":-97.771258},{"city":"Austin","latitude":30.268684,"county":"Travis","state":"TX","zip_code":"78721","longitude":-97.684781},{"city":"Austin","latitude":30.286857,"county":"Travis","state":"TX","zip_code":"78722","longitude":-97.718832},{"city":"Austin","latitude":30.305107,"county":"Travis","state":"TX","zip_code":"78723","longitude":-97.686631},{"city":"Austin","latitude":30.292188,"county":"Travis","state":"TX","zip_code":"78724","longitude":-97.617871},{"city":"Austin","latitude":30.243552,"county":"Travis","state":"TX","zip_code":"78725","longitude":-97.625293}],"total":80}%




# Troubleshooting
Things to Check
Auth Cookie Validity:
- If the cookie in cookies.txt has expired, re-authenticate using the /auth/login endpoint.
Valid Breed Names:
- Always verify the breed names using /dogs/breeds.
Query Parameter Case Sensitivity:
- Check if the API is case-sensitive for parameters like breeds.
API Limits:
- Ensure you’re not hitting rate limits or other restrictions.








# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
