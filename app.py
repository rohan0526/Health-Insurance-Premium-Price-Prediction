import joblib
import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)

# Load the model and scaler
loaded_model = joblib.load('models/insurance_model_bagging_better.pkl')
scaler = joblib.load('models/scaler.pkl')



@app.route('/', methods=['GET', 'POST'])
def predict_insurance():
    if request.method == 'POST':
        age = float(request.form['age'])
        bmi = float(request.form['bmi'])
        children = int(request.form['children'])
        smoker = int(request.form['smoker'])

        # Create a DataFrame for new input
        new_data = pd.DataFrame([[age, bmi, children, smoker]], 
                                columns=['age', 'bmi', 'children', 'smoker'])

        # Scale the new data
        new_data_scaled = scaler.transform(new_data)

        # Predict using the scaled data
        result = loaded_model.predict(new_data_scaled)[0]

        return f"${result:.2f}"

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)