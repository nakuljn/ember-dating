#!/bin/bash
# setup.sh - One-time project setup

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Update pip
python3 -m pip install --upgrade pip

# Run tests
echo "Running tests..."
PYTHONPATH=. pytest tests/ --ignore=tests/disabled/

echo "Setup complete! Run 'source venv/bin/activate' or './activate.sh' to activate environment" 