document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultContainer = document.getElementById('result-container');
    const predictionResult = document.getElementById('prediction-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resultContainer.classList.add('hidden');
        
        window.scroll(0, 0);

        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = 'Calculating...';
        form.appendChild(loadingIndicator);

        try {
            const formData = new FormData(form);
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            
            // Create flying input elements
            const inputs = ['age', 'bmi', 'children', 'smoker'];
            const flyingElements = [];

            inputs.forEach((input) => {
                const inputElement = document.getElementById(input);
                const rect = inputElement.getBoundingClientRect();
                
                const flyingInput = document.createElement('div');
                flyingInput.className = 'flying-input';
                flyingInput.textContent = `${formData.get(input)}`;
                flyingInput.style.top = `${rect.top + window.scrollY}px`;
                flyingInput.style.left = `${rect.left + window.scrollX}px`;
                document.body.appendChild(flyingInput);
                flyingElements.push(flyingInput);
            });

            // Animate to center
            setTimeout(() => {
                const containerRect = form.getBoundingClientRect();
                const centerX = containerRect.left + containerRect.width / 2;
                const centerY = containerRect.top + containerRect.height / 2 + 210;

                flyingElements.forEach((element) => {
                    element.style.top = `${centerY}px`;
                    element.style.left = `${centerX}px`;
                    element.style.transform = 'translate(-50%, -50%)';
                });
            }, 100);

            

            // Show result after animation
            setTimeout(() => {
                flyingElements.forEach((element) => {
                    element.remove();
                });
                loadingIndicator.remove();
                resultContainer.classList.remove('hidden');
                resultContainer.style.opacity = '0';
                predictionResult.textContent = result;
                
                

                // Fade in the result
                setTimeout(() => {
                    resultContainer.style.transition = 'opacity 0.5s ease-in-out';
                    resultContainer.style.opacity = '1';
                }, 50);
            }, 2100);


            
        } catch (error) {
            console.error('There was a problem with the prediction:', error);
            loadingIndicator.remove();
            resultContainer.classList.remove('hidden');
            predictionResult.textContent = 'An error occurred. Please try again.';
        }
    });
});

