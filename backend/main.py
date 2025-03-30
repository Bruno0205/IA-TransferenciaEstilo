from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import shutil
import os

app = FastAPI()

#caminho da pasta que vai salvar as imagens dos inputs
UPLOAD_DIR = "backend/uploads"
ORIGINAIS_DIR = os.path.join(UPLOAD_DIR, "originais")  #lugar das imagens originais
PROCESSADAS_DIR = os.path.join(UPLOAD_DIR, "processadas")  #lugar das imagens processadas

#cria as pastas se elas n forem carregadas
os.makedirs(ORIGINAIS_DIR, exist_ok=True)
os.makedirs(PROCESSADAS_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    #faz com que a imagem seja salva na pasta
    original_file_path = os.path.join(ORIGINAIS_DIR, file.filename)
    with open(original_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    #simula por enqt o processamento do modelo (aqui só retorna a mesma imagem pra past)
    PROCESSADAS_file_path = os.path.join(PROCESSADAS_DIR, "processada_" + file.filename) #aq é pra substituir pelo caminho da imagem processada quando tiver integrado
    shutil.copy(original_file_path, PROCESSADAS_file_path)  
    
    return {"filename": file.filename, "PROCESSADAS_file": PROCESSADAS_file_path}

@app.get("/image/{filename}")
async def get_image(filename: str):
    #retorna a imagem processada v ia caminho
    file_path = os.path.join(PROCESSADAS_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}