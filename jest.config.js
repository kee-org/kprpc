// module.exports = {
//     transform: {
//         "^.+\\.tsx?$": "ts-jest",
//     },
//     testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
//     testPathIgnorePatterns: ["/node_modules/"],
//     moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
//     testEnvironment: 'node'
// };
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    //"moduleDirectories": ["<rootDir>", "node_modules"],
    //moduleDirectories: ['node_modules', 'src', __dirname],
    // "rootDir": "./",
    // "modulePaths": [
    //   "<rootDir>"
    // ],
  };
