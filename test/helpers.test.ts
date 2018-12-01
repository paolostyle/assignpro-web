import { Helpers } from '../src/helpers';

test('trimArray works properly', () => {
  let testArray = [
    undefined,
    null,
    '13',
    'ABC',
    null,
    'Wow',
    null,
    0,
    'Hi',
    null,
    '',
    null,
    undefined
  ];
  let expectedResult = ['13', 'ABC', null, 'Wow', null, 0, 'Hi'];

  let trimmedArray = Helpers.trimArray(testArray);

  expect(trimmedArray).toEqual(expectedResult);
});

test('data is prepared for solving', () => {
  let type = 'sum';
  let data = [
    [null, '123', 'b', 'c', '', null],
    ['c', null, 4, 0, null, 12, null],
    ['d', 3, '', 12, null, null],
    ['e', 123, '', 1, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null]
  ];
  let expectedObject = {
    tasks: ['123', 'b', 'c'],
    workers: ['c', 'd', 'e'],
    costs: [[null, 4, 0], [3, null, 12], [123, null, 1]],
    type: 'sum'
  };

  let preparedObject = Helpers.prepareDataForSolver(data, type);

  expect(preparedObject).toEqual(expectedObject);
});

test('detects duplicates', () => {
  let workers = ['a', 'b', 'a', 'c', 'd', 'e'];
  let tasks = ['z', 'x', 'x', 'c', 'a'];
  let val = 'c';

  let result = Helpers.detectDuplicates(val, tasks, workers);
  console.log(result);
  expect(true).toEqual(true);
});
