import json

# Read the input JSON file with UTF-8 encoding
try:
    with open('items.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    exit(1)
except FileNotFoundError:
    print("Error: items.json file not found")
    exit(1)

# Validate that data is a list
if not isinstance(data, list):
    print(f"Error: Expected a list in items.json, got {type(data)}")
    exit(1)

# Process the data, skipping invalid items
parsed_data = []
for index, item in enumerate(data):
    # Skip if item is None
    if item is None:
        print(f"Skipping item at index {index}: Item is None")
        continue
    # Skip if item is not a dictionary
    if not isinstance(item, dict):
        print(f"Skipping item at index {index}: Item is not a dictionary, got {type(item)}")
        continue
    # Check for required keys
    required_keys = ["UniqueName", "Index", "LocalizedNames"]
    missing_keys = [key for key in required_keys if key not in item]
    if missing_keys:
        print(f"Skipping item at index {index}: Missing keys {missing_keys}")
        continue
    # Check for EN-US in LocalizedNames
    if not isinstance(item["LocalizedNames"], dict) or "EN-US" not in item["LocalizedNames"]:
        print(f"Skipping item at index {index}: Missing or invalid EN-US in LocalizedNames")
        continue

    parsed_data.append({
        "UniqueName": item["UniqueName"],
        "Index": item["Index"],
        "LocalizedName": item["LocalizedNames"]["EN-US"]
    })

# Write the parsed data to a new JSON file with UTF-8 encoding
try:
    with open('parsed_items.json', 'w', encoding='utf-8') as file:
        json.dump(parsed_data, file, indent=2, ensure_ascii=False)
    print(f"Successfully wrote {len(parsed_data)} items to parsed_items.json")
except Exception as e:
    print(f"Error writing to file: {e}")