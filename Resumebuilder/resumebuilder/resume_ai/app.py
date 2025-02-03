from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from routes.resume_generation import resume_generation_bp
import os

# Initialize Flask App
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'

# Register Blueprint
app.register_blueprint(resume_generation_bp)

# Home Route
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
