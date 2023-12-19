import '../assets/styles/ToggleIcon.css';

type Props = {
  id: string
  src: string
  fn: Function
  alt?: string
  ariaLabel?: string
  width?: number
}

/**
 * Creates a toggle icon that can be clicked to trigger
 * passed in function. Animation is supported for by
 * using `-icon` append to id to target the icon.
 * <br>
 * 
 * Example: `id='my-item'` to later target icon use `id='my-item-icon'`
 * @param {Props} id - The ID of the toggle icon.
 * @param {Props} src - The source URL of the icon image.
 * @param {Props} fn - The function to be called when the icon is clicked.
 * @param {Props} alt - The alt text of the icon.
 * @param {Props} ariaLabel - The aria-label of the icon.
 * @param {Props} width - The width of the icon. The default is 15px.
 */
const ToggleIcon: React.FC<Props> = ({ id, src, fn, alt, ariaLabel, width = 15 }) => {
    return (
        <div aria-pressed='false' id={id + '-button'} role='button' aria-label={ariaLabel} className="ToggleImage" onClick={() => fn()}>
          <div role='status' aria-label={ariaLabel} id={id + '-status'} className='ToggleImage__circle'/>
          <img alt={alt} id={id + '-icon'} style={{width: `${width}px`}} className='ToggleImage__img' src={src} />
        </div>
    );
}

export default ToggleIcon;