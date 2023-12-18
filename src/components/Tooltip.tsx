import '../assets/styles/Tooltip.css';

type Props = {
  msg: string
  children?: React.ReactNode
}

/**
 * Creates a tooltip with the given message and children.
 * @param {Props} msg - The message of the tooltip.
 * @param {Props} children - The children of the tooltip.
 */
const Tooltip: React.FC<Props> = ({ msg, children }) => {
    return (
        <div id="Tooltip">
            <div data-testid='tooltip' id="Tooltip__msg">{msg}</div>
            {children}
        </div>
    );
}

export default Tooltip;