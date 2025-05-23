# Python Virtual Environment Setup Guide

## What is a Virtual Environment?
A virtual environment is an isolated Python environment that keeps project dependencies separate from your system Python installation.

## Basic Setup

### 1. Create Virtual Environment
```bash
# Navigate to your project directory
cd your-project-name

# Create virtual environment
python -m venv venv
# Or with specific Python version:
# python3.11 -m venv venv
```

### 2. Activate Virtual Environment
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### 3. Install Dependencies
```bash
# With virtual environment activated
pip install package-name
pip install fastapi uvicorn pymongo

# Save dependencies
pip freeze > requirements.txt
```

### 4. Deactivate When Done
```bash
deactivate
```

## Automation Scripts

### Create Activation Script
```bash
# Create activate.sh (macOS/Linux)
echo "source venv/bin/activate" > activate.sh
chmod +x activate.sh

# Now just run:
./activate.sh
```

### Create Setup Script
```bash
#!/bin/bash
# setup.sh - One-time project setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Setup complete! Run 'source venv/bin/activate' to activate environment"
```

## IDE Integration

### VS Code/Cursor
1. Open project folder
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Python: Select Interpreter"
4. Choose the interpreter from your `venv/bin/python` or `venv\Scripts\python.exe`
5. Terminal will auto-activate the environment

## Quick Commands Reference

```bash
# Create environment
python -m venv venv

# Activate
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate          # Windows

# Install packages
pip install package-name

# Save current packages
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt

# Deactivate
deactivate

# Remove environment
rm -rf venv                    # macOS/Linux
rmdir /s venv                  # Windows
```

## Troubleshooting

### Environment Not Activating
```bash
# Check Python installation
which python
python --version

# Recreate environment
rm -rf venv
python -m venv venv
```

### Permission Issues (Windows)
```bash
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Wrong Python Version
```bash
# Use specific Python version
python3.11 -m venv venv
# Or
/usr/bin/python3.11 -m venv venv
```

## Best Practices

1. **Always activate** before installing packages
2. **Keep requirements.txt updated** with `pip freeze > requirements.txt`
3. **Add venv/ to .gitignore** (don't commit virtual environments)
4. **Use one virtual environment per project**
5. **Name it 'venv' or 'env'** for consistency

## .gitignore Template
```
# Virtual Environment
venv/
env/
.venv/

# Python
__pycache__/
*.pyc
*.pyo
```