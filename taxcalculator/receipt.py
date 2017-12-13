class Receipt(object):
    
    def __init__(self, fieldnames):
        self.fieldnames = fieldnames
        self.sales_tax = 10
        self.import_duty = 5
        self.total_tax = 0
        self.total_price = 0
        self.items = []

    def _round_up_to(self, x):
        """
        Quick fix to round up x to the nearest 0.05.
        This function expects inputs to be rounded to 2 digits precision
        eg: round(x,2)
        **Ideally should have used the decimal module**
        """
        diff = 0
        last_digit = int(x * 100) % 10

        if last_digit in range(6,10):
            diff = (10 - last_digit)/100.0

        if last_digit in range(1,5):
            diff = (5 - last_digit)/100.0

        return round((x + diff),2)

    def _calculate_tax(self, percentage, shelf_price):
        tax = round((percentage * shelf_price) / 100.0, 2)
        return self._round_up_to(tax)

    def _calculate_sales_tax(self, shelf_price):
        return self._calculate_tax(self.sales_tax, shelf_price)

    def _calculate_import_duty(self, shelf_price):
        return self._calculate_tax(self.import_duty, shelf_price)

    def _process_items(self):
        for item in self.items:
            item['tax'] = 0
            item['total_tax'] = 0
            item['total_price'] = 0

            if item['taxable']:
                item['tax'] += self._calculate_sales_tax(item['price'])
                #print("Tax of {0} is {1}".format(item['product'], item['tax']))

            if item['imported']:
                item['tax'] += self._calculate_import_duty(item['price'])
                #print("Tax of {0} is {1}".format(item['product'], item['tax']))

            item['price'] = item['price'] + item['tax']
            #print("Item total price is {0}".format(item['price']))
            item['total_tax'] = item['tax'] * item['quantity']
            item['total_price'] = item['price'] * item['quantity']
            #print("{0} final {1} and {2}".format(item['product'], item['total_tax'], item['total_price']))

    def calculate_receipt_total(self):
        self._process_items()
        for item in self.items:
            self.total_tax = self.total_tax + item['total_tax']
            self.total_price = self.total_price + item['total_price']


    def show_receipt(self):
        self.calculate_receipt_total()
        
        output = ''

        for item in self.items:
            for i in range(0, len(self.fieldnames)):
                # A dirty hack to format print numbers and floats
                if self.fieldnames[i] == 'Quantity':
                    output += "{value}".format(value=int(item[self.fieldnames[i].lower()]))
                elif self.fieldnames[i] == 'Price':
                    output += "{value:.2f}".format(value=item[self.fieldnames[i].lower()])
                else:
                    output += "{value}".format(value=item[self.fieldnames[i].lower()])

                if i != len(self.fieldnames) - 1:
                    output += ', '
                else:
                    output += "\n"

        output += "\n"
        output += "Sales Taxes: {total_tax:.2f}".format(total_tax=self.total_tax)
        output += "\n"
        output += "Total: {total_price:.2f}".format(total_price=self.total_price)

        return output

    def __repr__(self):
        return self.show_receipt()
