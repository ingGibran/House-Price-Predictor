from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
Cargar modelo, escalador y columnas
'''
model = joblib.load('modelo_housing.joblib')
scaler = joblib.load('escalador_housing.joblib')
model_columns = joblib.load('columnas_housing.joblib')

'''
Definir esquema de datos de entrada
'''
class HouseInput(BaseModel):
    area: float
    bedrooms: int
    bathrooms: int
    stories: int
    mainroad: int
    basement: int
    hotwaterheating: int
    airconditioning: int
    parking: int
    prefarea: int
    

@app.post('/predict')
def predict_price(features: HouseInput):
    try:
        # Convertir input a diccionario
        input_dict = features.dict()
        
        # Crear lista ordenada basada en model_columns
        # model_columns es un Index de pandas guardado, pero se comporta como lista iterable
        input_list = [input_dict.get(col, 0) for col in model_columns]
        
        # Convertir a numpy array (1 fila, n columnas)
        input_data = np.array([input_list])
        
        # Columnas a escalar (indices)
        # ['area', 'bedrooms', 'bathrooms', 'stories', 'parking']
        # Necesitamos saber sus índices en model_columns para escalar solo esos
        
        # Mapeo de nombres a índices
        col_to_idx = {col: i for i, col in enumerate(model_columns)}
        vars_to_scale = ['area', 'bedrooms', 'bathrooms', 'stories', 'parking']
        indices_to_scale = [col_to_idx[col] for col in vars_to_scale]
        
        # Escalar solo las columnas seleccionadas
        # El scaler espera un array con SOLAMENTE las columnas que se entrenaron para escalar?
        # O espera todas y transforma solo algunas?
        # Si usaron ColumnTransformer o similar, es complejo.
        # Si usaron scaler.fit(df[vars]), entonces el scaler espera SOLO esas columnas.
        # En el código original: input_data[vars_to_scale] = scaler.transform(input_data[vars_to_scale])
        # Esto implica que el scaler fue entrenado SOLO con esas variables.
        
        # Extraer datos a escalar
        data_to_scale = input_data[:, indices_to_scale]
        
        # Transformar
        scaled_data = scaler.transform(data_to_scale)
        
        # Reemplazar en el array original
        input_data[:, indices_to_scale] = scaled_data
        
        # Predecir
        prediction = model.predict(input_data)
        
        return {
            "prediction_price": float(prediction[0]),
            "details": "Prediction successful"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)