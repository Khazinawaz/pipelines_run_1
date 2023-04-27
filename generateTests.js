const Builder = require('junit-report-builder');
const { faker } = require('@faker-js/faker');
const async = require('async');
class TestCasesGenerator {
  constructor () {
    this.suites = Number.parseInt(process.env.SUITES, 10) || 1000;
    this.passedTests = Number.parseInt(process.env.PASSED) || 250;
    this.failureTests = Number.parseInt(process.env.FAILURE) || 250;
    this.errorTests = Number.parseInt(process.env.ERROR) || 250;
    this.skippedTests =  Number.parseInt(process.env.SKIPPED) || 250;
    this.currentCount = 0;
  }
  async generate() {
    await async.timesLimit(this.suites, 5, async (suiteId) => {
      await this.generateWithBuilder(suiteId);
      this.currentCount+= 1;
      console.log('Completed suite', this.currentCount);
    }, () => {
      console.log('Done');
    })
  }

  async generateWithBuilder(i) {
    const builder = Builder.newBuilder();
    return new Promise((res, rej) => {
      const suite = builder.testSuite().name(faker.random.words(4));
      this.generatePassedTestCases(suite);
      this.generateFailedTestCases(suite);
      this.generateErrorTestCases(suite);
      this.generateSkippedTestCases(suite);
      builder.writeTo(`reports/reports-${i}.xml`);
      return res();
    })
   
  }
  generatePassedTestCases(suite) {
    for (let i = 0; i<this.passedTests; i++) {
      suite.testCase()
        .className(faker.internet.userName('Class '))
        .name(faker.random.words(2));
    }
  }
  generateFailedTestCases(suite) {
    for (let i = 0; i<this.failureTests; i++) {
      const testCase = suite.testCase()
      testCase.stacktrace(faker.random.words(100))
      testCase.className(faker.internet.userName('Class '))
      testCase.name(faker.random.words(5))
      testCase.failure(faker.random.words(5))
    }
  }
  generateErrorTestCases(suite) {
    for (let i = 0; i<this.errorTests; i++) {
      suite.testCase()
        .stacktrace(faker.random.words(100))
        .className(faker.internet.userName('Class '))
        .name(faker.random.words(5))
        .error(faker.random.words(2))
    }
  }
  generateSkippedTestCases(suite) {
    for (let i = 0; i<this.skippedTests; i++) {
      suite.testCase()
        .stacktrace(faker.random.words(100))
        .className(faker.internet.userName('Class '))
        .name(faker.random.words(2))
        .skipped(faker.random.words(10))
    }
  }
}

const generator = new TestCasesGenerator();
generator.generate();

