from flask import Blueprint, request, jsonify
from utils.file_parsers import extract_text_from_pdf, extract_text_from_docx
from utils.sanitizer import clean_text
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

resume_generation_bp = Blueprint('resume_generation', __name__)
API_KEY = os.getenv('HUGGING_FACE_API_KEY')
MODEL_URL = os.getenv('MODEL_URL')

@resume_generation_bp.route('/generate-resume', methods=['POST'])
def generate_resume():
    job_description = request.form.get('jobDescription')
    user_details = request.form.get('userDetails')
    file = request.files.get('resumeFile')

    if not job_description:
        return jsonify({'error': 'Job description is required.'}), 400

    resume_text = ''
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('./uploads', filename)
        file.save(file_path)

        if filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_path)
        elif filename.endswith('.docx'):
            resume_text = extract_text_from_docx(file_path)
        else:
            return jsonify({'error': 'Unsupported file format. Only PDF and DOCX are supported.'}), 400

        os.remove(file_path)

    parsed_details = user_details or '{}'

    prompt = f"""
    Job Description: {job_description}
    User Details: {parsed_details}

    Generate a plain text resume:
    - Experience:
    - Projects:
    - Skills:
    """

    response = requests.post(
        MODEL_URL,
        headers={'Authorization': f'Bearer {API_KEY}', 'Content-Type': 'application/json'},
        json={'inputs': prompt},
    )

    if response.status_code != 200:
        return jsonify({'error': 'Failed to generate resume.'}), 500

    data = response.json()
    generated_text = data.get('generated_text', '')

    return jsonify({'generatedText': clean_text(generated_text)})
