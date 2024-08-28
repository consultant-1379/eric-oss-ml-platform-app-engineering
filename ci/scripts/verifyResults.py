import json

f = open('summary.json',)
data = json.load(f)

#Get the group section. It contains all tests as list items:
groupsection= data['root_group']['groups']

# Get the string representation of only the root_group.groups collecti
groupstr = json.dumps(groupsection)

# Get only the count of passing as well as failing tests
number_of_passed_tests = groupstr.count('"passes": 1')
number_of_failed_tests= groupstr.count('"fails": 1')
#Count fails starting with '2','3','4', etc if they ever happen
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 2')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 3')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 4')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 5')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 6')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 7')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 8')
number_of_failed_tests= number_of_failed_tests + groupstr.count('"fails": 9')


if number_of_passed_tests != 0 and number_of_failed_tests == 0:
    print("K6 Tests have passed and results are verified.")
    print("Number of tests passed: " + str(number_of_passed_tests))
    print("Number of tests failed: " + str(number_of_failed_tests))
    exit(0)
else:
    print("K6 Tests have failed.")
    print("Number of tests passed: " + str(number_of_passed_tests))
    print("Number of tests failed: " + str(number_of_failed_tests))
    exit(-1)

# import json
# import logging

# f = open('summary.json',)
# data = json.load(f)

# for i in data['root_group']['groups']:
#     for j in data['root_group']['groups'][i]['groups']:
#         for k in data['root_group']['groups'][i]['groups'][j]['checks']:
#             for l in data['root_group']['groups'][i]['groups'][j]['checks'][k]:
#                 if l == 'passes':
#                     number_of_passed_tests = data['root_group']['groups'][i]['groups'][j]['checks'][k]['passes']
#                     if number_of_passed_tests == 0:
#                         exit(-1)
#                 if l == 'fails':
#                     number_of_failed_tests = data['root_group']['groups'][i]['groups'][j]['checks'][k]['fails']
#                     if number_of_failed_tests != 0:
#                         exit(-1)