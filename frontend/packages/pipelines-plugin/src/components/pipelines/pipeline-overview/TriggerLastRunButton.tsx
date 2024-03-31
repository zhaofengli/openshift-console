import * as React from 'react';
import { Button } from '@patternfly/react-core';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { impersonateStateToProps } from '@console/dynamic-plugin-sdk';
import { useAccessReview } from '@console/internal/components/utils';
import { AccessReviewResourceAttributes } from '@console/internal/module/k8s';
import { PipelineRunModel } from '../../../models';
import { PipelineRunKind } from '../../../types';
import { rerunPipelineAndStay } from '../../../utils/pipeline-actions';
import { getLatestRun } from '../../../utils/pipeline-augment';
import { returnValidPipelineRunModel } from '../../../utils/pipeline-utils';
import { usePipelineRunWithUserAnnotation } from '../../pipelineruns/triggered-by';

type TriggerLastRunButtonProps = {
  pipelineRuns: PipelineRunKind[];
  namespace: string;
  impersonate?;
};

const TriggerLastRunButton: React.FC<TriggerLastRunButtonProps> = ({
  pipelineRuns,
  namespace,
  impersonate,
}) => {
  const { t } = useTranslation();
  const latestRun = usePipelineRunWithUserAnnotation(getLatestRun(pipelineRuns, 'startTimestamp'));
  const pipelineRunModel = returnValidPipelineRunModel(latestRun);
  const { labelKey, callback, accessReview: utilityAccessReview } = rerunPipelineAndStay(
    pipelineRunModel,
    latestRun,
  );
  const defaultAccessReview: AccessReviewResourceAttributes = {
    group: PipelineRunModel.apiGroup,
    resource: PipelineRunModel.plural,
    namespace,
    verb: 'create',
  };
  const accessReview = _.isEmpty(utilityAccessReview) ? defaultAccessReview : utilityAccessReview;
  const isAllowed = useAccessReview(accessReview, impersonate);
  return (
    isAllowed && (
      <Button
        variant="secondary"
        onClick={callback}
        isDisabled={pipelineRuns.length === 0 && !callback}
      >
        {t(labelKey)}
      </Button>
    )
  );
};

export default connect(impersonateStateToProps)(TriggerLastRunButton);
