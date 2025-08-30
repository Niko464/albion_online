import json

def buildItemValueMap():
    with open('inputs/items.json', 'r') as file:
        itemsJson = json.load(file)
    items = itemsJson.get("items", {}).get("simpleitem", [])
    
    return {
        item["-uniquename"]: float(item["-itemvalue"])
        for item in items
        if "-itemvalue" in item
    }


itemValueMap = buildItemValueMap()

def getItemValueFromCraft(tier, enchantment, craftRequirements):
    craftresource = craftRequirements.get("craftresource", [])
    if isinstance(craftresource, dict):
        craftresource = [craftresource]
    if (item.get("-shopcategory", "") == "consumables"):
        amtItems = sum(int(ingredient.get("-count", 0)) for ingredient in craftresource)
        base = 16 * (2 ** (tier + enchantment - 4))
        return amtItems * base
    # now return the sum of the item values of the ingredient ids
    return sum(itemValueMap.get(ingredient.get("-uniquename", ""), 0) * int(ingredient.get("-count", 0)) for ingredient in craftresource)

# Load data
current_recipes = []  # Placeholder for current_recipes
with open('outputs/parsed_items.json', 'r') as file:
    items = json.load(file)

# Category mappings
craftingCategoryToCategoryMap = {
    "meat_chicken": "food",
    "meat_goat": "food",
    "meat_goose": "food",
    "meat_sheep": "food",
    "meat_pig": "food",
    "meat_cow": "food",
}

shopCategoriesToSpecializationMap = {
    "consumables-food-grilledfish": "Ingredients",
    "consumables-food-salads": "Salad",
    "consumables-food-soups": "Soup",
    "consumables-food-pies": "Pie",
    "consumables-food-omelettes": "Omelette",
    "consumables-food-stews": "Stew",
    "consumables-food-sandwiches": "Sandwich",
    "consumables-food-roasts": "Roast",
    "farming-farmingproducts-butter": "Ingredients",
    "farming-farmingproducts-bread": "Ingredients",
    "farming-farmingproducts-flour": "Ingredients",
    "farming-farmingproducts-meat": "Butcher",
    "consumables-potions-heal": "Heal",
    "consumables-potions-energy": "Energy",
    "consumables-potions-gigantify": "Gigantify",
    "consumables-potions-resistance": "Resistance",
    "consumables-potions-slowfield": "Sticky",
    "consumables-potions-poison": "Poison",
    "consumables-potions-invisibility": "Invisibility",
    "consumables-potions-calming": "Calming",
    "consumables-potions-cleanse": "Cleanse",
    "consumables-potions-acid": "Acid",
    "consumables-potions-berserk": "Berserk",
    "consumables-potions-lava": "Lava",
    "consumables-potions-gather": "Gathering",
    "consumables-potions-tornado": "Tornado",
    # "consumables-potions-alcohol": "Bootlegger"
    "farming-farmingproducts-alcohol": "Bootlegger",
    
}

def getCraftingCategory(item):
    originalCategory = item.get("-craftingcategory")
    itemId = item.get("-uniquename", "")
    if ("ALCOHOL" in itemId):
        print("Found alcohol item:", itemId)
        return "potion"
    return craftingCategoryToCategoryMap.get(originalCategory, originalCategory) if originalCategory else None

def getSpecializationBranchName(item):
    shopCategories = [
        f"{item.get('-shopcategory', '')}-{item.get('-shopsubcategory1', '')}-{item.get('-shopsubcategory2', '')}-{item.get('-shopsubcategory3', '')}",
        f"{item.get('-shopcategory', '')}-{item.get('-shopsubcategory1', '')}-{item.get('-shopsubcategory2', '')}",
        f"{item.get('-shopcategory', '')}-{item.get('-shopsubcategory1', '')}",
        item.get("-shopcategory", '')
    ]
    for key in shopCategories:
        if key in shopCategoriesToSpecializationMap:
            return shopCategoriesToSpecializationMap[key]
    return None

def processCraftResources(craftRequirements):
    craftresource = craftRequirements.get("craftresource", [])
    if isinstance(craftresource, dict):
        craftresource = [craftresource]
    return [
        {
            "itemId": ingredient.get("-uniquename", ""),
            "quantity": int(ingredient.get("-count", 0)),
            "returnable": ingredient.get("-maxreturnamount", "1") != "0"
        } for ingredient in craftresource
    ]

def createRecipe(item, craftRequirements, recipeId, oldRecipe, specializationBranch, craftingCategory, enchantment):
    tier = int(item.get("-tier", 0))
    return {
        "recipeId": recipeId,
        "tier": tier,
        "quantity": int(craftRequirements.get("-amountcrafted", 1)),
        "ingredients": processCraftResources(craftRequirements),
        "itemValue": getItemValueFromCraft(tier, enchantment, craftRequirements),
        "focus": int(craftRequirements.get("-craftingfocus", 0)) if "-craftingfocus" in craftRequirements else None,
        "fame": oldRecipe["fame"] if oldRecipe else None,
        "specializationBranchName": specializationBranch,
        "craftingCategory": craftingCategory
    }

# Process items into recipes
recipes = []
for item in items:
    if "-craftingcategory" not in item or "craftingrequirements" not in item:
        continue

    craftingCategory = getCraftingCategory(item)
    specializationBranch = getSpecializationBranchName(item)
    craftRequirements = item["craftingrequirements"]
    if isinstance(craftRequirements, list):
        craftRequirements = craftRequirements[0]
    
    recipeId = item.get("-uniquename", "")
    oldRecipe = next((recipe for recipe in current_recipes if recipe["recipeId"] == recipeId), None)
    
    # Base recipe
    recipes.append(createRecipe(item, craftRequirements, recipeId, oldRecipe, specializationBranch, craftingCategory, 0))
    
    # Enchantment recipes
    enchantments = item.get("enchantments", {}).get("enchantment", [])
    if isinstance(enchantments, dict):
        enchantments = [enchantments]
    
    for ench in enchantments:
        enchCraftingRequirements = ench.get("craftingrequirements", {})
        if isinstance(enchCraftingRequirements, list):
            enchCraftingRequirements = enchCraftingRequirements[0]
        
        enchant_level = ench.get("-enchantmentlevel", "0")
        enchRecipeId = f"{recipeId}@{enchant_level}"
        recipes.append(createRecipe(item, enchCraftingRequirements, enchRecipeId, oldRecipe, specializationBranch, craftingCategory, int(enchant_level)))

# Write recipes to file
with open('recipes.json', 'w') as file:
    json.dump(recipes, file, indent=2)