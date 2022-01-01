import debounce from 'lodash/debounce';

const onViewChange = cb => {
  ['resize', 'orientationchange'].forEach(event => {
    window.addEventListener(event, debounce(cb, 100, {trailing: true}));
  });
}

export default onViewChange
