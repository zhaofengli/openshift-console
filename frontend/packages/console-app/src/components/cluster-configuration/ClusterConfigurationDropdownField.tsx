import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectVariant as SelectVariantDeprecated,
} from '@patternfly/react-core/deprecated';
import { ClusterConfigurationDropdownField } from '@console/dynamic-plugin-sdk/src';
import { FormLayout } from '@console/shared/src/components/cluster-configuration';
import { useDebounceCallback } from './hooks';
import { ResolvedClusterConfigurationItem } from './types';

type ClusterConfigurationTextFieldProps = {
  item: ResolvedClusterConfigurationItem;
  field: ClusterConfigurationDropdownField;
};

const ClusterConfigurationTextField: React.FC<ClusterConfigurationTextFieldProps> = ({
  item,
  field,
}) => {
  const [value, setValue] = React.useState<string>(field.defaultValue);

  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggle = (_event, open: boolean) => setIsOpen(open);

  const save = useDebounceCallback(() => {
    // eslint-disable-next-line no-console
    console.log('xxx save');
  }, 2000);
  const handleChange = (_, newValue: string) => {
    setIsOpen(false);
    setValue(newValue);
    // eslint-disable-next-line no-console
    console.log('xxx handleChange', newValue);
    save(newValue);
  };

  const options = field.options.map((option) => (
    <SelectOptionDeprecated
      key={option.value}
      value={option.value}
      label={option.label}
      description={option.description}
    />
  ));

  return (
    <FormGroup fieldId={item.id} label={item.label} data-test={`${item.id} field`}>
      <FormLayout>
        <SelectDeprecated
          toggleId={item.id}
          variant={SelectVariantDeprecated.single}
          isOpen={isOpen}
          onToggle={handleToggle}
          selections={value}
          onSelect={handleChange}
          isDisabled={item.readonly}
        >
          {options}
        </SelectDeprecated>
      </FormLayout>

      <FormHelperText>
        <HelperText>
          <HelperTextItem>{item.description}</HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default ClusterConfigurationTextField;
