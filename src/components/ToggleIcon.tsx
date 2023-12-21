import '../assets/styles/ToggleIcon.css';

type Props = {
  name: string
  src: string
  fn: Function
  alt?: string
  keyShortcuts?: string
  title?: string
  width?: number
}

/**
 * Creates a toggle icon that can be clicked to trigger
 * passed in function. Animation is supported for by
 * using `-icon` append to id to target the icon.
 * <br>
 * 
 * Example: `id='my-item'` to later target icon use `id='my-item-icon'`
 * @param {Props} name - The name of the toggle icon.
 * @param {Props} src - The source URL of the icon image.
 * @param {Props} fn - The function to be called when the icon is clicked.
 * @param {Props} alt - The alt text of the icon.
 * @param {Props} keyShortcuts - The keyboard shortcuts
 * @param {Props} title - The tooltip for icon
 * @param {Props} width - The width of the icon. The default is 15px.
 */
const ToggleIcon: React.FC<Props> = ({ name, src, fn, alt, title, keyShortcuts, width = 15 }) => {
    return (
        <div aria-keyshortcuts={keyShortcuts} title={title} aria-label={`${name} off`} id={`toggle-${name}-button`} role='button' className="ToggleImage" onClick={() => fn()}>
          <div role='status' aria-label={`${name} status`} id={`toggle-${name}-status`} className='ToggleImage__circle'/>
          <img alt={alt} id={`toggle-${name}-icon`} style={{width: `${width}px`}} className='ToggleImage__img' src={src} />
        </div>
    );
}

export default ToggleIcon;