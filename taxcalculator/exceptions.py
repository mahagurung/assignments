class InvalidFormat(Exception):
    """Raised if input csv file is not in expected format"""
    def __init__(self, message):
            self.expression = 'InvalidFormat'
            self.message = message

class ParsingError(Exception):
    """Raised for all parsing errors"""
    def __init__(self, message):
        self.expression = 'ParsingError'
        self.message = message
