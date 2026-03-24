module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-case": [2, "always", "lower-case"],
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "test", "chore"]]
  }
};
