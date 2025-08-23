import json
import time
import pyautogui
import keyboard
import threading
from PIL import Image
import pytesseract
import requests
import sys
import re
import imagehash
import hashlib
import pyautogui
import pytesseract
from rapidfuzz import fuzz

# === Coordinates ===
POS_NAME_FIELD = (645, 270)
POS_CATEGORY_FIELD = (815, 270)
POS_TIER_FIELD = (955, 270)
POS_ENCHANTMENT_FIELD = (1095, 270)
POS_QUALITY_FIELD = (1235, 270)

# === OCR Coordinates ===
REGION_0_TOP_LEFT = (575, 390)
REGION_0_BOTTOM_RIGHT = (665, 470)
OCR_REGION_1_TOP_LEFT = (665, 387)  # Point C (x, y)
OCR_REGION_1_BOTTOM_RIGHT = (896, 470)  # Point D (x, y)
OCR_REGION_2_TOP_LEFT = (1066, 389)  # Point E (x, y)
OCR_REGION_2_BOTTOM_RIGHT = (1217, 470)  # Point F (x, y)

OCR_NO_OFFERS_TOP_LEFT = (855, 455)
OCR_NO_OFFERS_BOTTOM_RIGHT = (1040, 505)

UI_ELEM_WIDTH = 135
UI_ELEM_HEIGHT = 27

# === Global flag to control loop ===
running = False
currentScreenHash = None
currentText = None
currentCategory = None
currentSubCategory1 = None
currentSubCategory2 = None
currentSubCategory3 = None
currentTier = None
currentEnchantment = None
currentQuality = None

# === Command-line arguments ===
if len(sys.argv) < 3:
    print("Error: Please provide the server URL and locationName as command-line arguments.")
    print("Example: python script.py http://example.com location_name")
    sys.exit(1)

SERVER_URL = sys.argv[1].rstrip('/')
LOCATION_NAME = sys.argv[2]

def get_item_tiers(item_name: str) -> list[str]:
    result = []
    for i in range(2, 9):  # T2 → T8
        base_item_id = f"T{i}_{item_name}"
        result.append(base_item_id)

        if i >= 4:  # only tiers 4+
            for enchantment in range(1, 4):  # LEVEL1@1 → LEVEL3@3
                result.append(f"{base_item_id}_LEVEL{enchantment}@{enchantment}")

    return result
  
def getTranslation(itemId, translations):
    # First try exact match
    item = next((item for item in translations if item["UniqueName"] == itemId), None)

    if not item:
        # Try with enchantment suffix if available
        enchantment = get_item_enchantment(itemId)
        if enchantment != 0:
            modified_id = f"{itemId}@{enchantment}"
            item = next((item for item in translations if item["UniqueName"] == modified_id), None)

    return item["LocalizedName"] if item else None


def loadJsonFile(fileName):
    try:
        with open(fileName, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to load file: {e}")
        sys.exit(1)
        
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

def take_screenshot_and_detect_price():
    try:
        # --- Bounding box: REGION_0 top-left → OCR_REGION_2 bottom-right ---
        left = REGION_0_TOP_LEFT[0]
        top = REGION_0_TOP_LEFT[1]
        right = OCR_REGION_2_BOTTOM_RIGHT[0]
        bottom = OCR_REGION_2_BOTTOM_RIGHT[1]

        width = right - left
        height = bottom - top

        # One combined screenshot
        full_screenshot = pyautogui.screenshot(region=(left, top, width, height))

        # --- Crop Region 0 (for hash) ---
        region0_crop_box = (
            REGION_0_TOP_LEFT[0] - left,
            REGION_0_TOP_LEFT[1] - top,
            REGION_0_BOTTOM_RIGHT[0] - left,
            REGION_0_BOTTOM_RIGHT[1] - top
        )
        # region0 = full_screenshot.crop(region0_crop_box)

        # Compute hash of region 0
        region0_hash = imagehash.phash(full_screenshot)

        # --- Crop Region 1 (item name) ---
        name_crop_box = (
            OCR_REGION_1_TOP_LEFT[0] - left,
            OCR_REGION_1_TOP_LEFT[1] - top,
            OCR_REGION_1_BOTTOM_RIGHT[0] - left,
            OCR_REGION_1_BOTTOM_RIGHT[1] - top
        )
        name_region = full_screenshot.crop(name_crop_box)

        # --- Crop Region 2 (price) ---
        price_crop_box = (
            OCR_REGION_2_TOP_LEFT[0] - left,
            OCR_REGION_2_TOP_LEFT[1] - top,
            OCR_REGION_2_BOTTOM_RIGHT[0] - left,
            OCR_REGION_2_BOTTOM_RIGHT[1] - top
        )
        price_region = full_screenshot.crop(price_crop_box)

        # --- OCR ---
        text1 = pytesseract.image_to_string(name_region, config='--psm 6').strip().replace("\n", " ")
        text2 = pytesseract.image_to_string(price_region, config='--psm 6').strip().replace("\n", " ")

        return text1, text2, region0_hash

    except Exception as e:
        print(f"Error in screenshot/OCR: {e}")
        return None, None, None


  
watch_list = loadJsonFile("watch_list.json")
# Have a list of itemIds with combination of quality
# Loop over the list and use the uiMap to figure out what to click
# When clicking the ui remember what are the current selected options so that we don't reclick the same options if they are already selected
# When taking screenshots also take a screen of the picture so that we can know when the UI has changed and gone to the next element

def writeText(text):
  global currentText
  if (text == currentText):
    return
  
  pyautogui.moveTo(POS_NAME_FIELD)
  pyautogui.click()
  pyautogui.write(text)

  currentText = text


def getShopCategories(itemData):
  category = itemData.get("-shopcategory")
  subCat1  = itemData.get("-shopsubcategory1")
  subCat2  = itemData.get("-shopsubcategory2")
  subCat3  = itemData.get("-shopsubcategory3")
  return category, subCat1, subCat2, subCat3

def isCategoryValid(itemData, uiMap):
  category, subCat1, subCat2, subCat3 = getShopCategories(itemData)
  itemId = {itemData["-uniquename"]}

  # --- Level 1: category ---
  categoryUiElem = next((el for el in uiMap if el.get("id") == category), None)
  if categoryUiElem is None and category is not None:
      print(f"Missing category {category} ({itemId})")
      return False

  # --- Level 2: subcategory 1 ---
  subcategories = categoryUiElem.get("subcategories", []) if categoryUiElem else []
  subCatUiElem = next((el for el in subcategories if el.get("id") == subCat1), None)
  if subCatUiElem is None and subCat1 is not None:
      print(f"Missing subcategory1 {subCat1} inside {category} ({itemId})")
      return False

  # --- Level 3: subcategory 2 ---
  subcategories = subCatUiElem.get("subcategories", []) if subCatUiElem else []
  subCat2UiElem = next((el for el in subcategories if el.get("id") == subCat2), None)
  if subCat2UiElem is None and subCat2 is not None:
      print(f"Missing subcategory2 {subCat2} inside {category} {subCat1} ({itemId})")
      return False

  # --- Level 4: subcategory 3 ---
  subcategories = subCat2UiElem.get("subcategories", []) if subCat2UiElem else []
  subCat3UiElem = next((el for el in subcategories if el.get("id") == subCat3), None)
  if subCat3UiElem is None and subCat3 is not None:
      print(f"Missing subcategory3 {subCat3} inside {category} {subCat1} {subCat2} ({itemId})")
      return False

  # --- Extract indexes ---
  categoryIdx     = categoryUiElem.get('idx') if categoryUiElem else None
  subCategory1Idx = subCatUiElem.get('idx') if subCatUiElem else None
  subCategory2Idx = subCat2UiElem.get('idx') if subCat2UiElem else None
  subCategory3Idx = subCat3UiElem.get('idx') if subCat3UiElem else None
  return categoryIdx, subCategory1Idx, subCategory2Idx, subCategory3Idx

#TODO: write this function
def selectCategory(itemData, uiMap):
  category, subCat1, subCat2, subCat3 = getShopCategories(itemData)
  categoryIdx, subCategory1Idx, subCategory2Idx, subCategory3Idx = isCategoryValid(itemData, uiMap)
  if categoryIdx is None:
      print("Error while selectingCategory")
      sys.exit(1)
      return False

  # --- Prevent unnecessary clicks ---
  global currentCategory, currentSubCategory1, currentSubCategory2, currentSubCategory3
  global running
  if categoryIdx == currentCategory and \
      subCategory1Idx == currentSubCategory1 and \
      subCategory2Idx == currentSubCategory2 and \
      subCategory3Idx == currentSubCategory3:
      return True

  # --- Click navigation ---
  pyautogui.click(*POS_CATEGORY_FIELD)
  ui_path = [idx for idx in [categoryIdx, subCategory1Idx, subCategory2Idx, subCategory3Idx] if idx is not None]

  x = POS_CATEGORY_FIELD[0]
  y = POS_CATEGORY_FIELD[1]

  for idx, height in enumerate(ui_path):
      if not running:
          break
      if idx != 0:
          height -= 1
      y += UI_ELEM_HEIGHT * height
      pyautogui.moveTo(x, y)
      if (idx != len(ui_path) - 1):
          x += UI_ELEM_WIDTH
          pyautogui.moveTo(x, y)
  pyautogui.click(x, y)

  # --- Update globals ---
  currentCategory     = categoryIdx
  currentSubCategory1 = subCategory1Idx
  currentSubCategory2 = subCategory2Idx
  currentSubCategory3 = subCategory3Idx
  return True


def selectTier(level):
  global currentTier
  if (currentTier == level):
    return
  pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1])
  pyautogui.click()
  pyautogui.moveTo(POS_TIER_FIELD[0], POS_TIER_FIELD[1] + UI_ELEM_HEIGHT * (level + 1))
  pyautogui.click()
  
  currentTier = level
  
def selectEnchantment(level):
  global currentEnchantment
  if (currentEnchantment == level):
    return
  pyautogui.moveTo(POS_ENCHANTMENT_FIELD[0], POS_ENCHANTMENT_FIELD[1])
  pyautogui.click()
  # Select the correct enchantment
  pyautogui.moveTo(POS_ENCHANTMENT_FIELD[0], POS_ENCHANTMENT_FIELD[1] + UI_ELEM_HEIGHT * (level + 2))
  pyautogui.click()
  
  currentEnchantment = level

def selectQuality(level):
  global currentQuality
  if (currentQuality == level):
    return
  pyautogui.moveTo(POS_QUALITY_FIELD[0], POS_QUALITY_FIELD[1])
  pyautogui.click()
  # Select the correct quality
  pyautogui.moveTo(POS_QUALITY_FIELD[0], POS_QUALITY_FIELD[1] + UI_ELEM_HEIGHT * (level + 1))
  pyautogui.click()
  
  currentQuality = level

def findItemInItemList(itemList, itemId):
  return next((item for item in itemList if item.get("-uniquename") == itemId), None)

def loadItemList():
  json = loadJsonFile('./items.json')
  return json["items"]["simpleitem"] + json["items"]["consumableitem"]

def get_item_enchantment(item_id):
    # Look for LEVEL_X
    match = re.search(r'LEVEL(\d+)', item_id)
    if match:
        return int(match.group(1))

    # Look for @X
    match = re.search(r'@(\d+)', item_id)
    if match:
        return int(match.group(1))

    return 0


def send_price_update(toSend, expectedText):
    try:
        response = requests.post(f"{SERVER_URL}/update-ocr-prices", json=toSend)
        if response.status_code == 201:
            print(f"Successfully sent data for {expectedText}: {toSend}")
        else:
            print(f"Failed to send data for {expectedText}. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error sending POST request for {expectedText}: {e}")

def start_watching_prices(watch_list):
  global currentScreenHash
  uiMap = loadJsonFile("./outputs/startMap.json")
  translations = loadJsonFile("./parsed_translations.json")
  itemList = loadItemList()
  
  invalidItemIds = []
  # First check validity of all categories
  for watchListItem in watch_list:
    itemId = watchListItem['itemId']
    itemData = findItemInItemList(itemList, itemId)
    if (itemData is None):
      print("CRITICAL: Invalid item data:", itemId)
      sys.exit(1)
      return
    isValid = isCategoryValid(itemData, uiMap)
    if not isValid:
        invalidItemIds.append(itemId)
        continue
  if (len(invalidItemIds) > 0):
      print("Invalid item IDs found:", invalidItemIds)
      return


  for watchListItem in watch_list:
    itemId = watchListItem['itemId']
    itemData = findItemInItemList(itemList, itemId)
    
    expectedText = getTranslation(itemId, translations)
    targetTier = int(itemData["-tier"])
    targetEnchantment = get_item_enchantment(itemId)
    quality_indexes = watchListItem['quality'] if watchListItem['quality'] != None else [0]

    writeText(expectedText)
    selectCategory(itemData, uiMap)
    selectTier(targetTier)
    selectEnchantment(targetEnchantment)
    
    for quality in quality_indexes:
      selectQuality(quality)
      pyautogui.moveTo(50, 50)
      # print(f"Expected text for {itemId}: {expectedText}")
      detectedItemText, detectedItemPrice, screenHash = take_screenshot_and_detect_price()
      expectedText_similarity = fuzz.ratio(detectedItemText, expectedText)
      retry_count = 0
      max_retries = 5
      shouldSkip = False

      while (detectedItemText == "" or detectedItemPrice == "" or \
        (currentScreenHash is not None and abs(screenHash - currentScreenHash) <= 3) or
        expectedText_similarity < 80):
          print(f"Retaking screenshot because still seeing same stuff ({abs(screenHash - currentScreenHash)}) ({expectedText_similarity})\nDetected text: {detectedItemText}\nExpected text: {expectedText}")
          detectedItemText, detectedItemPrice, screenHash = take_screenshot_and_detect_price()
          expectedText_similarity = fuzz.ratio(detectedItemText, expectedText)
          
          if retry_count == 1 and checkIfNoOffersFound():
              print(f'No offers found')
              shouldSkip = True
              break
          if retry_count >= max_retries:
              print(f"Exceeded maximum retries ({max_retries}), skipping item.")
              shouldSkip = True
              break
          retry_count += 1
      if (shouldSkip):
          print(f"Skipping id: {itemId} q: {quality}.")
          continue
      print("\nDetection passed:\n", itemId, "\n", detectedItemText, "\n", expectedText, "\n", abs(screenHash - currentScreenHash) if currentScreenHash is not None else "No previous hash")
      currentScreenHash = screenHash
      
      toSend = []
      toSend.append({
          "itemId": itemId,
          "quality": int(quality),
          "price": int(detectedItemPrice.replace(",", "")),
          "location": LOCATION_NAME
      })
      threading.Thread(
        target=send_price_update,
        args=(toSend, expectedText),
        daemon=True
      ).start()


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
    keyboard.wait('esc')

if __name__ == "__main__":
    main()