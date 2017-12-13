#!/usr/bin/env python3


from receipt import Receipt
from exceptions import InvalidFormat
from exceptions import ParsingError
import sys
import csv
import argparse


fieldnames = ['Quantity', 'Product', 'Price']
non_taxable_items = ['book', 'food', 'chocolate', 'medicine', 'pill']

def parse_csv_and_return_item_dict(input_csv, fieldnames):

    global non_taxable_items
    numeric_fields = ['Quantity', 'Price']

    # Register a new dialect to skip spaces immediately after field separator
    csv.register_dialect('skipspace', skipinitialspace=True)

    try:
        with open(input_csv) as csvfile:

            reader = csv.DictReader(csvfile, dialect='skipspace')


            if reader.fieldnames != fieldnames:
                raise InvalidFormat('Input CSV file missing proper fieldnames')

            for row in reader:
                item = {}

                for fieldname in fieldnames:
                    if fieldname in numeric_fields:
                        try:
                            item[fieldname.lower()] = float(row[fieldname])
                        except ValueError as e:
                            print("{error}".format(error=e))
                            raise InvalidFormat('Invalid value in numeric field')
                    else:
                        item[fieldname.lower()] = row[fieldname]

                item['imported'] = 'imported'.lower() in item['product'].lower()
                item['taxable'] = not any(product in item['product'].lower() for product in non_taxable_items) 
                
                yield item
    except IOError as e:
        print("Failed to open {file}".format(file=input_csv))
        print("{error}".format(error=e))
        yield False

    except InvalidFormat as e:
        print("{error}".format(error=e))
        print("""Expected format:
        Quantity, Product, Price
        1, My awesome product, 2.00""")
        yield False

def main(input_csv):
    global fieldnames
    my_receipt = Receipt(fieldnames)

    for item in parse_csv_and_return_item_dict(input_csv, fieldnames):
        if item:
            my_receipt.items.append(item)
        else:
            raise ParsingError("Error parsing input file")

    return my_receipt

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Calculate tax for items in input csv file')
    parser.add_argument('--file', '-f', dest='input_csv', required=True, help='Absolute path to input csv file')
    args = parser.parse_args()

    try:
        print(main(args.input_csv))
    except ParsingError as e:
        print("{error}".format(error=e))
        sys.exit(126)
