import json

# Charger le fichier GeoJSON
with open("/Users/perlenkounkou/Documents/Cours/Projet2/Backend/data_extraction/trails.geojson", "r") as file:
    data = json.load(file)

# Extraire les éléments de 'features' (données brutes)
features = data.get('features', [])

# Sauvegarder les données brutes dans un fichier JSON
with open('/Users/perlenkounkou/Documents/Cours/Projet2/Backend/data_extraction/trails_raw_data.json', 'w') as f:
    json.dump(features, f, indent=4)

print("Fichier JSON avec les données brutes généré avec succès.")
