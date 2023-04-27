const Builder = require('junit-report-builder');
const { faker } = require('@faker-js/faker');
const async = require('async');
class TestCasesGenerator {
  constructor () {
    this.suites = process.env.SUITES || 1000;
    this.passedTests = process.env.PASSED || 25;
    this.failureTests = process.env.FAILURE || 25;
    this.errorTests = process.env.ERROR || 25;
    this.skippedTests = process.env.SKIPPED || 25;
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
      const suite = builder.testSuite().name(faker.random.words(40));
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

