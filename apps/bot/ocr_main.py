import json
import time
import pyautogui
import keyboard
import threading
from PIL import Image
import pytesseract
import requests
import sys

# === Coordinates ===
POS_CATEGORY_FIELD = (815, 271)

# === OCR Coordinates ===
OCR_REGION_1_TOP_LEFT = (665, 387)  # Point C (x, y)
OCR_REGION_1_BOTTOM_RIGHT = (896, 472)  # Point D (x, y)
OCR_REGION_2_TOP_LEFT = (1066, 389)  # Point E (x, y)
OCR_REGION_2_BOTTOM_RIGHT = (1217, 471)  # Point F (x, y)

UI_ELEM_WIDTH = 135
UI_ELEM_HEIGHT = 25

# === Global flag to control loop ===
running = False


watch_list = [
    {
        "name": "Plants",
        "size": 8,
        "ui_path": [
            625,
            650,
            700,
        ]
    }
]

# === Command-line arguments ===
if len(sys.argv) < 3:
    print("Error: Please provide the server URL and locationName as command-line arguments.")
    print("Example: python script.py http://example.com location_name")
    sys.exit(1)

SERVER_URL = sys.argv[1].rstrip('/')
LOCATION_NAME = sys.argv[2]

# === Load item data for ID lookup ===
def load_item_data():
    with open('parsed_items.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# === Find itemId by English name ===
def get_item_id_by_name(item_name, items_data):
    for item in items_data:
        if item["LocalizedName"] == item_name:
            return item["UniqueName"]
    print(f"Warning: No itemId found for item name {item_name}")
    return None

# === Screenshot and OCR Function ===
def take_screenshot_and_detect_price():
    try:
        # Take screenshot for region 1 (C to D)
        x1, y1 = OCR_REGION_1_TOP_LEFT
        x2, y2 = OCR_REGION_1_BOTTOM_RIGHT
        width1 = x2 - x1
        height1 = y2 - y1
        region1 = pyautogui.screenshot(region=(x1, y1, width1, height1))

        # Take screenshot for region 2 (E to F)
        x3, y3 = OCR_REGION_2_TOP_LEFT
        x4, y4 = OCR_REGION_2_BOTTOM_RIGHT
        width2 = x4 - x3
        height2 = y4 - y3
        region2 = pyautogui.screenshot(region=(x3, y3, width2, height2))

        # Perform OCR on both regions
        text1 = pytesseract.image_to_string(region1, config='--psm 6').strip()
        text2 = pytesseract.image_to_string(region2, config='--psm 6').strip()

        return text1, text2

    except Exception as e:
        print(f"Error in screenshot/OCR: {e}")
        return None, None

# === Automation Logic ===
def start_watching_prices(watch_list):
    items_data = load_item_data()
    for item in watch_list:
        print('Starting to watch:', item['name'])
        toSend = []
        lastItemName = None
        for idx in range(item['size'] + 1):
            if not running:
                break
            pyautogui.click(*POS_CATEGORY_FIELD)
            ui_path = item.get('ui_path', [])
            if not ui_path:
                continue
            x = POS_CATEGORY_FIELD[0]

            for y in ui_path:
                if not running:
                    break
                pyautogui.moveTo(x, y)
                # Move to next column
                x += UI_ELEM_WIDTH
            pyautogui.moveTo(x, ui_path[-1])
            pyautogui.moveTo(x, ui_path[-1] + UI_ELEM_HEIGHT * (idx + 1))
            pyautogui.click()
            time.sleep(0.3)
            itemName, price = take_screenshot_and_detect_price()
            if itemName is None or price is None:
                print("OCR failed, skipping item.")
                continue
            while itemName == lastItemName:
                print("Duplicate item detected, waiting and retrying...")
                time.sleep(0.2)
                itemName, price = take_screenshot_and_detect_price()
                if itemName is None or price is None:
                    print("OCR failed on retry, skipping item.")
                    break
            if itemName and price:
                print(itemName, price)
                itemId = get_item_id_by_name(itemName, items_data)
                if itemId:
                    toSend.append({
                        "itemId": itemId,
                        "price": int(price),
                        "location": LOCATION_NAME
                    })
                lastItemName = itemName

        # Send toSend list to the server
        if toSend:
            try:
                response = requests.post(f"{SERVER_URL}/update-ocr-prices", json=toSend)
                if response.status_code == 201:
                    print(f"Successfully sent data for {item['name']}: {toSend}")
                else:
                    print(f"Failed to send data for {item['name']}. Status code: {response.status_code}")
            except Exception as e:
                print(f"Error sending POST request for {item['name']}: {e}")

# === Hotkey Toggle Handler ===
def toggle_automation():
    global running
    if not running:
        print("Started automation.")
        running = True
        threading.Thread(target=start_watching_prices, args=(watch_list,), daemon=True).start()
    else:
        print("Stopping automation...")
        running = False

# === Main ===
def main():
    print("Press Numpad 5 to start/stop automation.")
    print("Press Numpad 8 to take screenshots and perform OCR.")
    keyboard.add_hotkey('num 5', toggle_automation)
    keyboard.add_hotkey('num 8', take_screenshot_and_detect_price)

    # Prevent script from exiting
    keyboard.wait('esc')  # Press ESC to quit the script entirely

if __name__ == "__main__":
    main()