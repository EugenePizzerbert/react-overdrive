import React from 'react'
import ReactDOM  from 'react-dom'
import {css} from 'glamor';

const defaultSpeed = 500;
const components = {};

class Overdrive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    animate(prevPosition, prevElement) {
        const {speed = defaultSpeed} = this.props;
        const transition = css({transition: `all ${speed / 1000}s`});
        const bodyElement = document.createElement('div');
        window.document.body.appendChild(bodyElement);

        prevPosition.top += window.scrollY;
        const nextPosition = this.getPosition(true);
        const targetScaleX = prevPosition.width / nextPosition.width;
        const targetScaleY = prevPosition.height / nextPosition.height;
        const targetTransitionX = prevPosition.top / nextPosition.top;
        const targetTransitionY = prevPosition.left / nextPosition.left;

        const sourceStart = React.cloneElement(prevElement, {
            key: '1',
            className: transition.toString(),
            style: {
                ...prevPosition,
                opacity: 1,
                transform: 'scaleX(1) scaleY(1)',
                transformOrigin: '0 0'
            }
        });

        const sourceEnd = React.cloneElement(prevElement, {
            key: '1',
            className: transition.toString(),
            style: {
                ...prevPosition,
                top: nextPosition.top,
                left: nextPosition.left,
                margin: nextPosition.margin,
                borderRadius: nextPosition.borderRadius,
                opacity: 0,
                transform: `scaleX(${1/targetScaleX}) scaleY(${1/targetScaleY})`,
                transformOrigin: '0 0'
            }
        });

        const targetStart = React.cloneElement(this.props.children, {
            key: '2',
            className: transition.toString(),
            style: {
                ...nextPosition,
                top: prevPosition.top,
                left: prevPosition.left,
                margin: prevPosition.margin,
                borderRadius: prevPosition.borderRadius,
                opacity: 0,
                transform: `scaleX(${targetScaleX}) scaleY(${targetScaleY})`,
                transformOrigin: '0 0'
            }
        });

        const targetEnd = React.cloneElement(this.props.children, {
            key: '2',
            className: transition.toString(),
            style: {
                ...nextPosition,
                opacity: 1,
                transform: 'scaleX(1) scaleY(1)',
                transformOrigin: '0 0'
            }
        });

        const start = <div>{sourceStart}{targetStart}</div>;
        const end = <div>{sourceEnd}{targetEnd}</div>;

        this.setState({loading: true});
        ReactDOM.render(start, bodyElement);

        setTimeout(() => {
            ReactDOM.render(end, bodyElement);
            setTimeout(() => {
                this.setState({loading: false});
                window.document.body.removeChild(bodyElement);
            }, speed);
        }, 0);
    }

    componentDidMount() {
        const {id, animationDelay} = this.props;
        if (components[id]) {
            const {prevPosition, prevElement} = components[id];
            components[id] = false;
            if (animationDelay) {
                setTimeout(() => {
                    this.animate(prevPosition, prevElement);
                }, animationDelay);
            }
            else {
                this.animate(prevPosition, prevElement);
            }
        }
        else {
            this.setState({loading: false});
        }
    }

    componentWillUnmount() {
        const {id} = this.props;
        const prevElement = React.cloneElement(this.props.children);
        const prevPosition = this.getPosition();
        components[id] = {
            prevPosition,
            prevElement
        };
        setTimeout(() => {
            components[id] = false;
        }, 100);
    }

    getPosition(addOffset) {
        const node = this.element;
        const rect = node.getBoundingClientRect();
        const computedStyle = getComputedStyle(node);
        const marginTop = parseInt(computedStyle.marginTop, 10);
        const marginLeft = parseInt(computedStyle.marginLeft, 10);
        return {
            top: (rect.top - marginTop) + ((addOffset ? 1 : 0) * window.scrollY),
            left: (rect.left - marginLeft),
            width: rect.width,
            height: rect.height,
            margin: computedStyle.margin,
            borderRadius: computedStyle.borderRadius,
            position: 'absolute'
        };
    }

    render() {
        const {id, speed, animationDelay, style = {}, ...rest} = this.props;
        const newStyle = {
            ...style,
            opacity: (this.state.loading ? 0 : 1)
        };

        return (
            <div ref={c => (this.element = c && c.firstChild)} style={newStyle} {...rest}>
                {this.props.children}
            </div>
        );
    }
}

Overdrive.propTypes = {
    id: React.PropTypes.string.isRequired,
    speed: React.PropTypes.number,
    animationDelay: React.PropTypes.number
};

export default Overdrive;
