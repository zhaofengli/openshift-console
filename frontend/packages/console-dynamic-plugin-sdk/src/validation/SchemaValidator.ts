import * as Ajv from 'ajv';
import { BaseValidator } from './BaseValidator';

export class SchemaValidator extends BaseValidator {
  constructor(description: string, private readonly ajv = new Ajv({ allErrors: true })) {
    super(description);
  }

  validate(schema: {}, data: any, dataVar: string = 'obj') {
    if (!this.ajv.validate(schema, data)) {
      this.ajv.errors.forEach((error) => {
        // This format is consistent with ajv.errorsText() implementation
        this.result.addError(`${dataVar}${error.dataPath} ${error.message}`);
      });
    }

    return this.result;
  }
}
