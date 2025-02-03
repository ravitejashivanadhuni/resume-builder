import spacy
from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load a pre-trained spaCy model
nlp = spacy.load("en_core_web_lg")

@app.route('/process-resume', methods=['POST'])
def process_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file part"}), 400

    resume_file = request.files['resume']
    job_description = request.form.get('jobDescription', '')

    try:
        resume_text = extract_text_from_pdf(resume_file)
        ats_score = calculate_ats_score(resume_text, job_description)
        suggestions = generate_improvement_suggestions(resume_text, job_description)

        return jsonify({
            "atsScore": ats_score,
            "suggestions": suggestions
        })
    except Exception as e:
        return jsonify({"error": f"Error processing the file: {str(e)}"}), 500

def extract_text_from_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def calculate_ats_score(resume_text, job_description):
    # Convert texts to vectors using spaCy
    resume_doc = nlp(resume_text)
    job_doc = nlp(job_description)
    
    resume_vector = resume_doc.vector
    job_vector = job_doc.vector
    
    similarity = cosine_similarity([resume_vector], [job_vector])[0][0]
    ats_score = int(similarity * 100)  # Normalize to 100
    return ats_score

def generate_improvement_suggestions(resume_text, job_description):
    suggestions = []
    
    # Basic checks for missing sections
    sections = ['experience', 'skills', 'education', 'projects']
    for section in sections:
        if section not in resume_text.lower():
            suggestions.append(f"Consider adding a '{section.capitalize()}' section.")
    
    # Keyword matching suggestions (example)
    missing_keywords = [word for word in job_description.split() if word not in resume_text]
    if missing_keywords:
        suggestions.append(f"Consider adding the following keywords: {', '.join(missing_keywords[:5])}")

    return suggestions

if __name__ == '__main__':
    app.run(debug=True)
