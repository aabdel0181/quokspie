# ReadMe For Python

- First, create a new virtual environment 'python -m venv venv' 
- Then, source to activiate it (depends on which OS u have)
    - bash: 'source venv/Scripts/activate'
    - cmd prompt: '.\venv\Scripts\activate'
- Then 'cd nvml-python'
- Then 'pip install -r requirements.txt' once your venv is active 
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




### node/npm versions
```
  npm: '10.2.4',
  node: '20.11.1',
  acorn: '8.11.2',
  ada: '2.7.4',
  ares: '1.20.1',
  base64: '0.5.1',
  brotli: '1.0.9',
  cjs_module_lexer: '1.2.2',
  cldr: '43.1',
  icu: '73.2',
  llhttp: '8.1.1',
  modules: '115',
  napi: '9',
  nghttp2: '1.58.0',
  nghttp3: '0.7.0',
  ngtcp2: '0.8.1',
  openssl: '3.0.13+quic',
  simdutf: '4.0.4',
  tz: '2023c',
  undici: '5.28.3',
  unicode: '15.0',
  uv: '1.46.0',
  uvwasi: '0.0.19',
  v8: '11.3.244.8-node.17',
  zlib: '1.2.13.1-motley-5daffc7'
```
