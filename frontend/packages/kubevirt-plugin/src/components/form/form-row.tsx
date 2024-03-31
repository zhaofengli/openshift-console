import * as React from 'react';
import {
  ExpandableSection,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { RedExclamationCircleIcon } from '@console/dynamic-plugin-sdk';
import { FieldLevelHelp, LoadingInline } from '@console/internal/components/utils';
import { ValidationErrorType, ValidationObject } from '../../selectors';

import './form-row.scss';

export const FormRow: React.FC<FormRowProps> = ({
  fieldId,
  title,
  help,
  isHidden,
  isRequired,
  isLoading,
  validationMessage,
  validationType,
  validation,
  children,
  className,
  rawErrorMessage,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const onToggle = React.useCallback(() => setIsExpanded(!isExpanded), [isExpanded]);
  if (isHidden) {
    return null;
  }
  const type = (validation && validation.type) || validationType;
  const message = validation?.messageKey ? t(validation.messageKey) : validationMessage;
  const errorExpandable = rawErrorMessage && (
    <ExpandableSection
      toggleText={isExpanded ? t('kubevirt-plugin~Less Info') : t('kubevirt-plugin~More Info')}
      onToggle={onToggle}
      isExpanded={isExpanded}
    >
      {t('kubevirt-plugin~Error: {{ rawErrorMessage }}', { rawErrorMessage })}
    </ExpandableSection>
  );
  const errorExpandablePositioning = (
    <div>
      <span className="kubevirt-fort-row__invalid-message-container">{message}</span>
      {errorExpandable}
    </div>
  );

  return (
    <FormGroup
      label={title}
      isRequired={isRequired}
      fieldId={fieldId}
      className={className}
      labelIcon={help && <FieldLevelHelp>{help}</FieldLevelHelp>}
    >
      {isLoading && (
        <span className="kubevirt-form-row__loading-container">
          <LoadingInline />
        </span>
      )}
      {children}

      <FormHelperText>
        <HelperText>
          {type === ValidationErrorType.Error ? (
            <HelperTextItem variant="error" icon={<RedExclamationCircleIcon />}>
              {errorExpandablePositioning}
            </HelperTextItem>
          ) : (
            <HelperTextItem>{message}</HelperTextItem>
          )}
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

type FormRowProps = {
  fieldId: string;
  title?: string;
  help?: React.ReactNode;
  helpTitle?: string;
  isHidden?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  validationMessage?: string;
  validationType?: ValidationErrorType;
  validation?: ValidationObject;
  children?: React.ReactNode;
  className?: string;
  rawErrorMessage?: React.ReactNode;
};
