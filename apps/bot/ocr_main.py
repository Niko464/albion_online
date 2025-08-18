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
POS_NAME_FIELD = (645, 270)
POS_CATEGORY_FIELD = (815, 271)
POS_TIER_FIELD = (955, 270)
POS_ENCHANTMENT_FIELD = (1095, 270)

# === OCR Coordinates ===
OCR_REGION_1_TOP_LEFT = (665, 387)  # Point C (x, y)
OCR_REGION_1_BOTTOM_RIGHT = (896, 472)  # Point D (x, y)
OCR_REGION_2_TOP_LEFT = (1066, 389)  # Point E (x, y)
OCR_REGION_2_BOTTOM_RIGHT = (1217, 471)  # Point F (x, y)

OCR_NO_OFFERS_TOP_LEFT = (855, 455)
OCR_NO_OFFERS_BOTTOM_RIGHT = (1040, 505)

UI_ELEM_WIDTH = 135
UI_ELEM_HEIGHT = 27

# === Global flag to control loop ===
running = False


watch_list = [
    {
    "name": "Raw ressources",
    "size": 5,
    "ui_path": [564, 597],
    "tiers_per_index": [
      [{"tier": 2, "names": ["Cotton"]}, {"tier": 3, "names": ["Flax"]}, {"tier": 4, "names": ["Hemp"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Skyflower"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Amberleaf Cotton"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Sunflax"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Ghost Hemp"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Hide"]}, {"tier": 3, "names": ["Hide"]}, {"tier": 4, "names": ["Hide"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Hide"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Hide"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Hide"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Hide"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Ore"]}, {"tier": 3, "names": ["Ore"]}, {"tier": 4, "names": ["Ore"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Ore"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Ore"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Ore"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Ore"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Limestone"]}, {"tier": 3, "names": ["Sandstone"]}, {"tier": 4, "names": ["Travertine"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Granite"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Slate"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Basalt"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Marble"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Log"]}, {"tier": 3, "names": ["Log"]}, {"tier": 4, "names": ["Log"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Log"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Log"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Log"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Log"], "enchantments": [0, 1, 2, 3]}]
    ]
  },
  {
    "name": "Refined ressources",
    "size": 5,
    "ui_path": [564, 624],
    "tiers_per_index": [
      [{"tier": 2, "names": ["Cloth"]}, {"tier": 3, "names": ["Cloth"]}, {"tier": 4, "names": ["Cloth"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Cloth"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Cloth"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Cloth"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Cloth"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Leather"]}, {"tier": 3, "names": ["Leather"]}, {"tier": 4, "names": ["Leather"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Leather"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Leather"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Leather"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Leather"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Bar"]}, {"tier": 3, "names": ["Bar"]}, {"tier": 4, "names": ["Bar"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Bar"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Bar"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Bar"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Bar"], "enchantments": [0, 1, 2, 3]}],
      [{"tier": 2, "names": ["Block"]}, {"tier": 3, "names": ["Block"]}, {"tier": 4, "names": ["Block"]}, {"tier": 5, "names": ["Block"]}, {"tier": 6, "names": ["Block"]}, {"tier": 7, "names": ["Block"]}, {"tier": 8, "names": ["Block"]}],
      [{"tier": 2, "names": ["Plank"]}, {"tier": 3, "names": ["Plank"]}, {"tier": 4, "names": ["Plank"], "enchantments": [0, 1, 2, 3]}, {"tier": 5, "names": ["Plank"], "enchantments": [0, 1, 2, 3]}, {"tier": 6, "names": ["Plank"], "enchantments": [0, 1, 2, 3]}, {"tier": 7, "names": ["Plank"], "enchantments": [0, 1, 2, 3]}, {"tier": 8, "names": ["Plank"], "enchantments": [0, 1, 2, 3]}]
    ]
  },
  {
    "name": "Food",
    "size": 8,
    "ui_path": [510, 545],
    "tiers_per_index": [
      [
        { "tier": 1, "names": ["Carrot soup", "Greenmoor"], "enchantments": [0, 1, 2, 3] },
        {
          "tier": 3,
          "names": ["Wheat soup", "Murkwater Clam"], "enchantments": [0, 1, 2, 3]
        },
        { "tier": 5, "names": ["Cabbage soup", "Blackbog Clam Soup"], "enchantments": [0, 1, 2, 3] }
      ],
      [
        {
          "tier": 1, "names": ["Seaweed salad"]
        },
        {
          "tier": 2,
          "names": ["Bean salad", "Shallowshore Squid"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 4,
          "names": ["Turnip Salad", "Midwater Octopus Salad"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 6,
          "names": ["Potato salad", "Deepwater Kraken"], "enchantments": [0, 1, 2, 3]
        }
      ],
      [
        {
          "tier": 3,
          "names": ["Chicken pie", "Upland Coldeye"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 5,
          "names": ["Goose pie", "Mountain Blindeye"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 7,
          "names": ["Pork pie", "Frostpeak Deadeye Pie"], "enchantments": [0, 1, 2, 3]
        }
      ],
      [
        {
          "tier": 3,
          "names": ["Roast chicken", "Roasted Whitefog"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 5,
          "names": ["Roast Goose", "Roasted Clearhaze"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 7,
          "names": ["Roast Pork", "Roasted Puremist Snapper"], "enchantments": [0, 1, 2, 3]
        }
      ],
      [
        {
          "tier": 3,
          "names": ["Chicken", "Lowriver Crab", "Avalonian Chicken Omelette"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 5,
          "names": ["Goose omelette", "Drybrook Crab", "Avalonian Goose"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 7,
          "names": [
            "Pork Omelette",
            "Dusthole Crab Omelette",
            "Avalonian Pork Omelette"
          ], "enchantments": [0, 1, 2, 3]
        }
      ],
      [
        {
          "tier": 4,
          "names": ["Goat stew", "Greenriver Eel", "Avalonian Goat"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 6,
          "names": [
            "Mutton Stew",
            "Redspring Eel Stew",
            "Avalonian Mutton Stew"
          ], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 8,
          "names": ["Beef Stew", "Deadwater Eel Stew", "Avalonian Beef Stew"], "enchantments": [0, 1, 2, 3]
        }
      ],
      [
        {
          "tier": 4,
          "names": ["Goat sandwich", "Stonestream Lurcher", "Avalonian Goat"], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 6,
          "names": [
            "Mutton Sandwich",
            "Rushwater Lurcher Sandwich",
            "Avalonian Mutton Sandwich"
          ], "enchantments": [0, 1, 2, 3]
        },
        {
          "tier": 8,
          "names": [
            "Beef Sandwich",
            "Thunderfall Lurcher Sandwich",
            "Avalonian Beef Sandwich"
          ], "enchantments": [0, 1, 2, 3]
        }
      ],
      [{
        "tier": 4,
        "names": ["Chocolate"]
      }]
    ]
  },
  {
    "name": "Fish",
    "size": 3,
    "ui_path": [571, 703],
    "tiers_per_index": [
      [
        {
          "tier": 3,
          "names": ["Albion Perch"]
        }
      ],
      [
        {
          "tier": 3,
          "names": [
            "Shallowshore Squid",
            "Lowriver Crab",
            "Greenriver Eel",
            "Stonestream Lurcher"
          ]
        },
        {
          "tier": 5,
          "names": [
            "Midwater Octopus",
            "Murkwater Clam",
            "Mountain Blindeye",
            "Clearhaze Snapper",
            "Redspring Eel",
            "Rushwater Lurcher"
          ]
        },
        {
          "tier": 7,
          "names": ["Blackbog Clam", "Frostpeak Deadeye", "Puremist Snapper"]
        }
      ],
      [
        {
          "tier": 1,
          "names": [
            "Seaweed",
            "Basic fish sauce",
            "Fancy fish sauce",
            "Special fish sauce",
            "Chopped Fish"
          ]
        }
      ]
    ]
  },

  {
    "name": "Farming products",
    "size": 5,
    "ui_path": [627, 757],
    "tiers_per_index": [[{"tier": 6, "names": ["Potato Schnapps"]}, {"tier": 7, "names": ["Corn Hooch"]}, {"tier": 8, "names": ["Pumpkin Moonshine"]}], [{"tier": 4, "names": ["Bread"]}], [{"tier": 4, "names": ["Goat's Butter"]}, {"tier": 6, "names": ["Sheep's Butter"]}, {"tier": 8, "names": ["Cow's Butter"]}], [{"tier": 3, "names": ["Flour"]}], [{"tier": 3, "names": ["Raw Chicken"]}, {"tier": 4, "names": ["Raw Goat"]}, {"tier": 5, "names": ["Raw Goose"]}, {"tier": 6, "names": ["Raw Mutton"]}, {"tier": 7, "names": ["Raw Pork"]}, {"tier": 8, "names": ["Raw Cow"]}]]
  },
  {
    "name": "Pasture",
    "size": 4,
    "ui_path": [627, 706],
    "tiers_per_index": [
      [{
        "tier": 3,
        "names": ["Baby Chickens"]
      }],
      [
        {
          "tier": 3,
          "names": ["chicken"]
        },
        {
          "tier": 4,
          "names": ["goat"]
        },
        {
          "tier": 5,
          "names": ["Goose"]
        },
        {
          "tier": 6,
          "names": ["Sheep"]
        },
        {
          "tier": 7,
          "names": ["Pig"]
        },
        {
          "tier": 8,
          "names": ["Cow"]
        }
      ],
      [{"tier": 3, "names": ["Hen Eggs"]}, {"tier": 5, "names": ["Goose Eggs"]}],
      [{"tier": 4, "names": ["Goat's Milk"]}, {"tier": 6, "names": ["Sheep's Milk"]}, {"tier": 8, "names": ["Cow's Milk"]}]
    ]
  },
  {
    "name": "Plants",
    "size": 8,
    "ui_path": [625, 650, 700]
  },
  {
    "name": "Agaric stuff",
    "size": 7,
    "ui_path": [623, 672, 734]
  },
  {
    "name": "Avalonian energy stuff",
    "size": 3,
    "ui_path": [571, 650]
  },

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
    try:
        with open('parsed_translations.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to load item data: {e}")
        sys.exit(1)


# === Find itemId by English name ===
def get_item_id_by_name(item_name, enchantment_level, items_data):
    for item in items_data:
        if item["LocalizedName"] == item_name and (enchantment_level == 0 or f"@{enchantment_level}" in item["UniqueName"]):
            return item["UniqueName"]
    print(f"Warning: No itemId found for item name {item_name} and enchantment level {enchantment_level}")
    return None

def checkIfNoOffersFound():
    try:
        # Take a screenshot of the "No offers found" region
        no_offers_screenshot = pyautogui.screenshot(region=(OCR_NO_OFFERS_TOP_LEFT[0], OCR_NO_OFFERS_TOP_LEFT[1], 
                                                            OCR_NO_OFFERS_BOTTOM_RIGHT[0] - OCR_NO_OFFERS_TOP_LEFT[0], 
                                                            OCR_NO_OFFERS_BOTTOM_RIGHT[1] - OCR_NO_OFFERS_TOP_LEFT[1]))
        # Perform OCR on the screenshot
        text = pytesseract.image_to_string(no_offers_screenshot, config='--psm 6').strip()
        return "no offers found" in text.lower()
    except Exception as e:
        print(f"Error checking for 'No offers found': {e}")
        return False
  

# === Screenshot and OCR Function ===
def take_screenshot_and_detect_price():
    try:
        # Determine full bounding box that includes both OCR regions
        left = min(OCR_REGION_1_TOP_LEFT[0], OCR_REGION_2_TOP_LEFT[0])
        top = min(OCR_REGION_1_TOP_LEFT[1], OCR_REGION_2_TOP_LEFT[1])
        right = max(OCR_REGION_1_BOTTOM_RIGHT[0], OCR_REGION_2_BOTTOM_RIGHT[0])
        bottom = max(OCR_REGION_1_BOTTOM_RIGHT[1], OCR_REGION_2_BOTTOM_RIGHT[1])

        width = right - left
        height = bottom - top

        # Take one combined screenshot
        full_screenshot = pyautogui.screenshot(region=(left, top, width, height))

        # Crop out the item name region
        name_crop_box = (
            OCR_REGION_1_TOP_LEFT[0] - left,
            OCR_REGION_1_TOP_LEFT[1] - top,
            OCR_REGION_1_BOTTOM_RIGHT[0] - left,
            OCR_REGION_1_BOTTOM_RIGHT[1] - top
        )
        name_region = full_screenshot.crop(name_crop_box)

        # Crop out the price region
        price_crop_box = (
            OCR_REGION_2_TOP_LEFT[0] - left,
            OCR_REGION_2_TOP_LEFT[1] - top,
            OCR_REGION_2_BOTTOM_RIGHT[0] - left,
            OCR_REGION_2_BOTTOM_RIGHT[1] - top
        )
        price_region = full_screenshot.crop(price_crop_box)

        # Perform OCR on cropped images
        text1 = pytesseract.image_to_string(name_region, config='--psm 6').strip().replace('\n', " ")
        text2 = pytesseract.image_to_string(price_region, config='--psm 6').strip()

        return text1, text2.replace("\n", " ")

    except Exception as e:
        print(f"Error in screenshot/OCR: {e}")
        return None, None

def getItemData(lastItemName, lastItemPrice, items_data, enchantmentLvl, toSend):
    time.sleep(0.5)
    itemName, price = take_screenshot_and_detect_price()
    
    if itemName is None or price is None:
        print("OCR failed, skipping item.")
        return lastItemName, lastItemPrice  # Return last known name to maintain loop behavior

    retry_count = 0
    max_retries = 5

    while ((itemName == lastItemName and price == lastItemPrice) or not itemName or not price or itemName.strip() == "" or price.strip() == ""):
        print(f"Still seeing the last item, waiting and retrying... (last: {lastItemName, lastItemPrice} current: {itemName, price})")
        time.sleep(0.2)
        itemName, price = take_screenshot_and_detect_price()

        if itemName is None or price is None:
            print("OCR failed on retry, skipping item.")
            return lastItemName, lastItemPrice

        if retry_count == 1 and checkIfNoOffersFound():
            print(f'No offers found')
            return lastItemName, lastItemPrice

        if retry_count >= max_retries:
            print(f"Exceeded maximum retries ({max_retries}), skipping item.")
            return lastItemName, lastItemPrice
        retry_count += 1
        

    print(itemName, price)
    itemId = get_item_id_by_name(itemName, enchantmentLvl, items_data)
    
    if itemId:
        try:
            toSend.append({
                "itemId": itemId,
                "price": int(price.replace(",", "")),
                "location": LOCATION_NAME
            })
        except ValueError:
            print(f"Invalid price value: {price}, skipping.")
    
    return itemName, price


# === Automation Logic ===
def start_watching_prices(watch_list):
    items_data = load_item_data()
    for item in watch_list:
        print('Starting to watch:', item['name'])
        toSend = []
        lastItemName = None
        lastItemPrice = None
        for idx in range(item['size']):
            if not running:
                break
            pyautogui.click(*POS_CATEGORY_FIELD)
            ui_path = item.get('ui_path', [])
            tiers_per_index = item.get('tiers_per_index')
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
            if tiers_per_index:
                for tierIdx in range(len(tiers_per_index[idx])):
                    if not running:
                        break
                    # Move to the tier field and click
                    pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1])
                    pyautogui.click()

                    tier_info = tiers_per_index[idx][tierIdx]

                    # Determine if this tier entry includes names (dict) or is a direct tier number (int)
                    # if isinstance(tier_info, dict):
                    tier_number = tier_info["tier"]
                    item_names = tier_info["names"]

                    # Select the tier
                    pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1] + UI_ELEM_HEIGHT * (tier_number + 1))
                    pyautogui.click()

                    for name in item_names:
                        if not running:
                            break
                        # Click into name field
                        pyautogui.moveTo(POS_NAME_FIELD)
                        pyautogui.click()
                        pyautogui.hotkey('ctrl', 'a')  # Select all
                        pyautogui.press('backspace')  # Clear it
                        pyautogui.write(name)
                        pyautogui.press('enter')  # Trigger search

                        enchantments = tier_info["enchantments"] if "enchantments" in tier_info else [0]
                        for enchantmentLevel in enchantments:
                            # Click the enchantment box
                            pyautogui.moveTo(POS_ENCHANTMENT_FIELD[0], POS_ENCHANTMENT_FIELD[1])
                            pyautogui.click()
                            # Select the correct enchantment
                            pyautogui.moveTo(POS_ENCHANTMENT_FIELD[0], POS_ENCHANTMENT_FIELD[1] + UI_ELEM_HEIGHT * (enchantmentLevel + 2))
                            pyautogui.click()
                            lastItemName, lastItemPrice = getItemData(lastItemName, lastItemPrice, items_data, enchantmentLevel, toSend)


                    # elif isinstance(tier_info, int):
                    #     # Just select the tier and proceed (no name typing)
                    #     pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1] + UI_ELEM_HEIGHT * (tier_info + 1))
                    #     pyautogui.click()
                    #     lastItemName = getItemData(lastItemName, items_data, toSend)
            else:
                pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1])
                pyautogui.click()
                # Select "All Tiers" option
                pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1] + UI_ELEM_HEIGHT * 1)
                pyautogui.click()
                lastItemName, lastItemPrice = getItemData(lastItemName, lastItemPrice, items_data, 0, toSend)
            

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
    keyboard.add_hotkey('num 5', toggle_automation)

    # Prevent script from exiting
    keyboard.wait('esc')  # Press ESC to quit the script entirely

if __name__ == "__main__":
    main()