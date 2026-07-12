import sys
import os

# Add the backend directory to the path so we can import models and routes
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

from main import app
