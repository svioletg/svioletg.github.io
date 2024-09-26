import traceback
from functools import wraps

def keep_open(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception:
            print(traceback.format_exc())
        input('\nPress ENTER to exit...')
    return wrapper
