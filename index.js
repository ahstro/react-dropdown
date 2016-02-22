'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

class Dropdown extends React.Component {

  displayName: 'Dropdown'

  constructor(props) {
    super(props);
    this.state = {
      multiselect: { [props.value.value]: props.value },
      selected: props.value || { label: props.placeholder || 'Select...', value: '' },
      isOpen: false
    }
    this.mounted = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({selected: newProps.value});
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleMouseDown(event) {

    if (event.type == 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setValue(option) {
    let { multiselect } = this.state
    let newState = {
      multiselect: Object.assign(multiselect, {
        [option.value]: multiselect[option.value] ? null : option
      }),
      selected: option,
    }
    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption (option) {
    let optionClass = classNames({
      'Dropdown-option': true,
      'is-selected': !!this.state.multiselect[option.value]
    });

    return <div key={option.value} className={optionClass} onClick={this.setValue.bind(this, option)}>{option.label}</div>
  }

  buildMenu() {
    let ops = this.props.options.map((option) => {
      if (option.type == 'group') {
        let groupTitle = (<div className='title'>{option.name}</div>);
        let _options = option.items.map((item) => this.renderOption(item));

        return (
          <div className='group' key={option.name}>
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        return this.renderOption(option);
      }
    })

    return ops.length ? ops : <div className='Dropdown-noresults'>No options found</div>;
  }

  handleDocumentClick(event) {
    if(this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({isOpen:false});
      }
    }
  }

  render() {
    const { className, controlClassName, menuClassName } = this.props;
    let value = Object.keys(this.state.multiselect).map(key => this.state.multiselect[key] && this.state.multiselect[key].label).filter(x => !!x).join(', ');
    let menu = this.state.isOpen ? <div className={menuClassName}>{this.buildMenu()}</div> : null;

    let dropdownClass = classNames({
      'Dropdown': true,
      'is-open': this.state.isOpen
    }, className);

    return (
      <div className={dropdownClass}>
        <div className={controlClassName} onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
          <span className='Dropdown-arrow' />
        </div>
        {menu}
      </div>
    );
  }

}
Dropdown.defaultProps = { controlClassName: 'Dropdown-control', menuClassName: 'Dropdown-menu'};
export default Dropdown;
