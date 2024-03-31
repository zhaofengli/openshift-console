import * as React from 'react';
import { FormikValues, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ImportStrategy } from '@console/git-service/src';
import { getStrategyType } from '@console/internal/components/build';
import { LoadingBox } from '@console/internal/components/utils';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { CheckboxField, EnvironmentField } from '@console/shared';
import { useBuilderImageEnvironments } from '../builder/builderImageHooks';
import FormSection from '../section/FormSection';

export interface BuildConfigSectionProps {
  namespace: string;
  resource?: K8sResourceKind;
  showHeader?: boolean;
}

const BuildConfigSection: React.FC<BuildConfigSectionProps> = ({
  namespace,
  resource,
  showHeader,
}) => {
  const { t } = useTranslation();
  const {
    values: {
      build,
      image: { selected: selectedImage, tag: selectedTag },
      import: { selectedStrategy },
    },
  } = useFormikContext<FormikValues>();
  const buildConfigObj = resource || {
    kind: 'BuildConfig',
    metadata: {
      namespace,
    },
  };
  const [environments, envsLoaded] = useBuilderImageEnvironments(selectedImage, selectedTag);
  const strategyType = getStrategyType(resource?.spec?.strategy?.type);

  const envs =
    selectedStrategy.type === ImportStrategy.SERVERLESS_FUNCTION
      ? build.env
      : (buildConfigObj.spec?.strategy?.[strategyType]?.env || []).filter(
          (e) => !environments.some((env) => env.key === e.name),
        );

  return (
    <FormSection title={showHeader && t('devconsole~Build configuration')} fullWidth>
      {typeof build?.triggers?.webhook === 'boolean' && (
        <CheckboxField
          name="build.triggers.webhook"
          label={t('devconsole~Configure a webhook build trigger')}
        />
      )}
      {typeof build?.triggers?.image === 'boolean' && (
        <CheckboxField
          name="build.triggers.image"
          label={t('devconsole~Automatically build a new Image when the Builder Image changes')}
        />
      )}
      {typeof build?.triggers?.config === 'boolean' && (
        <CheckboxField
          name="build.triggers.config"
          label={t('devconsole~Launch the first build when the build configuration is created')}
        />
      )}
      {envsLoaded ? (
        <EnvironmentField
          name="build.env"
          label={t('devconsole~Environment variables (build and runtime)')}
          obj={buildConfigObj}
          envs={envs}
        />
      ) : (
        <LoadingBox />
      )}
    </FormSection>
  );
};

export default BuildConfigSection;
