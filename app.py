from flask import Flask, render_template, request, send_file
import os
from rembg import remove
from PIL import Image
from io import BytesIO

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
OUTPUT_FOLDER = "static/outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/remove-bg", methods=["POST"])
def remove_bg():
    if "image" not in request.files:
        return "No file uploaded", 400

    file = request.files["image"]
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    output_path = os.path.join(OUTPUT_FOLDER, f"processed_{file.filename}")

    file.save(input_path)

    # Process image
    with open(input_path, "rb") as f:
        input_image = f.read()
        output_image = remove(input_image)

    # Convert output to PNG
    image = Image.open(BytesIO(output_image))
    image = image.convert("RGBA")
    image.save(output_path, format="PNG")

    return send_file(output_path, mimetype="image/png")

if __name__ == "__main__":
    app.run(debug=True)
