'''
    This file is for server-side unit tests without mocking.
'''

import unittest
import os
import sys

#python unit_tests.py emptyArrayClass.test_clear_success
#python unit_tests.py addOneClass.test_clear_success
#to run test case of classes
#called func in both results because there seems to be a bug.

# This lets you import from the parent directory (two levels up)
sys.path.append(os.path.abspath("../.."))
from app import clearArray, plusOne

KEY_INPUT = ""
KEY_EXPECTED = ""

class emptyArrayClass(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT:  ['Adamn'],
                KEY_EXPECTED: [],
            },
            {
                KEY_INPUT:  ['Man', 'Woman'],
                KEY_EXPECTED: [],
            },
            {
                KEY_INPUT:  ['KO', 'OK', 'UA'],
                KEY_EXPECTED: [],
            },
            {
                KEY_INPUT:  ['1', '2', '3', '4'],
                KEY_EXPECTED: [],
            }
        ]
    
    def test_clear_success(self):
        for test in self.success_test_params:
            actual_result = clearArray(test[KEY_INPUT])
            expected_result = clearArray([KEY_EXPECTED])
            
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(type(actual_result), type(expected_result))

#Class empty array "OK. 1 more left"

class addOneClass(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT:  11,
                KEY_EXPECTED: 12,
            },
            {
                KEY_INPUT:  100,
                KEY_EXPECTED: 101,
            },
            {
                KEY_INPUT:  99,
                KEY_EXPECTED: 100,
            },
            {
                KEY_INPUT:  98,
                KEY_EXPECTED: 99,
            }
        ]
            
    def test_clear_success(self):
        for test in self.success_test_params:
            
            actual_result = plusOne(test[KEY_INPUT])
            expected_result = plusOne(test[KEY_EXPECTED])
            
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(str(actual_result), str(expected_result))
            
#Class add one "OK. 1 more left"

if __name__ == '__main__':
    unittest.main()