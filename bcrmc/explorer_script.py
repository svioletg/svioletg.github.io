import traceback
from functools import wraps
from typing import Any, Callable


def explorer_script(func: Callable[..., None]) -> Callable:
    """Decorator meant for use with scripts opened in the explorer, particularly
    scripts that are meant to have a file or folder dropped onto them.
    Intended to keep the terminal window open even after an error has occurred.
    """
    @wraps(func)
    def wrapper(*args: tuple[Any, ...], **kwargs: dict[str, Any]) -> None:
        try:
            func(*args, **kwargs)
        except Exception:
            print(traceback.format_exc())
        input('\nPress ENTER to exit...')
    return wrapper
