# -HomeTest-ElysianSoftech
For the App interface (React Native) 
Backend:
The server using python run on Azure cloud in the link: myserver-ckaceug6c8h2cqdy.israelcentral-01.azurewebsites.net
related file: app.py
the seconed server written in NodeJS is local.

follow these steps to run NodeJS server locally:

cd NodeServer
npm install

locate the file named .env.example in the server directory
rename this file to .env, open it and insert your private API key
start the server by: node server.js

Frontend:
i use the platform of Expo App, related file:App/app/(tabs)/index.js

npm install
note: In the code (specifically in the API call section), you will find the following line:
const Response_node = await axios.get('http://192.168.1.35:5000/get-message'); you need to ensure that the IP address matches the local your IP address/

npx expo start

screenshots:
MongoDB:
![mongo](image.png)

log from Azure:
![azure](image-1.png)

app:
![app interface1](app.png)
![app interface1](app2.png)

For the Web interface (ReactJS)
related file: src/web.js + web.css
Backend:
ensure the Node server is still running

Frontend:
navigate to the folder web

npm start

screenshots:
![web1](image3.png)
![web2](image4.png)

chatbot:
the prompt:
"i need to add a friendly AI agent in Hebrew, which provides customer service (package status) and sales support (encouraging customers to order more deliveries). Build me a Jason file that contains 4 delivery statuses (package shipped, package arrived at destination, package in preparation, package received), which contains category, delivery number, products, customer name, phone number. The AI ​​agent will have to provide information about delivery status based on phone number and customer name and will also scan the customer's current order and encourage the customer to order more deliveries.The agent must run on website - Figma page that i built before. All conversations must be logged into an Excel, including: Caller’s name Phone number Conversation details. Show me the entire from the start and running the code in the terminal." - using Gemini


pip install openai openpyxl flask flask-cors python-dotenv
pip install pandas openpyxl

python app.py

screenshot:
![chatbot](chatbot.png)
