"""General helper python functions for the website repository.
"""
import os

def try_create_dir(dir_path):
    """Create a directory if it does not exist.

    Args:
        dir_path (str): The path to the directory to create.
    """
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        print(f"Created directory: {dir_path}")