import json

# Read the parsed_items.json file
with open('parsed_items.json', 'r') as file:
    items = json.load(file)

# Transform items into Recipe format
recipes = []
for item in items:
    # Ensure craftingrequirements exists
    if "craftingrequirements" not in item:
        continue
    
    # Get craftresource, which can be a dict or list
    craftresource = item["craftingrequirements"]["craftresource"] if "craftresource" in item["craftingrequirements"] else []

    # Handle both single object and array cases
    if isinstance(craftresource, dict):
        craftresource = [craftresource]  # Convert single resource to list
    # Else, assume it's already a list (or empty)

    # Extract ingredients
    ingredients = []
    for ingredient in craftresource:
        ingredient_data = {
            "itemId": ingredient["-uniquename"] if "-uniquename" in ingredient else "",
            "quantity": int(ingredient["-count"]) if "-count" in ingredient else 0,
            "returnable": False if "-maxreturnamount" in ingredient and ingredient["-maxreturnamount"] == "0" else True
        }
        ingredients.append(ingredient_data)

    # Create recipe object
    recipe = {
        "recipeId": item["-uniquename"] if "-uniquename" in item else "",
        "tier": int(item["-tier"]) if "-tier" in item else 0,
        "quantity": 1,
        "ingredients": ingredients,
        "itemValue": item["itemvalue"] if "itemvalue" in item else None,
        "focus": item["craftingrequirements"]["-craftingfocus"] if "craftingrequirements" in item and "-craftingfocus" in item["craftingrequirements"] else None,
        "fame": item["craftingfame"] if "craftingfame" in item else None,
        "specializationBranchName": item["-craftingcategory"] if "-craftingcategory" in item else None
    }
    recipes.append(recipe)

# Write recipes to recipes.json
with open('recipes.json', 'w') as file:
    json.dump(recipes, file, indent=2)