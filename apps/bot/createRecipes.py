import json
import sys

# with open('current_food_recipes.json', 'r') as file:
#     current_recipes = json.load(file)
current_recipes = []

# Read the parsed_items.json file
with open('parsed_items.json', 'r') as file:
    items = json.load(file)
    
craftingCategoryToCategoryMap = {
    "meat_chicken": "food",
    "meat_goat": "food",
    "meat_goose": "food",
    "meat_sheep": "food",
    "meat_pig": "food",
    "meat_cow": "food",
    # "wood",
    # "rock",
    # "ore",
    # "hide",
    # "fiber",
    # "offhand",
    # "cape",
    # "bag",
    # "plate_helmet",
    # "plate_armor",
    # "plate_shoes",
    # "leather_helmet",
    # "leather_armor",
    # "leather_shoes",
    # "cloth_helmet",
    # "cloth_armor",
    # "cloth_shoes",
    # "gatherergear"
}
    
shopCategoriesToSpecializationMap = {
    "grilledfish": "Ingredients",
    "salads": "Salad",
    "soups": "Soup",
    "pies": "Pie",
    "omelettes": "Omelette",
    "stews": "Stew",
    "sandwiches": "Sandwich",
    "roasts": "Roast",
    "butter": "Ingredients",
    "alcohol": "Ingredients",
    "bread": "Ingredients",
    "flour": "Ingredients",
    "meat": "Butcher"

    "heal": "Heal",
    "energy": "Energy",
    "gigantify": "Gigantify",
    "resistance": "Resistance",
    "slowfield": "Sticky",
    "poison": "Poison",
    "invisibility": "Invisibility",
    "calming": "Calming",
    "cleanse": "Cleanse",
    "acid": "Acid",
    "berserk": "Berserk",

    "lava": "Lava"
    "gather": "Gathering"
    "tornado": "Tornado"
    "alcohol": "Bootlegger"
}

def getCraftingCategory(item):
    originalCategory = item.get("-craftingcategory", None)
    if not originalCategory:
        return None
    if originalCategory not in craftingCategoryToCategoryMap:
        return originalCategory
    return craftingCategoryToCategoryMap[originalCategory]

def getSpecializationBranchName(item):
    shopCategory = item.get("-shopcategory", None)
    shopCategory1 = item.get("-shopsubcategory1", None)
    shopCategory2 = item.get("-shopsubcategory2", None)
    shopCategory3 = item.get("-shopsubcategory3", None)

    firstKey = f"{shopCategory}-{shopCategory1}-{shopCategory2}-{shopCategory3}"
    secondKey = f"{shopCategory}-{shopCategory1}-{shopCategory2}"
    thirdKey = f"{shopCategory}-{shopCategory1}"
    fourthKey = f"{shopCategory}"
    
    if firstKey in shopCategoriesToSpecializationMap:
        return shopCategoriesToSpecializationMap[firstKey]
    if secondKey in shopCategoriesToSpecializationMap:
        return shopCategoriesToSpecializationMap[secondKey]
    if thirdKey in shopCategoriesToSpecializationMap:
        return shopCategoriesToSpecializationMap[thirdKey]
    if fourthKey in shopCategoriesToSpecializationMap:
        return shopCategoriesToSpecializationMap[fourthKey]
    return shopCategory2

# Transform items into Recipe format
recipes = []
for item in items:
    # Ensure craftingrequirements exists
    if "craftingrequirements" not in item:
        continue
    if "-craftingcategory" not in item:
        continue
    craftingCategory = getCraftingCategory(item)
    specializationBranch = getSpecializationBranchName(item)

    # Get craftresource, which can be a dict or list
    craftRequirements = item.get("craftingrequirements", None)
    if (isinstance(craftRequirements, list)):
        craftRequirements = craftRequirements[0]
    craftresource = craftRequirements["craftresource"] if "craftresource" in craftRequirements else []

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

    recipeId = item["-uniquename"] if "-uniquename" in item else ""
    oldRecipe = next(
        (recipe for recipe in current_recipes if recipe["recipeId"] == recipeId),
        None  # default value if not found
    )
    # try:
        # Create recipe object
    if (item.get("-shopsubcategory2", None) is None):
        print(f"Warning: item {item.get('-uniquename', '')} is missing -shopsubcategory2", file=sys.stderr)
    recipe = {
        "recipeId": recipeId,
        "tier": int(item["-tier"]) if "-tier" in item else 0,
        "quantity": int(craftRequirements.get("-amountcrafted", 1)),
        "ingredients": ingredients,
        "itemValue": oldRecipe["itemValue"] if oldRecipe else None,
        "focus": int(craftRequirements["-craftingfocus"]) if "craftingrequirements" in item and "-craftingfocus" in craftRequirements else None,
        "fame": oldRecipe["fame"] if oldRecipe else None,
        "specializationBranchName": specializationBranch,
        "craftingCategory": craftingCategory
    }
    recipes.append(recipe)
    
        # Handle enchantments if present
    if "enchantments" in item and "enchantment" in item["enchantments"]:
        enchantments = item["enchantments"]["enchantment"]

        # Ensure it's a list
        if isinstance(enchantments, dict):
            enchantments = [enchantments]

        for ench in enchantments:
            enchCraftingRequirements = ench["craftingrequirements"]
            if (isinstance(enchCraftingRequirements, list)):
                enchCraftingRequirements = enchCraftingRequirements[0]
            craftresource = enchCraftingRequirements["craftresource"] if "craftingrequirements" in ench and "craftresource" in enchCraftingRequirements else []

            # Handle both single object and list
            if isinstance(craftresource, dict):
                craftresource = [craftresource]

            # Extract ingredients
            ingredients = []
            for ingredient in craftresource:
                ingredient_data = {
                    "itemId": ingredient.get("-uniquename", ""),
                    "quantity": int(ingredient.get("-count", 0)),
                    "returnable": False if ingredient.get("-maxreturnamount") == "0" else True
                }
                ingredients.append(ingredient_data)

            # Build a unique recipeId for enchantment level
            enchant_level = ench.get("-enchantmentlevel", "0")
            recipeId = f'{item.get("-uniquename", "")}@{enchant_level}'


            recipe = {
                "recipeId": recipeId,
                "tier": int(item.get("-tier", 0)),
                "quantity": int(enchCraftingRequirements.get("-amountcrafted", 1)),
                "ingredients": ingredients,
                "itemValue": oldRecipe["itemValue"] if oldRecipe else None,
                "focus": int(enchCraftingRequirements.get("-craftingfocus", 0)),
                "fame": None,
                "specializationBranchName": specializationBranch,
                "craftingCategory": craftingCategory
            }
            recipes.append(recipe)
    # except Exception as e:
    #     print(f"Error processing enchantment for item {item.get('-uniquename', '')}: {e}")


# Write recipes to recipes.json
with open('recipes.json', 'w') as file:
    json.dump(recipes, file, indent=2)