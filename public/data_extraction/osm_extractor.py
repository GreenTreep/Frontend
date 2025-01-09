import json
import pandas as pd
from shapely.geometry import shape
from pyproj import Proj, transform as pyproj_transform

# Charger le fichier GeoJSON
with open("/Users/perlenkounkou/Documents/Cours/Projet2/Backend/data_extraction/trails.geojson", "r") as file:
    data = json.load(file)

# Extraire les éléments de 'features'
features = data.get('features', [])

# Créer une liste pour stocker les informations extraites
trails = []

# Parcourir les éléments de 'features'
for feature in features:
    # Vérifier si la feature contient des informations géographiques
    if 'geometry' in feature and 'properties' in feature:
        trail = {
            'osm_id': feature.get('id', None),
            'name': feature['properties'].get('name', 'Non spécifié'),
            'route': feature['properties'].get('route', None),
            'geometry': feature['geometry'],
        }
        
        # Essayer d'obtenir l'information 'highway' des 'ways' associés à la relation
        trail['highway'] = feature['properties'].get('highway', 'Non spécifié')
        
        # Calcul de la distance (en mètres) et extraction des coordonnées
        if feature['geometry']['type'] == 'LineString':
            coords = feature['geometry']['coordinates']
            line = shape(feature['geometry'])  # Convertir en objet shapely pour manipuler les géométries
            trail['distance'] = line.length * 1000  # Distance en mètres
            
            # Extraire le point de départ et d'arrivée
            start_lat, start_lon = coords[0]  # Premier point (départ)
            end_lat, end_lon = coords[-1]  # Dernier point (arrivée)
            
            trail['start_lat'] = start_lat
            trail['start_lon'] = start_lon
            trail['end_lat'] = end_lat
            trail['end_lon'] = end_lon
            
            # Ajouter les coordonnées sous forme de liste de tuples
            trail['coordinates'] = [(lon, lat) for lon, lat in coords]
            trail['geometry_type'] = 'LineString'

        elif feature['geometry']['type'] == 'MultiLineString':
            coords = feature['geometry']['coordinates']
            total_distance = 0
            for line_coords in coords:
                line = shape({'type': 'LineString', 'coordinates': line_coords})
                total_distance += line.length * 1000  # Distance en mètres
                
            trail['distance'] = total_distance
            
            # Extraire le point de départ et d'arrivée pour chaque segment
            start_lat, start_lon = coords[0][0]  # Premier point du premier segment
            end_lat, end_lon = coords[-1][-1]  # Dernier point du dernier segment
            
            trail['start_lat'] = start_lat
            trail['start_lon'] = start_lon
            trail['end_lat'] = end_lat
            trail['end_lon'] = end_lon
            
            # Ajouter les coordonnées sous forme de liste de tuples pour chaque segment
            all_coords = []
            for line_coords in coords:
                all_coords.extend([(lon, lat) for lon, lat in line_coords])
            trail['coordinates'] = all_coords
            trail['geometry_type'] = 'MultiLineString'

        trails.append(trail)

# Convertir en DataFrame
df = pd.DataFrame(trails)

# Vérifier les valeurs manquantes dans le DataFrame
print(df.isnull().sum())
print("")
# Vérifier les types de données dans le DataFrame
print(df.dtypes)
# Vérifier les distances négatives ou nulles
invalid_distances = df[df['distance'] <= 0]
print(f"Nombre de parcours avec une distance invalide : {invalid_distances.shape[0]}")
# Vérifier s'il y a des doublons dans les données
duplicates = df[df.duplicated(subset=['osm_id'])]
print(f"Nombre de doublons : {duplicates.shape[0]}")
# Identifier les valeurs extrêmes dans la distance
extreme_distances = df[(df['distance'] < 100) | (df['distance'] > 500000)]
print(f"Nombre de parcours avec des distances extrêmes : {extreme_distances.shape[0]}")

df_cleaned = df.dropna(subset=['route', 'distance', 'start_lat', 'start_lon', 'end_lat', 'end_lon', 'coordinates', 'geometry_type'])
print(df_cleaned.isnull().sum())

# Filtrer les parcours avec des distances valides (entre 100m et 500 000m)
df_cleaned_valid_distances = df_cleaned[(df_cleaned['distance'] >= 100) & (df_cleaned['distance'] <= 500000)]

# Vérifier si des données ont été supprimées
print(f"Nombre de parcours après suppression des distances extrêmes : {df_cleaned_valid_distances.shape[0]}")


# Créer une liste de dictionnaires pour les marqueurs
markers = []

# Parcourir les données nettoyées pour créer les marqueurs
for _, row in df_cleaned_valid_distances.iterrows():
    marker = {
        "name": row['name'],
        "lat": row['start_lat'],
        "lon": row['start_lon'],
        "description": row.get('highway', 'Description non disponible'),
        "distance": f"{row['distance'] / 1000:.2f} km"  # Distance en kilomètres avec 2 décimales
    }
    markers.append(marker)

# Sauvegarder la liste des marqueurs dans un fichier JSON
output_file_path = '/Users/perlenkounkou/Documents/Cours/Projet2/Backend/data_extraction/marqueurs2.json'

with open(output_file_path, 'w') as f:
    json.dump(df, f, indent=4)

print("Fichier JSON généré avec succès.")




# Suppression des lignes avec des valeurs manquantes ou remplissage
#df_cleaned = df.dropna(subset=['osm_id', 'name', 'start_lat', 'start_lon'])  # Exemple de suppression
# df_filled = df.fillna({'name': 'Non spécifié', 'route': 'Non spécifié'})  # Exemple de remplissage

# Réorganiser les colonnes
#df_cleaned = df_cleaned[['osm_id', 'geometry_type', 'highway', 'route', 'name', 'coordinates', 'distance', 'geometry', 'start_lat', 'start_lon', 'end_lat', 'end_lon']]

# Afficher les premiers éléments du DataFrame
#print(df_cleaned.head())

# ------------------------
# Conversion du DataFrame en GeoJSON simplifié
# ------------------------
""" geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "osm_id": row.osm_id,
                "name": row.name,
                "distance": row.distance,
                "route": row.route
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row.start_lon, row.start_lat]
            }
        } for row in df_cleaned.itertuples()
    ]
} """

""" # Sauvegarde dans un fichier GeoJSON avec le nouveau nom
output_path = "/Users/perlenkounkou/Documents/Cours/Projet2/Backend/data_extraction/trails_marker.geojson"
with open(output_path, "w") as f:
    json.dump(geojson, f)

print(f"GeoJSON simplifié sauvegardé dans : {output_path}")
 """