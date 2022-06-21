import AboutView from '@/views/AboutView.vue';
import { mount } from '@vue/test-utils';

describe('AboutView.vue', () => {
  test('renders inner text', () => {
    const wrapper = mount(AboutView);
    expect(wrapper.text()).toContain('Vue.js');
  });
});
