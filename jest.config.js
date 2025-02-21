module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "^next$": "<rootDir>/node_modules/next",
      "^next/router$": "<rootDir>/node_modules/next/router",
      "^next/image$": "<rootDir>/__mocks__/next/image.js",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  };