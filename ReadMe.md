# ReadMe For Python

- First, create a new virtual environment 'python -m venv venv' 
- Then, source to activiate it (depends on which OS u have)
    - bash: 'source venv/Scripts/activate'
    - cmd prompt: '.\venv\Scripts\activate'
- Then 'cd nvml-python'
- Then 'pip install -r requirments.txt' once your venv is active 
- Run main.py: 'python main.py'

## Note: there are little to no docs for the python wrapper for the c-based nvml library

Basically, from reading the docs I can give a little explanation about the important things to note.

1. Each function use is the same but C output parameters are encapsulted in the python return type
2. C structs are converted into python classes
3. All meaningful NVML constants and enums are exposed in Python.

### Example

- In C: nvmlReturn_t nvmlDeviceGetTemperature ( nvmlDevice_t device, nvmlTemperatureSensors_t sensorType, unsigned int* temp )
- In python, we simply can call this function with pynvml.nvmlDeviceGetTemperature(pynvml.nvmlDeviceGetHandleByIndex(0), pynvml.NVML_TEMPERATURE_GPU)

Note how the output parameter becomes absorbed in our function call, and how the constant NVML_TEMPERATURE_GPU is accessible