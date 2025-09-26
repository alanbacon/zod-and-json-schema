# Overview

- Demonstration of `zod-from-json-schema.convertJsonSchemaToZod` not correctly implementing the oneOf functionality.

- There is also a question on if the `any` type can be avoided on this line:

```
const postNodeSchema = convertJsonSchemaToZod(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  apiDiscriminatedPostNodeSchema as any
);
```

# Running example

## Install

npm install

## Run

npm run start

## Results

```
validInput                     Validation working    , expected PASSED, got PASSED
invalidParentNodeIdInput       Validation working    , expected FAILED, got FAILED
invalidDiscriminatedInput      Validation not working, expected FAILED, got PASSED
invalidTypeInput               Validation not working, expected FAILED, got PASSED
```
