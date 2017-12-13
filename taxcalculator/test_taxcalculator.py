from receipt import Receipt
import taxcalculator
import unittest

class TestTaxCalculator(unittest.TestCase):

    def test_round_up_to(self):
        receipt = Receipt(None)
        self.assertEqual(receipt._round_up_to(0.56),0.6)
        self.assertEqual(receipt._round_up_to(1.5),1.5)
        self.assertEqual(receipt._round_up_to(10.23),10.25)
        
    def test_fail_on_io_errors(self):
        input_csv = "./test/sample4.csv"
        self.assertFalse(all(taxcalculator.parse_csv_and_return_item_dict(input_csv, None)))

    def test_fail_on_invalid_csv(self):
        input_csv = "./test/sample5.csv"
        fieldnames = ['Quantity', 'Product', 'Price']
        self.assertFalse(all(taxcalculator.parse_csv_and_return_item_dict(input_csv, fieldnames)))

    def test_fail_on_invalid_field_value(self):
        input_csv = "./test/sample6.csv"
        fieldnames = ['Quantity', 'Product', 'Price']
        self.assertFalse(all(taxcalculator.parse_csv_and_return_item_dict(input_csv, fieldnames)))

    def test_parse_valid_file(self):
        fieldnames = ['Quantity', 'Product', 'Price']
        for n in range(1,4):
            self.assertTrue(all(taxcalculator.parse_csv_and_return_item_dict("./test/sample{0}.csv".format(n), fieldnames)))

    def test_taxcalculator_output(self):
        for n in range(1,4):
            output = taxcalculator.main("./test/sample{0}.csv".format(n)).show_receipt()
            with open("./test/output{0}.txt".format(n)) as result_file:
                expected = result_file.read()
                self.assertEqual(output.strip(), expected.strip())

if __name__ == "__main__":
    unittest.main()
