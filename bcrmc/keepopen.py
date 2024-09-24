import traceback

def keep_open(func):
    def wrapper(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception:
            print(traceback.format_exc())
        input('\nPress ENTER to exit...')
    return wrapper
