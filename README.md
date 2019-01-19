# Ember Test Selector Completion

Completion provider for ember-test-selectors. Scans all open test and template
files for test selectors. Only provides completion when in a test file. In order
to enable suggestions for strings, you must have the following in settings:

```
"editor.quickSuggestions": {
  "other": true,
  "comments": false,
  "strings": true
},
```

