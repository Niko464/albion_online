import json
import time
import pyautogui
import keyboard
import threading

# === Coordinates ===
POS_INPUT_FIELD = (686, 269)
POS_BUTTON_1 = (1248, 428)
POS_BUTTON_2 = (937, 303)

# === Global flag to control loop ===
running = False

# === Load Translations Function ===
def generate_watchlistTranslations():
    with open('items.json', 'r', encoding='utf-8') as f:
        items_data = json.load(f)

    with open('../backend/src/watch_list.json', 'r', encoding='utf-8') as f:
        watch_list = json.load(f)

    translations = []
    for watch_item in watch_list:
        target_name_var = f"@ITEMS_{watch_item}"
        matched_item = next((item for item in items_data if item.get("LocalizationNameVariable") == target_name_var), None)
        if matched_item:
            localized_name = matched_item.get("LocalizedNames", {}).get("EN-US")
            if localized_name:
                translations.append(localized_name)
        else:
            print(f"Warning: No match found for {watch_item}")
    return translations

# === Automation Logic ===
def process_translations(translations):
    global running
    for text in translations:
        if not running:
            print("Stopped by user.")
            break

        pyautogui.click(*POS_INPUT_FIELD)
        time.sleep(0.2)
        pyautogui.write(text, interval=0.01)

        time.sleep(0.5)
        pyautogui.click(*POS_BUTTON_1)

        time.sleep(0.3)
        pyautogui.click(*POS_BUTTON_2)

        time.sleep(0.2)

# === Hotkey Toggle Handler ===
def toggle_automation():
    global running
    if not running:
        print("Started automation.")
        running = True
        translations = generate_watchlistTranslations()
        threading.Thread(target=process_translations, args=(translations,), daemon=True).start()
    else:
        print("Stopping automation...")
        running = False

# === Main ===
def main():
    print("Press Numpad 5 to start/stop automation.")
    keyboard.add_hotkey('num 5', toggle_automation)

    # Prevent script from exiting
    keyboard.wait('esc')  # Press ESC to quit the script entirely

if __name__ == "__main__":
    main()
