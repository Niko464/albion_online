import pyautogui
from pynput import keyboard
import pytesseract
from PIL import Image
import json
import os
from datetime import datetime

# Configure Tesseract path if needed (Windows example):
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Fixed starting position and UI element dimensions
POS_CATEGORY_FIELD = (815, 271)
UI_ELEM_WIDTH = 135
UI_ELEM_HEIGHT = 27

# Start offset (so cursor is centered inside the element)
current_x, current_y = POS_CATEGORY_FIELD[0] - 60, POS_CATEGORY_FIELD[1] - 13

# Data structure for category tree
category_map = []
stack = []  # each item: {"idx": index_in_parent, "start_y": y_position}
last_text = None  # remember last OCR text

# Ensure outputs folder exists
os.makedirs("outputs", exist_ok=True)

# Load start map if it exists
start_map_path = "outputs/startMap.json"
if os.path.exists(start_map_path):
    with open(start_map_path, "r", encoding="utf-8") as f:
        category_map = json.load(f)
    print(f"📂 Loaded starting map from {start_map_path}")
else:
    print("ℹ️ No startMap.json found, starting with an empty map.")


# Ensure outputs folder exists
os.makedirs("outputs", exist_ok=True)

def save_map():
    """Save the current category map to outputs/ with a timestamped filename."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"outputs/uiMap_{timestamp}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(category_map, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved map snapshot to {filename}")

def add_to_map(idx, text):
    """Insert a new entry into the correct level of the category map."""
    global category_map, stack

    new_entry = {
        "idx": idx,
        "text": text,
        "subcategories": []
    }

    if not stack:
        category_map.append(new_entry)
    else:
        current_level = category_map
        for s in stack[:-1]:
            current_level = current_level[s["idx"]]["subcategories"]
        current_level[stack[-1]["idx"]]["subcategories"].append(new_entry)

def get_current_start_y():
    """Get the reference Y for index calculation depending on stack depth."""
    if not stack:
        return POS_CATEGORY_FIELD[1] - 13  # root start Y
    else:
        return stack[-1]["start_y"]

def calculate_idx():
    """Calculate local index depending on depth (root vs subcategory)."""
    start_y = get_current_start_y()
    raw_idx = (current_y - start_y) // UI_ELEM_HEIGHT
    if not stack:  # root level
        return raw_idx + 0
    else:  # inside a subcategory
        return raw_idx + 1


def on_press(key):
    global current_x, current_y, last_text, stack

    try:
        if key == keyboard.Key.down:
            current_y += UI_ELEM_HEIGHT
            pyautogui.moveTo(current_x, current_y)
        elif key == keyboard.Key.up:
            current_y -= UI_ELEM_HEIGHT
            pyautogui.moveTo(current_x, current_y)
        elif key == keyboard.Key.right:
            # Move cursor right
            current_x += UI_ELEM_WIDTH
            pyautogui.moveTo(current_x, current_y)

            # Calculate the local index at this depth
            idx = calculate_idx()

            if not stack:
                # Look for a root node with this idx
                for i, node in enumerate(category_map):
                    if node["idx"] == idx:
                        stack.append({"idx": i, "start_y": current_y})
                        print(f"➡️ Entered subcategory: {node['text']}")
                        break
            else:
                # Navigate into the current stack level
                current_level = category_map
                for s in stack[:-1]:
                    current_level = current_level[s["idx"]]["subcategories"]

                parent = current_level[stack[-1]["idx"]]
                # Look for a child with this idx
                for i, node in enumerate(parent["subcategories"]):
                    if node["idx"] == idx:
                        stack.append({"idx": i, "start_y": current_y})
                        print(f"➡️ Entered subcategory: {node['text']}")
                        break


        elif key == keyboard.Key.left:
            # Move cursor left
            current_x -= UI_ELEM_WIDTH
            pyautogui.moveTo(current_x, current_y)

            # Go up one level
            if stack:
                stack.pop()
                print("⬅️ Went up one level")

        elif key == keyboard.Key.enter:
            print("go")

        elif hasattr(key, 'char') and key.char in ['x', 'X']:
            # Take screenshot of rectangle at current pos
            left = current_x
            top = current_y
            screenshot = pyautogui.screenshot(region=(left, top, UI_ELEM_WIDTH - 20, UI_ELEM_HEIGHT))
            
            # Run OCR with pytesseract
            text = pytesseract.image_to_string(screenshot).strip()
            if not text:
                text = "[no text detected]"

            # Corrected index calculation
            idx = calculate_idx()

            print(f"OCR result: '{text}' at local idx {idx}")

            add_to_map(idx, text)
            last_text = text

            print("Current Map:", json.dumps(category_map, indent=2, ensure_ascii=False))
            save_map()

        elif key == keyboard.Key.esc:
            print("Exiting...")
            print("Final Category Map:")
            print(json.dumps(category_map, indent=2, ensure_ascii=False))
            return False

    except Exception as e:
        print(f"Error: {e}")

# Listen for keyboard events
with keyboard.Listener(on_press=on_press) as listener:
    print("Arrow keys move & navigate, Enter prints 'go', X screenshots & OCR, Esc quits.")
    listener.join()
