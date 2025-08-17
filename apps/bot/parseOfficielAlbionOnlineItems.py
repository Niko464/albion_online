import json
import copy

# Read the items.json file
with open('items.json', 'r') as file:
    data = json.load(file)

# List of properties to remove
properties_to_remove = [
    "-uicraftsoundstart",
    "-uicraftsoundfinish",
    "-passivespellslots",
    "-hitpointsmax",
    "-magiccooldownreduction"
    "-energymax",
    "-durabilityloss_receivedspell",
    "-movespeed",
    # "-durability",
    "-durabilityloss_spelluse",
    "-itempowerprogressiontype",
    "-attackspeedbonus",
    "-movespeedbonus",
    "-activespellslots",
    "-hitpointsregenerationbonus",
    "-crowdcontrolresistance",
    #"-unlockedtocraft",
    "-magicspelldamagebonus",
    "-magicattackdamagebonus",
    "-energyregenerationbonus",
    "-physicalspelldamagebonus",
    "-abilitypower",
    "-durabilityloss_receivedattack",
    "-healbonus",
    "-physicalattackdamagebonus",
    "-bonusccdurationvsplayers",
    "-bonusccdurationvsmobs",
    "-slottype",
    "-threatbonus",
    "-magiccasttimereduction",
    "-showinmarketplace",
    "-masterymodifier",
    "-magicresistance",
    "-durabilityloss_attack",
    "-unlockedtoequip",
    "-canbeovercharged",
    "-energycostreduction",
    "-bonusdefensevsplayers",
    "-bonusdefensevsmobs",
    "-healmodifier",
    "-hidefromplayeroncontext",
    "-magiccooldownreduction",
    "-energymax",
    "-physicalarmor",
    "-facestate",
    "-skincount"
    "enchantments"
]

# Extract weapons from ["items"]["equipmentitem"] that have craftingrequirements
equipment_items = data.get("items", {}).get("equipmentitem", [])
craftable_weapons = [
    item for item in equipment_items
    if item.get("craftingrequirements") is not None
]

# Remove specified properties from each weapon
filtered_weapons = []
for item in craftable_weapons:
    # Create a copy to avoid modifying the original item
    filtered_item = copy.deepcopy(item)
    for prop in properties_to_remove:
        filtered_item.pop(prop, None)  # Remove property if it exists
    filtered_weapons.append(filtered_item)

# Write the filtered weapons to parsed_items.json
with open('parsed_items.json', 'w') as file:
    json.dump(filtered_weapons, file, indent=2)