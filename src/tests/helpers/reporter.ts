import {
    DisplayProcessor,
    SpecReporter,
    StacktraceOption,
} from 'jasmine-spec-reporter';
import { CustomReporterResult } from 'jasmine-spec-reporter/built/spec-reporter';

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(
        info: jasmine.JasmineStartedInfo,
        log: string,
    ): string {
        return `${log}`;
    }
    public displaySpecStarted(spec: CustomReporterResult, log: string): string {
        return `${spec.id}: ${log}`;
    }

    public displaySuite(suite: CustomReporterResult, log: string): string {
        return `${suite.id} - ${log}`;
    }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.NONE,
        },
        customProcessors: [CustomProcessor],
    }),
);
