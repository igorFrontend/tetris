import * as React from 'react'

import styled from 'styled-components'

import { Coords, Space } from '../Space/Space'

const AppRoot = styled.div`
  display: flex;
  margin: 15px;
`

const Info = styled.div`
  margin-left: 15px;
`

const InfoItem = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`

const InfoReset = styled.div`
  font-size: 18px;
  color: #f00;
`

const Reset = styled.button`
  margin-top: 8px;
  padding-left: 5px;
  padding-right: 5px;
  color: #000;
`

const NextFigure = styled.div`
  margin-bottom: 8px;
  width: 120px;
`

const Row = styled.div`
  display: flex;
`

const Cell = styled.div<{isFigure: boolean}>`
  position: relative;
  width: 30px;
  height: 30px;

  &::after {
    position: absolute;
    top: 4px;
    left: 4px;
    right: 3px;
    bottom: 3px;
    content: '';
    display: ${props => props.isFigure ? 'block' : 'none'};
    background-color: #555;
  }

  &::before {
    position: absolute;
    top: 0px;
    left: 0px;
    right: -1px;
    bottom: -1px;
    content: '';
    border: 1px solid #000;
    display: ${props => props.isFigure ? 'block' : 'none'};
  }
`

interface IFigureList {
  line: Coords[]
  flash: Coords[]
  flashReverse: Coords[]
  cube: Coords[]
  foot: Coords[]
  footReverse: Coords[]
  t: Coords[]
}

const cellArr = Array(4).fill(null)

const pointsTable = [0, 100, 300, 700, 1500]

const figureList: IFigureList = {
  line: [
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3} ],
    [ {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1} ],
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3} ],
    [ {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1} ],
  ],
  flash: [
    [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0} ],
    [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2} ],
    [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0} ],
    [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2} ],
  ],
  flashReverse: [
    [ {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1} ],
    [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2} ],
    [ {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1} ],
    [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2} ],
  ],
  cube: [
    [ {x: 0, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 1, y: 0} ],
    [ {x: 0, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 1, y: 0} ],
    [ {x: 0, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 1, y: 0} ],
    [ {x: 0, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 1, y: 0} ],
  ],
  foot: [
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 2, y: 0} ],
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2} ],
    [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0} ],
    [ {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2} ],
  ],
  footReverse: [
    [ {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1} ],
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 0} ],
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1} ],
    [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2} ],
  ],
  t: [
    [ {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1} ],
    [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 1} ],
    [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 0} ],
    [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 1} ],
  ],
}

const figureNames = Object.keys(figureList)

const getRandomFigure = () => figureList[figureNames[Math.floor(Math.random() * figureNames.length)] as keyof IFigureList]

export const App = () => {
  const [figure, setFigure] = React.useState(getRandomFigure())
  const [nextFigure, setNextFigure] = React.useState(getRandomFigure())
  const [points, setPoints] = React.useState(0)
  const [runGame, setRunGame] = React.useState(true)

  const handleFinishStep = React.useCallback((linesCount: number) => {
    setFigure(nextFigure)
    setNextFigure(getRandomFigure())
    setPoints(points + pointsTable[linesCount])
  }, [points, pointsTable, nextFigure, setFigure, setNextFigure])

  const handleFinishGame = React.useCallback(() => {
    setRunGame(false)
  }, [])

  const nextFigureMax = Math.max(...nextFigure[0].map(point => point.y))
  return <AppRoot>
    <Space
      figure={figure}
      run={runGame}
      onFinishStep={handleFinishStep}
      onFinishGame={handleFinishGame}
    />
    <Info>
      <InfoItem>Очки: {points}</InfoItem>
      <InfoItem>Следующая фигура</InfoItem>
      <NextFigure>
        {cellArr.map((_row, rowIndex) => <Row key={rowIndex}>
            {cellArr.map((_cell, cellIndex) =>
              <Cell
                key={cellIndex}
                isFigure={!!nextFigure[0].find(point => nextFigureMax - point.y === rowIndex && point.x === cellIndex)}
              />
            )}
          </Row>
        )}
      </NextFigure>
      {!runGame && (
        <InfoReset>
          Игра окончена!
          <br />
          <Reset
            type='button'
            onClick={() => {
              setPoints(0)
              setRunGame(true)
            }}
          >
            Начать заново
          </Reset>
        </InfoReset>
      )}
    </Info>
  </AppRoot>
}
