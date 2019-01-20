import * as assert from "assert";
import {
  parseTestSelectorsFromTemplate,
  parseTestSelectorsFromTest
} from "../utils";

suite("parseTestSelector Tests", function() {
  test("it parses a template file", function() {
    let templateText = `
            <div data-test-plain-html>

            {{my-component data-test-component-single-line=true}}

            {{my-component
                data-test-component-multi-line=true
            }}

            {{my-component
                data-test-selector-with-static-value="123"
            }}

            {{my-component
                data-test-selector-with-dynamic-value=index
            }}
        `;

    let selectors = parseTestSelectorsFromTemplate(templateText);
    assert.equal(selectors.length, 5, 'There are five selectors parsed');
    assert.equal(selectors[0], 'data-test-plain-html');
    assert.equal(selectors[1], 'data-test-component-single-line');
    assert.equal(selectors[2], "data-test-component-multi-line");
    assert.equal(selectors[3], 'data-test-selector-with-static-value');
    assert.equal(selectors[4], 'data-test-selector-with-dynamic-value');
  });

  test("it parses a test file", function() {
    let testText = `
            '[data-test-basic-selector]'
            '[data-test-selector-with-value="123"]'
        `;
    let selectors = parseTestSelectorsFromTest(testText);
    assert.equal(selectors.length, 2, 'There are two selectors parsed');
    assert.equal(selectors[0], 'data-test-basic-selector');
    assert.equal(selectors[1], 'data-test-selector-with-value="123"');
  });
});
