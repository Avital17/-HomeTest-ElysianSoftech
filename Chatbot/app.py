import pandas as pd
import os
import json
import re
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key="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")

EXCEL_FILE = "logs.xlsx"
DATA_FILE = "deliveries.json"

def get_verified_delivery(name, phone, order_num):
    try:
        if not os.path.exists(DATA_FILE): return None
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                name_match = name.lower() in item['customer_name'].lower() if name != "Unknown" else False
        
                phone_match = str(item['phone']) == phone if phone != "N/A" else False
               
                order_match = str(item['delivery_number']) == str(order_num) if order_num != "N/A" else False
                
                
                
                if phone_match and order_match and name_match:
                    return item
        return None
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return None

def extract_all_info(history, last_msg):
    all_msgs = history + [{"role": "user", "text": last_msg}]
    phone, order, name = "N/A", "N/A", "Unknown"
    
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
                        name = next_msg["text"].strip()

        # חילוץ טלפון
        p_match = re.search(r'\d{9,10}', text)
        if p_match: phone = p_match.group(0)

        # תיקון: חילוץ מספר הזמנה (הורדנו ל-4 ספרות כדי שיתאים ל-1002 שלך)
        o_match = re.search(r'(?:הזמנה|מספר|#)?\s?(\d{4,8})', text)
        if o_match: order = o_match.group(1)

    return {"name": name, "phone": phone, "order": order}

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_msg = data.get("message", "")
        history = data.get("history", [])
        
        info = extract_all_info(history, user_msg)
        delivery = get_verified_delivery(info["name"], info["phone"], info["order"])
        
        if delivery:
            status_context = f"Match found! Status: {delivery['status']}. Products: {', '.join(delivery['products'])}. Category: {delivery['category']}."
            sales_hint = f"The customer ordered {delivery['category']}. Suggest a complementary item elegantly."
        else:
            if info["name"] != "Unknown" and info["phone"] != "N/A" and info["order"] != "N/A":
                status_context = "Error: Full details provided but no match found. Likely wrong order number for this name/phone."
            else:
                status_context = "Missing details for verification."
            sales_hint = "Do not suggest sales yet. Just help find the order."

        SYSTEM_INSTR = f"""
Your name is 'Elegant Service Representative'. You must speak in fluent, warm, and professional Hebrew.

Current System Status: {status_context}
Sales Guidance: {sales_hint}

Follow these steps:
1. Greet the customer and ask for Full Name.
2. Ask for Phone Number.
3. Ask for Order Number.
4. ONLY provide the status if a full match is found. If no match, explain politely that details don't match.
5. IF MATCHED: Provide status, then gently suggest an item from the category '{delivery['category'] if delivery else ''}' in a non-pressuring way and shortly.
6. Provide coupon 'NEW10' at the end.
"""

        messages = [{"role": "system", "content": SYSTEM_INSTR}]
        for msg in history:
            messages.append({"role": "assistant" if msg["role"] == "ai" else "user", "content": msg["text"]})
        messages.append({"role": "user", "content": user_msg})

        response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
        ai_reply = response.choices[0].message.content

        # שמירה לאקסל
        if "NEW10" in ai_reply:
            log_data = {
                "Time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                "Name": info["name"],
                "Phone": info["phone"],
                "Order": info["order"],
                "Chat": " | ".join([m["text"] for m in history[-3:]]) + f" | {user_msg}"
            }
            df = pd.DataFrame([log_data])
            if not os.path.exists(EXCEL_FILE): df.to_excel(EXCEL_FILE, index=False)
            else: pd.concat([pd.read_excel(EXCEL_FILE), df]).to_excel(EXCEL_FILE, index=False)

        return jsonify({"reply": ai_reply})
    except Exception as e:
        print(e)
        return jsonify({"reply": "תקלה טכנית"}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
