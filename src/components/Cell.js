const Cell = (props) => {

  const handleClick = () => {
    !props.gameOver && 
    !props.pause && 
    props.updateRows(props.rowPosition, props.columnPosition);
  }

  return (
    <div 
      className='cell' 
      onClick={handleClick}
    >
      <div className={`shape-${props.cell}`}></div>
    </div>
  )
}

export default Cell;