import React, { useState } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null); //guarda a URL da imagem original
  const [processedImage, setProcessedImage] = useState(null); //guarda a URL da imagem q foi processada
  const [isLoading, setIsLoading] = useState(false); 

  //lida c/ upload de imagem
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; //Pega o arquivo selecionado pelo usuário
    setSelectedImage(URL.createObjectURL(file)); 
  };

  //aq se envia a imagem ao backend p/ processar
  const handleTransfer = async () => {
    const fileInput = document.getElementById('image-upload'); // Pega o input 
    const file = fileInput.files[0]; //pega o arquivo selecionado pelo user

    if (!file) { //lança exceção se tentar apertar o btão e não houver imagem selecionada
      alert("Por favor, selecione uma imagem.");
      return;
    }

    setIsLoading(true); 

    const formData = new FormData(); 
    formData.append('file', file); 

    try {
      //aq envia a imagem ao backend via POST
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); 
      if (data.processed_file) { 
        const processedImageUrl = `http://127.0.0.1:8000/image/${data.filename}`; 
        setProcessedImage(processedImageUrl); 
      }
    } catch (error) { 
      console.error("Erro ao processar a imagem:", error);
    } finally { 
      setIsLoading(false);
    }
  };

  //Parte que deixo para chamar o modelo
  //aqui é para adicionar posteriorment uma chamada ao modelo para processar a imagem-------------

  //-----------------------------------------------------------------------------------------------
  // Renderização do componente
  return (
    <div style={{
      backgroundColor: '#121D37',
      color: '#B3C8F0',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ textAlign: 'center' }}>Envie uma imagem para processamento</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* Input para upload de imagem */}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            padding: '10px',
            backgroundColor: '#1E2A47',
            color: '#B3C8F0',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        />
        {/* Botão para transferir imagem */}
        <button
          onClick={handleTransfer}
          disabled={isLoading} 
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#3A506B' : '#5BC0BE', 
            color: '#B3C8F0',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {isLoading ? 'Processando...' : 'Transferir'} {/* Texto condicional */}
        </button>
      </div>

      {/* Exibição das imagens */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Imagem Original</h2>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Original"
              style={{ maxWidth: '300px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            />
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2>Imagem Processada</h2>
          {isLoading && <p>Processando...</p>} {/* Indicador de carregamento */}
          {processedImage && (
            <img
              src={processedImage}
              alt="Processada"
              style={{ maxWidth: '300px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 