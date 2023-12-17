import '../assets/styles/ToggleIcon.css';

type Props = {
  id: string
  src: string
  fn: Function
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
 * @param {Props} width - The width of the icon. The default is 15px.
 */
const ToggleIcon: React.FC<Props> = ({ id, src, fn, width = 15 }) => {
    return (
        <div id="ToggleImage" onClick={() => fn()}>
          <div id={id} className='ToggleImage__circle'/>
          <img id={id + '-icon'} style={{width: `${width}px`}} className='ToggleImage__img' src={src}/>
        </div>
    );
}

export default ToggleIcon;