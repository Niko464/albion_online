import json

raw_resource_names = ['HIDE', 'WOOD', 'FIBER', 'ORE', 'ROCK']
refined_resource_names = ['LEATHER', 'PLANKS', 'CLOTH', 'METALBAR', 'STONEBLOCK']

all_resource_ids = []
all_resource_names = raw_resource_names + refined_resource_names

for resource_name in all_resource_names:
    for i in range(1, 9):
        all_resource_ids.append(f"T{i}_{resource_name}")

with open('watch_list.json', 'w') as f:
    json.dump(all_resource_ids, f, indent=2)