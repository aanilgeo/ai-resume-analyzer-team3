from pypdf import PdfReader


def extract_text_from_pdf(pdf_path: str, page_range: tuple = None) -> str:
    try:
        reader = PdfReader(pdf_path)
        text = ""
         # If page_range is provided, limit the pages to extract; otherwise, extract all pages
        pages = reader.pages if not page_range else reader.pages[page_range[0]:page_range[1]]
        for page in pages:
            page_text = page.extract_text()  # Extract text from each page
            if page_text:
                text += page_text
                
        # Normalize text: remove excessive whitespace and line breaks
        return " ".join(text.strip().split())        
        #return text.strip().replace('\n', ' ') #Normalize line breaks
    except Exception as e:
        raise ValueError(f"Error reading PDF file '{pdf_path}': {str(e)}")
        




