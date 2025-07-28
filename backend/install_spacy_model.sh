#!/bin/bash

# Download spaCy model for the simplified parser
echo "Downloading spaCy English model..."
python -m spacy download en_core_web_sm

echo "spaCy model installation complete!"
