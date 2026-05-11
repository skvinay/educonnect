# import json
# import firebase_admin
# from firebase_admin import credentials, firestore

# # Path to your service account key JSON
# SERVICE_ACCOUNT_PATH = 'serviceAccountKey.json'

# # Path to your data JSON
# DATA_JSON_PATH = 'career.json'

# # Initialize Firebase app
# cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
# firebase_admin.initialize_app(cred)

# # Initialize Firestore client
# db = firestore.client()

# # Load data from JSON file
# with open(DATA_JSON_PATH, 'r') as f:
#     data_list = json.load(f)  # data_list should be a list of dictionaries

# # Define your collection name in Firestore
# COLLECTION_NAME = 'careerData'

# # Upload data
# for item in data_list:
#     # Add a new document with auto-generated ID
#     db.collection(COLLECTION_NAME).add(item)

# print(f"Successfully uploaded {len(data_list)} documents to Firestore collection '{COLLECTION_NAME}'.")

# import json
# import firebase_admin
# from firebase_admin import credentials, firestore

# cred = credentials.Certificate("./serviceAccountKey.json")
# firebase_admin.initialize_app(cred)

# db = firestore.client(database_id="careercounselling")

# with open("career.json", "r", encoding="utf-8") as f:
#     data = json.load(f)

# for category in data:
#     doc_id = category["id"]
#     db.collection("careerCategories").document(doc_id).set(category)
#     print("Uploaded:", category["title"])

# print("🔥 All career categories uploaded successfully.")
# with open("scholarships.json", "r", encoding="utf-8") as f:
#     scholarships = json.load(f)

# for s in scholarships:
#     doc_id = s["name"].replace(" ", "-").lower()
#     db.collection("nationalScholarships").document(doc_id).set(s)
#     print("Uploaded:", s["name"])

# print("🔥 All scholarships uploaded successfully.")

# with open("careertest.json", "r", encoding="utf-8") as f:
#     data = json.load(f)

# db.collection("careerSelfTest").document("main").set(data)

# print("🔥 Career Self Test uploaded successfully.")

import json
import os

import firebase_admin
from firebase_admin import db


if not firebase_admin._apps:
    database_url = os.getenv("FIREBASE_DATABASE_URL", "").strip()
    if not database_url:
        raise RuntimeError(
            "FIREBASE_DATABASE_URL is required. Use application default credentials and set this env locally."
        )

    firebase_admin.initialize_app(
        options={
            "databaseURL": database_url,
        }
    )

# Load JSON file
with open("scholarships.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Reference to `prod` node
ref = db.reference("prod")

# Upload data under prod
ref.child("nationalScholarships").set(data)

print("🔥 Career Self Test uploaded successfully under /prod")


