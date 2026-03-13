import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
from . import models

def generate_offer_letter_pdf(candidate: models.Candidate, salary: str, joining_date: str, manager_name: str, expiration_date: str, hr_name: str, upload_dir: str):
    filename = f"offer_letter_{candidate.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    file_path = os.path.join(upload_dir, filename)
    
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 80, "Job Offer Letter")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 120, f"Date: {datetime.now().strftime('%B %d, %Y')}")
    
    c.drawString(50, height - 160, f"To: {candidate.full_name}")
    c.drawString(50, height - 190, "Subject: Offer of Employment")
    
    first_name = candidate.full_name.split()[0]
    c.drawString(50, height - 230, f"Dear {first_name},")

    text = c.beginText(50, height - 270)
    text.setFont("Helvetica", 12)
    company_name = "3 Minds HRMS"
    lines = [
        f"We are pleased to offer you the position of {candidate.position} at {company_name}. We were",
        "impressed with your background and believe you will be a great fit for our team.",
        "",
        "Offer Details:",
        "",
        f"Start Date: {joining_date}",
        "",
        f"Salary: {salary}",
        "",
        f"Reporting to: {manager_name}",
        "",
        "This offer is contingent upon a standard background check. Please sign and return",
        f"this letter by {expiration_date} to indicate your acceptance.",
        "",
        "We look forward to having you on board!",
        "",
        "Best regards,",
        "",
        hr_name,
        "Human Resources",
        "",
        company_name
    ]
    for line in lines:
        text.textLine(line)
    
    c.drawText(text)
    c.save()
    
    return filename, file_path
