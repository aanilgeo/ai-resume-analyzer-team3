import os
from reportlab.pdfgen import canvas

# Directory to save sample PDFs
sample_dir = "samples"
os.makedirs(sample_dir, exist_ok=True)

# Create a simple text PDF
c = canvas.Canvas(os.path.join(sample_dir, "simple_text.pdf"))
c.drawString(100, 750, "This is a simple text PDF for testing.")
c.save()

# Create a complex layout PDF
c = canvas.Canvas(os.path.join(sample_dir, "complex_layout.pdf"))
c.drawString(100, 750, "Complex layout text extracted properly.")
c.save()

# Create an image-based PDF (empty for this example)
c = canvas.Canvas(os.path.join(sample_dir, "image_based.pdf"))
c.save()

# Create a multi-page PDF
c = canvas.Canvas(os.path.join(sample_dir, "multi_page.pdf"))
c.drawString(100, 750, "Page 1 content.")
c.showPage()
c.drawString(100, 750, "Page 2 content.")
c.save()

# Create a corrupted PDF (write invalid data)
with open(os.path.join(sample_dir, "corrupted.pdf"), "wb") as f:
    f.write(b"This is not a valid PDF content.")
