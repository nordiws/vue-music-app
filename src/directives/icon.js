export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value.toString()} text-xl`;
    if (binding.arg === 'full') iconClass = binding.value;
    if (binding.modifiers.right) iconClass += ' float-right';
    iconClass += binding.modifiers.yellow ? ' text-yellow-400' : ' text-green-400';
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}" />`;
  },
};
