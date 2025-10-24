Japanese Traditional Food Recipes Web Page

A front-end web project that showcases authentic Japanese traditional food recipes using a clean interface and JSON-powered dynamic content. This project is ideal for learning front-end development and exploring Japanese culinary culture.


* Features: 

1. 📖 Dynamic recipe loading from JSON files
2. 🧭 Simple and intuitive user navigation
3. 🖼️ High-quality images displaying traditional dishes
4. 📱 Mobile-responsive layout
5. ⚡ Fast reload using a local development server

* Tech Stack
Technology	Purpose
HTML	Page structure
CSS	Styling and responsive layout
JavaScript	Dynamic interaction and JSON data fetching
Node.js + live-server	Local development server to support JSON loading


🚀 Getting Started (Using Node.js + Live Server)

This project uses JSON files, which cannot be loaded by directly opening the HTML file in a browser due to browser security restrictions (CORS).
To run this properly, you must use a local development server.

✅ Prerequisites

Make sure you have Node.js and npm installed.

You can verify with these commands:

```node -v
```npm -v

📂 Step 1: Navigate to the project folder
cd Japanese-Tarditional-Food-Recipes-Web-Page

📦 Step 2: Install live-server globally (only once)
```npm install -g live-server

▶️ Step 3: Start the development server
```live-server


This will:
- Launch your default browser
- Serve files correctly with JSON support
- Auto-reload when you make changes
- Your site will be available at:
- http://127.0.0.1:8080


(or another port shown in your terminal)

📁 Project Structure
├── index.html        # Main web page
├── style.css         # Stylesheet
├── script.js         # Main JavaScript logic
├── /data             # JSON files containing recipes
├── /images           # Food images
├── /patterns         # UI pattern assets
└── Japanese Food List.doc  # Reference document for recipes


* Usage

Browse recipes via the homepage
Click on items to view ingredients, preparation method, and cultural insights
All content is loaded dynamically using JavaScript and JSON

🌱 Future Improvements

🔎 Search & filtering capabilities

🎨 Dark mode

🌐 Multi-language support (Japanese/English toggle)

🧁 Add dessert category & seasonal dishes

🤝 Contributing

Contributions are welcome!
Fork this repository
Create a branch (feature/new-recipe)
Commit your changes
Open a Pull Request

📄 License

This project is licensed under the MIT License.
