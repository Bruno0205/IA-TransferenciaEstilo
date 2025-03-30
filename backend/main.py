from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os

app = FastAPI()

# Pasta para salvar as imagens enviadas
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/process/")
async def process_images(content: UploadFile = File(...), style: UploadFile = File(...)):
    # Salvar as imagens enviadas
    content_path = os.path.join(UPLOAD_DIR, content.filename)
    style_path = os.path.join(UPLOAD_DIR, style.filename)

    with open(content_path, "wb") as f:
        f.write(await content.read())
    with open(style_path, "wb") as f:
        f.write(await style.read())

    # Simulação de processamento (substitua isso pelo modelo de IA)
    result_image_path = "result.jpg"  # Caminho simulado para a imagem resultante

    return JSONResponse(content={"result": result_image_path})