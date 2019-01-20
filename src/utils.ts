export function isTestFile(fileName: string) {
  return /-test.(:?js|ts)/.test(fileName);
}

export function isTemplateFile(fileName: string) {
  return fileName.endsWith('.hbs');
}

export function matchCompletionTrigger(linePrefix: string) {
  return linePrefix.match(/\[d.*/);
}

/**
 * In a template file we just match the test selector attribute but not the
 * value. This is for simplicity since the value might be static or dynamic or
 * insignificant (sometimes it is set to the boolean 'true', which is
 * meaningless)
 *
 * @param text full text for a template file
 * @return an array of test selectors
 */
export function parseTestSelectorsFromTemplate(text: string): string[] {
  return text.match(/data-test-[a-z_\-]+/g) || [];
}

/**
 * In a test file we can match on anything between square brackets, which will
 * also capture test selectors which are using both the attribute and a value.
 *
 * @param text full text for a test file
 * @return an array of test selectors
 */
export function parseTestSelectorsFromTest(text: string): string[] {
  return (text.match(/\[data-test-[^\]]+\]/g) || []).map(match => {
    // strip leading and trailing brackets
    return match.substr(1, match.length - 2);
  });
}

/**
 * We only want to parse selectors from test and template files
 */
export function shouldParseTestSelectors(fileName: string) {
  return (
    fileName.endsWith(".hbs") ||
    fileName.endsWith("-test.js") ||
    fileName.endsWith("-test.ts")
  );
}

export function getParsingFunction(fileName: string): Function {
  let parsingFunction: Function;

  if (isTestFile(fileName)) {
    parsingFunction = parseTestSelectorsFromTest;
  } else {
    parsingFunction = parseTestSelectorsFromTemplate;
  }

  return parsingFunction;
}