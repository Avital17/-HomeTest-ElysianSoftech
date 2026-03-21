import pandas as pd
import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import datetime

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key="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")
EXCEL_FILE = "logs.xlsx"

def extract_all_info(history, last_msg):
    all_msgs = history + [{"role": "user", "text": last_msg}]
    
    phone = "N/A"
    order = "N/A"
    name = "Unknown"

    name_triggers = ["שמך", "איך קוראים לך", "מה השם", "מהו שמך", "שמך המלא"]

    for i in range(len(all_msgs)):
        current = all_msgs[i]
        
        role = current.get("role", "").lower() 
        text = str(current.get("text", ""))

        if role in ["ai", "assistant"]:
            if any(trigger in text for trigger in name_triggers):
                if i + 1 < len(all_msgs):
                    next_msg = all_msgs[i+1]
                    if next_msg.get("role") in ["user", "customer"]:
                        name = next_msg["text"]
                        print(f"DEBUG: Found Name -> {name}")

        p_match = re.search(r'\d{9,10}', text)
        if p_match: phone = p_match.group(0)

        o_match = re.search(r'(?:הזמנה|מספר|#)?\s?(\d{5,8})', text)
        if o_match: order = o_match.group(1)

    return {"name": name, "phone": phone, "order": order}

def save_final_lead(data_dict):
    new_data = pd.DataFrame([data_dict])
    if not os.path.isfile(EXCEL_FILE):
        new_data.to_excel(EXCEL_FILE, index=False, engine='openpyxl')
    else:
        existing_df = pd.read_excel(EXCEL_FILE)
        pd.concat([existing_df, new_data], ignore_index=True).to_excel(EXCEL_FILE, index=False, engine='openpyxl')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_msg = data.get("message", "")
        history = data.get("history", [])

        SYSTEM_INSTR = """
You are a charming, generous, and incredibly polite customer service representative. 
Your goal is to make the customer feel valued and cared for.

CRITICAL: Speak ONLY in natural, warm, and concise Hebrew. 

Follow this order strictly:
1. Greet the customer warmly and ask for their full name (wait for response).
2. After receiving the name, ask for their phone number in a friendly manner (wait for response).
3. After receiving the phone number, ask for their order number so you can assist them (wait for response).
4. Only after all 3 are collected, express your gratitude and provide the closing message.

The Closing Message:
Say: "תודה! הפרטים נקלטו. החבילה בדרך" (Thank you! The details have been received. The package is on its way).
Then, add a charming note that we want to give them a special gift: a personal discount coupon for their next delivery. 
Provide the coupon code: NEW10.

STRICT CONSTRAINTS:
- DO NOT mention or show the coupon 'NEW10' until all details are collected.
- Maintain a delightful and helpful persona throughout the conversation.
- Always respond in Hebrew.
"""

        messages = [{"role": "system", "content": SYSTEM_INSTR}]
        for msg in history:
            role = "assistant" if msg["role"] == "ai" else "user"
            messages.append({"role": role, "content": msg["text"]})
        messages.append({"role": "user", "content": user_msg})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        ai_reply = response.choices[0].message.content

        # בדיקת סיום שיחה
        if "NEW10" in ai_reply:
            final_info = extract_all_info(history, user_msg)
            
            lead_to_save = {
                "Time": datetime.datetime.now().strftime("%H:%M:%S %d/%m/%Y"),
                "Name": final_info["name"],
                "Phone number": final_info["phone"],
                "Full Conversation": " | ".join([f"{m['role']}: {m['text']}" for m in history]) + f" | user: {user_msg}"
            }
            save_final_lead(lead_to_save)

        return jsonify({"reply": ai_reply})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"reply": "שגיאה בשרת", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)