import * as React from 'react';
import { Skeleton } from '@patternfly/react-core';
import {
  SelectOption as SelectOptionDeprecated,
  Select as SelectDeprecated,
  SelectVariant as SelectVariantDeprecated,
} from '@patternfly/react-core/deprecated';
import { useTranslation } from 'react-i18next';
import { usePerspectives } from '@console/shared/src';
import { useTelemetry } from '@console/shared/src/hooks/useTelemetry';
import {
  PREFERRED_PERSPECTIVE_USER_SETTING_KEY,
  usePreferredPerspective,
} from './usePreferredPerspective';

const PerspectiveDropdown: React.FC = () => {
  // resources and calls to hooks
  const { t } = useTranslation();
  const fireTelemetryEvent = useTelemetry();
  const perspectiveExtensions = usePerspectives();
  const allPerspectives = perspectiveExtensions.map((extension) => extension.properties);
  const [
    preferredPerspective,
    setPreferredPerspective,
    preferredPerspectiveLoaded,
  ] = usePreferredPerspective();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const loaded: boolean = preferredPerspectiveLoaded;
  const lastViewedLabel: string = t('console-app~Last viewed');

  const selectOptions: JSX.Element[] = React.useMemo(() => {
    const lastPerspectiveOption = (
      <SelectOptionDeprecated key={'lastViewed'} value={lastViewedLabel} />
    );
    const allPerspectiveOptions = allPerspectives
      .sort((currPerspective, nextPerspective) => {
        const { name: currPerspectiveName } = currPerspective;
        const { name: nextPerspectiveName } = nextPerspective;
        if (currPerspectiveName === nextPerspectiveName) {
          return 0;
        }
        return currPerspectiveName > nextPerspectiveName ? 1 : -1;
      })
      .map(({ name }) => <SelectOptionDeprecated key={name} value={name} />);
    return [lastPerspectiveOption, ...allPerspectiveOptions];
  }, [allPerspectives, lastViewedLabel]);

  // utils and callbacks
  const getDropdownLabelForValue = (): string =>
    preferredPerspective
      ? allPerspectives.find((perspective) => perspective.id === preferredPerspective)?.name ??
        lastViewedLabel
      : lastViewedLabel;
  const getDropdownValueForLabel = (selectedLabel: string): string =>
    selectedLabel === lastViewedLabel
      ? null
      : allPerspectives.find((perspective) => perspective.name === selectedLabel)?.id;
  const onToggle = (_event, isOpen: boolean) => setDropdownOpen(isOpen);
  const onSelect = (_, selection) => {
    const selectedValue = getDropdownValueForLabel(selection);
    selectedValue !== preferredPerspective && setPreferredPerspective(selectedValue);
    setDropdownOpen(false);
    fireTelemetryEvent('User Preference Changed', {
      property: PREFERRED_PERSPECTIVE_USER_SETTING_KEY,
      value: selectedValue,
    });
  };

  return loaded ? (
    <SelectDeprecated
      variant={SelectVariantDeprecated.single}
      isOpen={dropdownOpen}
      selections={getDropdownLabelForValue()}
      toggleId={'console.preferredPerspective'}
      onToggle={onToggle}
      onSelect={onSelect}
      placeholderText={t('console-app~Select a perspective')}
      data-test={'dropdown console.preferredPerspective'}
      maxHeight={300}
    >
      {selectOptions}
    </SelectDeprecated>
  ) : (
    <Skeleton
      height="30px"
      width="100%"
      data-test={'dropdown skeleton console.preferredPerspective'}
    />
  );
};

export default PerspectiveDropdown;
