import { FromSchema } from 'json-schema-to-ts';
import z from 'zod';
import { convertJsonSchemaToZod } from 'zod-from-json-schema';

export const apiDiscriminatedPostNodeSchema = {
  type: 'object',
  required: ['nodeType', 'parentNodeId'],
  properties: {
    // Common properties defined ONCE at the top level
    parentNodeId: {
      type: 'string',
    },
    value: {
      type: 'string',
    },
  },
  oneOf: [
    {
      // QUESTION Node - only discriminator and variant-specific properties
      properties: {
        nodeType: { const: 'QUESTION' },
        nodeSpecifics: {
          type: 'object',
          properties: {
            questionName: {
              type: ['string', 'null'],
            },
          },
          unevaluatedProperties: false,
        },
      },
    },
    {
      // DECISION Node
      properties: {
        nodeType: { const: 'DECISION' },
        nodeSpecifics: {
          type: 'object',
          properties: {
            notes: { type: ['string', 'null'] },
          },
          unevaluatedProperties: false,
        },
      },
    },
  ],
  unevaluatedProperties: false,
} as const;

type ApiDiscriminatedPostNodeSchema = FromSchema<
  typeof apiDiscriminatedPostNodeSchema
>;

const postNodeSchema = convertJsonSchemaToZod(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  apiDiscriminatedPostNodeSchema as any
);

const testDefinitions = {
  validInput: {
    input: {
      parentNodeId: '123',
      value: '456',
      nodeType: 'QUESTION', // the type here defines what's allowed in the nodeSpecifics, and in this case they match
      nodeSpecifics: {
        questionName: 'What is your name?',
      },
    },
    expectedResult: true,
  },
  invalidParentNodeIdInput: {
    input: {
      parentNodeId: null,
      value: '456',
      nodeType: 'QUESTION',
      nodeSpecifics: {
        questionName: 'What is your name?',
      },
    },
    expectedResult: false,
  },
  invalidDiscriminatedInput: {
    input: {
      parentNodeId: '123',
      value: '456',
      nodeType: 'DECISION', // the type here defines what's allowed in the nodeSpecifics, and in this case they don't match
      nodeSpecifics: {
        questionName: 'What is your name?',
      },
    },
    expectedResult: false,
  },
  invalidTypeInput: {
    input: {
      parentNodeId: '123',
      value: '456',
      nodeType: 'INVALID', // the type here defines what's allowed in the nodeSpecifics, the node type is completely invalid
      nodeSpecifics: {
        questionName: 'What is your name?',
      },
    },
    expectedResult: false,
  },
};

function checkSchemaIsWorking(
  testName: string,
  input: unknown,
  schema: z.ZodType<ApiDiscriminatedPostNodeSchema>,
  expectedResult: boolean
) {
  let validatedInput: ApiDiscriminatedPostNodeSchema;
  let validationPassed: boolean;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validatedInput = schema.parse(input);
    validationPassed = true;
  } catch {
    validationPassed = false;
  }

  if (validationPassed == expectedResult) {
    console.log(
      `${testName.padEnd(30)} Validation working    , expected ${
        expectedResult ? 'PASSED' : 'FAILED'
      }, got ${validationPassed ? 'PASSED' : 'FAILED'}`
    );
  } else {
    console.log(
      `${testName.padEnd(30)} Validation not working, expected ${
        expectedResult ? 'PASSED' : 'FAILED'
      }, got ${validationPassed ? 'PASSED' : 'FAILED'}`
    );
  }
}

function runTests() {
  Object.entries(testDefinitions).forEach(([testName, test]) => {
    checkSchemaIsWorking(
      testName,
      test.input,
      postNodeSchema as z.ZodType<ApiDiscriminatedPostNodeSchema>,
      test.expectedResult
    );
  });
}

runTests();
