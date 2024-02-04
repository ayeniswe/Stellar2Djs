import { useRef } from 'react';
import './style.css';
import { ToggleIconProps } from './type';
/**
 * Creates a toggle icon button 
 */
const ToggleIcon: React.FC<ToggleIconProps> = ({ name, src, fn, title, keyShortcuts}) => {
    const button = useRef<HTMLButtonElement>(null);
    const status = useRef<SVGCircleElement>(null);
    const icon = useRef<HTMLImageElement>(null);
    return (
        <button id={name} ref={button} className='ToggleIcon' aria-keyshortcuts={keyShortcuts} aria-label={`${name} off`} title={title} onClick={() => fn(button.current, status.current, icon.current)}>
            {/* On/Off Status Circle */}
            <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="5" fill='black'/>
                <circle id={`${name}Status`} ref={status} cx="5" cy="5" r="2.5" fill='white'/>
            </svg>
            <div>
                <img ref={icon} alt={name} src={src} />
            </div>
        </button>
    );
}
export default ToggleIcon;