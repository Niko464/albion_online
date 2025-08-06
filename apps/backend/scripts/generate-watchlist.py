import json

raw_resource_names = ['HIDE', 'WOOD', 'FIBER', 'ORE', 'ROCK']
refined_resource_names = ['LEATHER', 'PLANKS', 'CLOTH', 'METALBAR', 'STONEBLOCK']

cooking_ingredients = ['T1_CARROT', 'T2_BEAN', 'T3_WHEAT', 'T4_TURNIP', 'T5_CABBAGE', 'T6_POTATO', 'T7_CORN', 'T8_PUMPKIN']

all_resource_ids = []
all_resource_names = raw_resource_names + refined_resource_names

for resource_name in all_resource_names:
    for i in range(1, 9):
        all_resource_ids.append(f"T{i}_{resource_name}")

all_resource_ids += cooking_ingredients


with open('src/watch_list.json', 'w') as f:
    json.dump(all_resource_ids, f, indent=2)