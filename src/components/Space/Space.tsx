import * as React from 'react'

import styled from 'styled-components'

import { sort } from '../../helpers/sort'
import { Cell } from '../Cell/Cell'

const cellSize = 30
const rows = 20
const collumnsPerRows = 10 

const SpaceRoot = styled.div<{ size: number }>`
  width: ${props => props.size * 10}px;
  border: 1px solid #000;
`

const Row = styled.div`
  display: flex;
`

interface IPoint {
  x: number
  y: number
}

export type Coords = IPoint[]

interface IState {
  speedTime: number
  positionX: number
  positionY: number
  orientation: number
  removedLines: number[]
  occupiedCell: Coords
}

export type State = 'run' | 'pause' | 'end'

const rowsArr = Array(rows).fill(null)
const cellArr = Array(collumnsPerRows).fill(null)

interface IProps {
  state: State
  figure: Coords[]
  onFinishStep: (linesCount: number) => void
  onFinishGame: () => void
}

const defaultState: IState = {
  speedTime: 500,
  positionX: 4,
  positionY: 0,
  orientation: 0,
  removedLines: [],
  occupiedCell: []
}

export class Space extends React.PureComponent<IProps, IState> {
  timer: number
  state = defaultState

  componentDidMount() {
    this.timer = setInterval(this.tick, this.state.speedTime)
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.state === 'end' && this.props.state === 'run') {
      this.setState(defaultState)
    }
  }

  tick = () => {
    if (this.props.state === 'run') {
      this.moveDown()
    }
  }

  endOfStep = () => {
    const { occupiedCell, positionY, positionX, orientation } = this.state
    const { figure, onFinishStep, onFinishGame } = this.props
    if (this.state.removedLines.length > 0) {
      return
    }
    const isEndOfGame = figure[orientation].some(point => positionY + point.y === 0)
    const figurePoints: Coords = figure[orientation].map(point => ({ x: positionX + point.x, y: positionY - point.y }))
    let newOccupiedCell = [...occupiedCell, ...figurePoints]
    const removedLines = sort(figurePoints.reduce((acc, point) => {
      const notHasEmpty = cellArr.every((_cell, index) => this.isOccupiedCell(point.y, index, newOccupiedCell))
      if (notHasEmpty && !acc.includes(point.y)) {
        return [...acc, point.y]
      }
      return acc
    }, []))
    newOccupiedCell = newOccupiedCell.filter(point => !removedLines.includes(point.y))

    removedLines.forEach(row => {
      newOccupiedCell = newOccupiedCell.map(point =>  (point.y < row) ? { x: point.x, y: point.y + 1 } : point)
    })

    if (removedLines.length > 0) {
      this.setState({
        removedLines
      })

      setTimeout(() => {
        onFinishStep(removedLines.length)
        this.setState({
          removedLines: [],
          positionX: 5,
          positionY: 0,
          orientation: 0,
          occupiedCell: newOccupiedCell,
        })
      }, 500)
    } else {
      if(isEndOfGame) {
        onFinishGame()
      } else {
        onFinishStep(removedLines.length)
        this.setState({
          speedTime: 500,
          removedLines: [],
          positionX: 5,
          positionY: 0,
          orientation: 0,
          occupiedCell: newOccupiedCell,
        })
      }
    }
  }

  moveLeft = () => {
    const { positionX, positionY, orientation } = this.state
    const { figure } = this.props
    const newPositionX = positionX - 1
    const isLeftOccupied = figure[orientation].some(point =>
      this.isOccupiedCell(positionY - point.y, newPositionX + point.x) || newPositionX + point.x < 0
    )
    this.setState({
      positionX: !isLeftOccupied ? newPositionX : positionX
    })
  }

  moveRight = () => {
    const { positionX, positionY, orientation } = this.state
    const { figure } = this.props
    const newPositionX = positionX + 1
    const isLeftOccupied = figure[orientation].some(point =>
      this.isOccupiedCell(positionY - point.y, newPositionX + point.x) || newPositionX + point.x >= collumnsPerRows
    )
    this.setState({
      positionX: !isLeftOccupied ? newPositionX : positionX
    })
  }

  moveDown = () => {
    const { positionY, positionX, orientation, speedTime } = this.state
    const { figure } = this.props
    const newPositionY = positionY + 1
    const isLeftOccupied = figure[orientation].some(point =>
      this.isOccupiedCell(newPositionY - point.y, positionX + point.x) || newPositionY - point.y >= rows
    )
    if (!isLeftOccupied) {
      this.setState({ positionY: newPositionY })
    } else {
      this.endOfStep()
    }
  }

  turn = () => {
    const { orientation, positionX, positionY } = this.state
    const { figure } = this.props
    const newOrientation = orientation === 3 ? 0 : orientation + 1
    const arrX = figure[newOrientation].map(point => point.x)
    const leftPosition = positionX + Math.min(...arrX)
    const rightPosition = positionX + Math.max(...arrX)
    let newPositionX = positionX

    if(leftPosition < 0) {
      newPositionX = positionX - leftPosition
    } else if(rightPosition >= collumnsPerRows) {
      newPositionX = positionX - (rightPosition - collumnsPerRows + 1)
    }

    const isOccupied = figure[newOrientation].some(point =>
      this.isOccupiedCell(positionY - point.y, newPositionX + point.x)
    )

    if(isOccupied) {
      return
    }

    this.setState({
      orientation: newOrientation,
      positionX: newPositionX,
    })
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if(event.code === 'ArrowLeft') {
      this.moveLeft()
    } else if(event.code === 'ArrowRight') {
      this.moveRight()
    } else if(event.code === 'ArrowDown') {
      this.moveDown()
    } else if(event.code === 'ArrowUp' || event.code === 'Space') {
      this.turn()
    }
  }

  isOccupiedCell = (rowIndex: number, cellIndex: number, occupiedCell?: Coords) => {
    const occupiedCellList = occupiedCell || this.state.occupiedCell
    return !!occupiedCellList.find(cell => cell.x === cellIndex && cell.y === rowIndex)
  }
    

  isCellFill = (rowIndex: number, cellIndex: number) => {
    const { positionX, positionY, orientation } = this.state
    const { figure } = this.props
    const fillFigure = figure[orientation].some(point => {
      return (positionX + point.x === cellIndex && positionY - point.y === rowIndex)
    })
    if (fillFigure) {
      return true
    }

    return this.isOccupiedCell(rowIndex, cellIndex)
  }

  render() {
    const { removedLines } = this.state
    return <SpaceRoot size={cellSize}>
    {rowsArr.map((_row, rowIndex) => (
      <Row key={rowIndex}>
        {cellArr.map((_cell, cellIndex) => (
          <Cell
            key={cellIndex}
            size={cellSize}
            isFlash={removedLines.includes(rowIndex)}
            isFigure={this.isCellFill(rowIndex, cellIndex)}
          />
        ))}
      </Row>
    ))}
  </SpaceRoot>
  }
}
