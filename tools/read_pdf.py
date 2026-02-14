from pypdf import PdfReader
import sys

try:
    reader = PdfReader(sys.argv[1])
    for page in reader.pages:
        print(page.extract_text())
except Exception as e:
    print(f"Error reading PDF: {e}")
