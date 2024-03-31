import * as React from 'react';
import { shallow } from 'enzyme';
import { FormFooter } from '@console/shared/src/components/form-utils';
import { formikFormProps } from '@console/shared/src/test-utils/formik-props-utils';
import AdvancedSection from '../advanced/AdvancedSection';
import AppSection from '../app/AppSection';
import DeployImageForm from '../DeployImageForm';
import { DeploySection } from '../DeploySection';
import ImageSearchSection from '../image-search/ImageSearchSection';
import IconSection from '../section/IconSection';

let deployImageFormProps: React.ComponentProps<typeof DeployImageForm>;

describe('DeployImageForm', () => {
  beforeEach(() => {
    deployImageFormProps = {
      ...formikFormProps,
      projects: {
        loaded: true,
        data: [],
      },
    };
  });

  it('should render ImageSearchSection, IconSection, AppSection, AdvancedSection and FormFooter', () => {
    const wrapper = shallow(<DeployImageForm {...deployImageFormProps} />);
    expect(wrapper.find(ImageSearchSection).exists()).toBe(true);
    expect(wrapper.find(IconSection).exists()).toBe(true);
    expect(wrapper.find(AppSection).exists()).toBe(true);
    expect(wrapper.find(DeploySection).exists()).toBe(true);
    expect(wrapper.find(AdvancedSection).exists()).toBe(true);
    expect(wrapper.find(FormFooter).exists()).toBe(true);
  });
});
