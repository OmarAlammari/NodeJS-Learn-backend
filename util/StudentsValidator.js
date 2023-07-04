const Ajv = require('ajv');

const schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "pattern": "^[A-Z][a-z]*$"
        },
        "dept": {
            "type": "string",
            "enum": ["SD", "SA", "MD"],
            "maxLength": 2,
            "minLength": 2
        },
    },
    "required": ["name", "dept"],
    "maxProperties": 2
};
const schema1 = {
    type: "object",
    properties: {
        name: {
            "type": "string",
            "pattern": "^[A-Z][a-z]*$"
        },
        dept: {
            "type": "string",
            "enum": ["SD", "SA", "MD"],
            "maxLength": 2,
            "minLength": 2
        },
    },
    required: ["name", "dept"],
    maxProperties: 2
    // additionalProperties: false
};
// let validator = new Ajv.default({ allErrors: true }).compile(schema);
// let validator = new Ajv().compile(schema);
// let validator = new Ajv.default().compile(schema);

module.exports = new Ajv.default().compile(schema);
