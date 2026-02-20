from rest_framework.parsers import MultiPartParser

class CamelCaseMultipartParser(MultiPartParser):
    """
    Converts camelCase keys in multipart/form-data to snake_case
    so DRF serializers receive the correct field names.
    """
    def parse(self, stream, media_type=None, parser_context=None):
        data = super().parse(stream, media_type, parser_context)
        data.data._mutable = True
        for key in list(data.data.keys()):
            value = data.data.pop(key)
            snake_key = "".join(["_" + c.lower() if c.isupper() else c for c in key]).lstrip("_")
            data.data[snake_key] = value
        data.data._mutable = False
        return data
