const builder = require('junit-report-builder');
const { faker } = require('@faker-js/faker');


class TestCasesGenerator {
  constructor () {
    this.suites = process.env.SUITES || 1;
    this.passedTests = process.env.PASSED || 1;
    this.failureTests = process.env.FAILURE || 1;
    this.errorTests = process.env.ERROR || 1;
    this.skippedTests = process.env.SKIPPED || 1;
  }
  generate() {
    for (let i = 0; i<this.suites; i++) {
      const suite = builder.testSuite().name(faker.random.words(40));
      this.generatePassedTestCases(suite);
      this.generateFailedTestCases(suite);
      this.generateErrorTestCases(suite);
      this.generateSkippedTestCases(suite);
    }
    builder.writeTo('test-report.xml');
  }
  generatePassedTestCases(suite) {
    for (let i = 0; i<this.passedTests; i++) {
      suite.testCase()
        .className(faker.internet.userName('Class '))
        .name(faker.random.words(20));
    }
  }
  generateFailedTestCases(suite) {
    for (let i = 0; i<this.failureTests; i++) {
      const testCase = suite.testCase()
      testCase.stacktrace(faker.random.words(1000))
      testCase.className(faker.internet.userName('Class '))
      testCase.name(faker.random.words(1000))
      testCase.failure(faker.random.words(1000))
    }
  }
  generateErrorTestCases(suite) {
    for (let i = 0; i<this.errorTests; i++) {
      suite.testCase()
        .stacktrace(faker.random.words(1000))
        .className(faker.internet.userName('Class '))
        .name(faker.random.words(50))
        .error(faker.random.words(20))
    }
  }
  generateSkippedTestCases(suite) {
    for (let i = 0; i<this.skippedTests; i++) {
      suite.testCase()
        .stacktrace(faker.random.words(1000))
        .className(faker.internet.userName('Class '))
        .name(faker.random.words(20))
        .skipped(faker.random.words(100))
    }
  }
}

const generator = new TestCasesGenerator();
generator.generate();

