from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

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
        # Pydantic a DataFrame
        input_data = pd.DateFrame([features.dict()])
        # Alinear columnas
        input_data = input_data.reindex(columns=model_columns, fill_value=0)
        # Columnas a escalar
        vars_to_scale = ['area', 'bedrooms', 'bathroomes', 'stories', 'parking']
        # Escalar
        input_data[vars_to_scale] = scaler.transform(input_data[vars_to_scale])
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