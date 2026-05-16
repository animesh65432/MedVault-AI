import json
from .json_serializer import json_serializer

def dumps(data) -> str:
    return json.dumps(data, default=json_serializer)