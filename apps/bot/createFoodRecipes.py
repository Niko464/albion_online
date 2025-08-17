import json

with open('current_food_recipes.json', 'r') as file:
    current_recipes = json.load(file)

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

    recipeId = item["-uniquename"] if "-uniquename" in item else ""
    oldRecipe = next(
    (recipe for recipe in current_recipes if recipe["recipeId"] == recipeId),
    None  # default value if not found
)

    # Create recipe object
    recipe = {
        "recipeId": recipeId,
        "tier": int(item["-tier"]) if "-tier" in item else 0,
        "quantity": int(item["craftingrequirements"]["-amountcrafted"]),
        "ingredients": ingredients,
        "itemValue": oldRecipe["itemValue"] if oldRecipe else None,
        "focus": int(item["craftingrequirements"]["-craftingfocus"]) if "craftingrequirements" in item and "-craftingfocus" in item["craftingrequirements"] else None,
        "fame": oldRecipe["fame"] if oldRecipe else None,
        "specializationBranchName": oldRecipe["specializationBranchName"] if oldRecipe else None
    }
    recipes.append(recipe)
    
        # Handle enchantments if present
    if "enchantments" in item and "enchantment" in item["enchantments"]:
        enchantments = item["enchantments"]["enchantment"]

        # Ensure it's a list
        if isinstance(enchantments, dict):
            enchantments = [enchantments]

        for ench in enchantments:
            craftresource = ench["craftingrequirements"]["craftresource"] if "craftingrequirements" in ench and "craftresource" in ench["craftingrequirements"] else []

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
                "quantity": int(ench["craftingrequirements"].get("-amountcrafted", 0)),
                "ingredients": ingredients,
                "itemValue": oldRecipe["itemValue"] if oldRecipe else None,
                "focus": int(ench["craftingrequirements"].get("-craftingfocus", 0)),
                "fame": None,
                "specializationBranchName": oldRecipe["specializationBranchName"] if oldRecipe else None,
            }
            recipes.append(recipe)


# Write recipes to recipes.json
with open('food_recipes.json', 'w') as file:
    json.dump(recipes, file, indent=2)