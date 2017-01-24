import React from 'react';
import {Header} from 'components/Header/Header';
import {shallow} from 'enzyme';

describe('(Component) Header', () => {
  let _wrapper;

  beforeEach(() => {
    const breadcrumb = [{path: '/homepage', label: 'Home'}];
    _wrapper = shallow(<Header breadcrumb={breadcrumb} />);
  });

  describe('Navigation links...', () => {
    it('Should render a Link to Home route', () => {
      const home = _wrapper.find('.header__link');
      expect(home).to.exist;
      expect(home.text()).to.match(/<Link \/>/);
    });
  });
});
