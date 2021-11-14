const {
  caculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheits,
  add,
} = require('../src/math');

// Sync
test('Should calculate total with tip', () => {
  const total = caculateTip(10, 0.3);
  expect(total).toBe(13);
});

test('Should convert 32 F to 0 C', () => {
  const celsius = fahrenheitToCelsius(32);
  expect(celsius).toBe(0);
});

test('Should convert O C  to 32 F', () => {
  const celsius = celsiusToFahrenheits(0);
  expect(celsius).toBe(32);
});

// Async
test('Should add two numbers', done => {
  add(1, 3).then(sum => {
    expect(sum).toBe(4);
    done();
  });
});

test('Should add two numbers async/await', async () => {
  const sum = await add(1, 3);
  expect(sum).toBe(4);
});
